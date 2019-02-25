const Certificates = require('../certificates');

const cardName = 'id1@certificate-network';
const namespace = "org.university.certification";

function printCreator(creator) {
  console.log('\n');
  console.log("Creator ID: " + creator.memberId + ", school: " + creator.School);
  var firstVerifier = (creator.firstVerifier + "").split('.');
  firstVerifier = firstVerifier[firstVerifier.length - 1]
  console.log("First Verifier: " + firstVerifier.substr(0, firstVerifier.length - 1));
}


let tester = new Certificates(cardName, namespace);
tester.init().then(() => {
  tester.queryAllCreators().then((res) => {
      res.forEach(creator => {
        printCreator(creator);
      });

    }).catch((error) => {
      console.log("ERROR DURING QUERY", error);
    });
}).catch((err) => {
  console.log("something came up when querying for participant ", err);
});
