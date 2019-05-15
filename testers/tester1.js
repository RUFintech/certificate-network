const Certificates = require('../certificates');

const cardName = 'PDFCreator@certificate-network';
const namespace = "org.university.certification";

function printCert(cert) {
  console.log('\n');
  console.log("Student ID: " + cert.studentID + ", hash: " + cert.certificateHash + ", status: " + cert.verified + ", verifier: " + cert.verifier);
}

let FILEHASH = "AHASHOFFILE17";
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
