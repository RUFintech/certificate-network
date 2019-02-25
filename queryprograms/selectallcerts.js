const Certificates = require('../certificates');

const cardName = 'id1@certificate-network';
const namespace = "org.university.certification";

function printCert(cert) {
  console.log('\n');
  console.log("Student ID: " + cert.studentID + ", hash: " + cert.certificateHash + ", status: " + cert.verified);
}


let tester = new Certificates(cardName, namespace);
tester.init().then(() => {


    tester.queryAllCertificates().then((res) => {
      res.forEach(cert => {
        printCert(cert);
      });

    }).catch((error) => {
      console.log("ERROR DURING QUERY", error);
    });
}).catch((err) => {
  console.log("something came up when calling accept cert ", err);
});
