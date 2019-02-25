const Certificates = require('../certificates');

const cardName = 'admin@certificate-network';
const namespace = "org.university.certification";

function printVerifier(verifier) {
  console.log('\n');
  console.log("ID: " + verifier.memberId + ", school: " + verifier.School + ", role: " + verifier.Role);
  var nextVerifier = (verifier.nextVerifier + "").split('.');
  nextVerifier = nextVerifier[nextVerifier.length - 1]
  console.log("First Verifier: " + nextVerifier.substr(0, nextVerifier.length - 1));
}


let tester = new Certificates(cardName, namespace);
tester.init().then(() => {


    tester.queryAllVerifiers().then((res) => {
      res.forEach(verifier => {
        printVerifier(verifier);
      });

    }).catch((error) => {
      console.log("ERROR DURING QUERY", error);
    });
}).catch((err) => {
  console.log("something came up when calling accept cert ", err);
});
