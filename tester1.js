const Certificates = require('./certificates');

const cardName = 'PDFCreator@certificate-network';
const namespace = "org.university.certification";

function printCert(cert) {
  console.log(cert.certificateHash);
  console.log(cert.studentID);
  console.log(cert.verified);
}

let FILEHASH = "AHASHOFFILE10";
let STUDENTID = "42"

let tester = new Certificates(cardName, namespace);
tester.init().then(() => {

  tester.createCertificateTransaction(FILEHASH, STUDENTID).then((r) => {

    tester.queryStatusOfCertificate(FILEHASH).then((res) => {
      res.forEach(cert => {
        printCert(cert);
      });

    }).catch((error) => {
      console.log("ERROR DURING QUERY", error);
    });

  });
}).catch((err) => {
  console.log("something came up when calling createCert ", err);
});