#Program must be run with sudo. 
import subprocess
import pymongo
import os

class verifierInfo:
    def __init__(self, name, role, authidentity):
        self.name = name
        self.role = role
        self.authidentity = authidentity
    def __str__(self):
        return "Name: {name}, Role: {role}, GithubID: {authidentity}".format(name = self.name, role = self.role, authidentity = self.authidentity)
    def bla(self):
        return self.name
verifernumber = int(input("How many verifiers does your certificate network require? "))
verifierlist = []
for i in range(verifernumber):
    verifiername = input("Name of verifier {}: ".format(i + 1))
    verifierrole = input("Role of verifier {}: ".format(i + 1))
    verifierauthidentity = input("Github username(not email) of verifier {}: ".format(i + 1))
    verifierinfo = verifierInfo(verifiername, verifierrole, verifierauthidentity)
    verifierlist.append(verifierinfo)
creatorauth = input("Github username(not email) of Creator? ")
print("Creating 1 Creator, 1 Observer and {} Verifier/s".format(verifernumber))
print("Verifier information: ")
for i in range(len(verifierlist)):
    print("Verifier {}".format(i), verifierlist[i])

print("Confirm? Enter y to confirm the creation of the certificate chain with those identities")
confirm = input()
if(confirm == 'Y' or confirm == 'y'):
    shellscript = subprocess.Popen(["./standard_setup.sh"], stdin=subprocess.PIPE)
    shellscript.wait()
    for i in range(len(verifierlist)):
        shellstring = """ composer participant add -c admin@certificate-network -d '
                    {{
                    "$class": "org.university.certification.Verifier",
                    "School": "Reykjavik University",
                    "Role": "{role}",
                    "memberId": "{verifier}"
                    }}'""".format(role = verifierlist[i].role, verifier = str(i + 2))
        print(shellstring)
        shellscript1 = subprocess.Popen(shellstring, shell=True, stdout=subprocess.PIPE)
        shellscript1.wait()
        shellstring = "composer card delete --card {role}@certificate-network".format(role = verifierlist[i].role)
        shellscript2 = subprocess.Popen(shellstring, shell=True, stdout=subprocess.PIPE)
        shellscript2.wait()
        shellstring = """composer identity issue -c admin@certificate-network -f ./cards/{role}@certificate-network.card -u {role} -a "resource:org.university.certification.Verifier#{verifier}" """.format(role = verifierlist[i].role, verifier = str(i + 2))
        shellscript3 = subprocess.Popen(shellstring, shell=True, stdout=subprocess.PIPE)
        shellscript3.wait()

myclient = pymongo.MongoClient('mongodb://localhost:27017/')
myclient.drop_database('test')
myclient.drop_database('certauth')
mydb = myclient["certauth"]
mycol = mydb["gitcards"]
currpath = os.path.dirname(os.path.realpath(__file__))
for i in range(len(verifierlist)):
    cardname = verifierlist[i].role + "@certificate-network"
    cardpath = currpath + "/cards/" + cardname + ".card"
    mydict = {"card":cardname, "authID":verifierlist[i].authidentity, "cardpath": cardpath, "role": verifierlist[i].role}
    mycol.insert_one(mydict)
cardname = "PDFCreator@certificate-network"
cardpath = currpath + "/cards/" + cardname + ".card"
mydict = {"card":cardname, "authID":creatorauth, "cardpath": cardpath, "role" : "creator"}
mycol.insert_one(mydict)
for x in mycol.find():
  print(x)
