const Certificates = require('../certificates');

const cardName = 'dean@certificate-network';
const namespace = "org.university.certification";

function printCert(cert) {
  console.log('\n');
  console.log("Student ID: " + cert.studentID + ", hash: " + cert.certificateHash + ", status: " + cert.verified + ", verifier: " + cert.verifier);
}

console.log("Accepting certificate as dean");
let FILEHASH = "2asdfasdf";
let tester = new Certificates(cardName, namespace);
tester.init().then(() => {

  tester.acceptCertificate(FILEHASH).then((r) => {

    tester.queryStatusOfCertificate(FILEHASH).then((res) => {
      res.forEach(cert => {
        printCert(cert);
      });

    }).catch((error) => {
      console.log("ERROR DURING QUERY", error);
    });

  });
}).catch((err) => {
  console.log("something came up when calling accept cert ", err);
});