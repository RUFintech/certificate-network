const Certificates = require('../certificates');

const cardName = 'admin@certificate-network';
const namespace = "org.university.certification";

function printVerifier(verifier) {
  console.log('\n');
  console.log("ID: " + verifier.memberId + ", school: " + verifier.School + ", role: " + verifier.Role);
  if(verifier.nextVerifier && typeof verifier.nextVerifier !== 'undefined') {
    var nextVerifier = (verifier.nextVerifier + "").split('.');
    nextVerifier = nextVerifier[nextVerifier.length - 1]
    console.log("Next Verifier: " + nextVerifier.substr(0, nextVerifier.length - 1));
  }
  else {
    console.log("Next Verifier: this participant has no next verifier");
  }
}


let tester = new Certificates(cardName, namespace);
tester.init().then(() => {
    tester.queryAssetTransactions('AHASHOFFILE10').then((res) => {
      res.forEach(verifier => {
        printVerifier(verifier);
      });

    }).catch((error) => {
      console.log("ERROR DURING QUERY", error);
    });
}).catch((err) => {
  console.log("something came up when calling accept cert ", err);
});
