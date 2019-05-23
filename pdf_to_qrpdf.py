import qrcode
import sys
import hashlib
import os
import json
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
from PyPDF2 import PdfFileWriter, PdfFileReader
import io
import psycopg2
import projectConfig as cfg
import requests 


POINT = 1
INCH = 72

PSQL_CONN = None

def connect_to_psql():
  global PSQL_CONN
  try:
    connect_str = "dbname='{}' user='{}' host='{}' password='{}'".format(
                              cfg.postgresql['db'], cfg.postgresql['user'],
                              cfg.postgresql['host'], cfg.postgresql['passwd'])
    print(connect_str)
    PSQL_CONN = psycopg2.connect(connect_str)
  except Exception as e:
    print(e)

def print_help_message():
  message = 'Usage:\n'
  message += '\tpython3 pdf_to_qrpdf.py [PDFFILEPATH] [STUDENTID]'
  print(message)

def generate_qr_coded_pdf(file_path, student_id):

  global PSQL_CONN
  hasher = hashlib.sha256()
  content = ""
  with open(file_path, 'rb') as file:
    content = file.read()
  t = content
  hasher.update(content)

  qr = qrcode.QRCode(
      version=1,
      error_correction=qrcode.constants.ERROR_CORRECT_L,
      box_size=20,
      border=4,
  )

  original_digest = hasher.hexdigest()

  """
    generate the QR code and save it as an image to a io.BytesIO object
  """

  qr_string = 'https://www.ru.certchain.is/?certhash={}&studentid={}'.format(original_digest,student_id)
  qr.add_data(json.dumps(qr_string))
  qr.make(fit=True)
  img = qr.make_image(fill_color="black", back_color="white")
  img_bytes = io.BytesIO()
  img_bytes.seek(0)
  img.save(img_bytes, 'png')
  img_out = ImageReader(img_bytes)

  """
    Push the image data onto a PDF document, this is needed for the PyPDF2 library to 
    join the pdf documents into a single PDF with the image.
  """
  title = ".temp_qr.pdf"
  pagewidth = 8.5 * INCH
  pageheight = 11 * INCH
  imagewidth = 200
  imageheigth = 200
  imgDoc = canvas.Canvas(title, pagesize=(pagewidth, pageheight))
  imgDoc.drawImage(img_out, (pagewidth/2)-(imagewidth/2), (pageheight/2)-(imageheigth/2), imagewidth,imageheigth)
  imgDoc.save()

  """
    Construct the merged PDF.
  """
  output = PdfFileWriter()
  original_stream = PdfFileReader(open(file_path, 'rb'))
  image_stream = PdfFileReader(open(title,'rb'))

  output.appendPagesFromReader(original_stream)
  output.appendPagesFromReader(image_stream)

  """
    push the data to Postgres

    structure:
    {
      pdfhash: original pdf hash
      pdf: blob of original pdf
      pdfwithqrcode: blob of modified pdf
      studentid: id of student
    }
  """

  normal_path = '{}_{}.pdf'.format(original_digest,student_id)
  qr_path = 'qr_'+normal_path

  with open(normal_path, 'wb') as f:
    f.write(content)
  with open(qr_path, 'wb') as f:
    output.write(f)
  new_certificate = {
      'pdfhash': original_digest,
      'pdf': normal_path,
      'pdfwithqrcode': qr_path,
      'studentid': student_id
  }

  connect_to_psql()

  try:
    cursor = PSQL_CONN.cursor()
    query = "INSERT INTO certificate (pdfhash, pdf, pdfwithqrcode, studentid) VALUES (%s,%s,%s,%s)"
    vals = (
      new_certificate['pdfhash'],
      new_certificate['pdf'],
      new_certificate['pdfwithqrcode'],
      new_certificate['studentid']
    )
    cursor.execute(query,vals)
    PSQL_CONN.commit()
    #print(psycopg2.Binary(new_certificate['pdf']))
    print("{} rows were added".format(cursor.rowcount))
  except Exception as e:
    print("SOMETHING WENT WRONG IN INSERTING TO DB")
    print(e)
  finally:
    if(PSQL_CONN):
      cursor.close()
      PSQL_CONN.close()

  URL = "http://localhost:3000/api/org.university.certification.createCertificate"
  
  transaction = "org.university.certification.createCertificate"
  creator = "resource:org.university.certification.Creator#4"
    
  # defining a params dict for the parameters to be sent to the API 
  data = {
    "$class": transaction,
    "creator": creator,
    "certificateHash": original_digest,
    "studentID": student_id
    }
    
  # sending get request and saving the response as response object 
  r = requests.post(url = URL, data = data) 
    
  # extracting data in json format 
  data = r.json() 



if __name__ == '__main__':
  if len(sys.argv) <= 2:
    print_help_message()
  generate_qr_coded_pdf(sys.argv[1], sys.argv[2])
  #connect_to_psql()


#\copy (SELECT pdfwithqrcode FROM certifcate LIMIT 1) TO '/tmp/image.pdf'
