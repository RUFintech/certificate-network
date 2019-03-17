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

certHash = 'AHASHOFFILE17';
let tester = new Certificates(cardName, namespace);
tester.init().then(() => {
    tester.queryStatusOfCertificate(certHash).then((status) => {
      if(!status || status.length == 0){
        console.log("Certificate does not exist on the blockchcain. ");
        return;
      }
      verified = status[0].verified;
      if(verified == "VERIFIED") {
        console.log("Certificate is verified");
        tester.queryAssetTransactions(certHash).then((res) => {
          res.forEach(function(tx){
            console.log("Accepted by " + tx.role + ", time accepted " + tx.timestamp);
          });
        }).catch((error) => {
          console.log("ERROR DURING QUERY", error);
        });
      }
      else
      {
        console.log("Certificate has not been verified");
      }
    }).catch((error) => {
      console.log("ERROR DURING QUERY", error);
    });
}).catch((err) => {
  console.log("something came up when calling accept cert ", err);
});
