'use strict';

const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;

const cardName = 'PDFCreator@certificate-network';
const namespace = "org.university.certification";

class Certificates {

  constructor() {
    this.certNetworkConnection = new BusinessNetworkConnection();
  }

  async setupNetworkDefninition() {
    await this.certNetworkConnection.connect(cardName).then(result => {
      console.log("CONNECTED TO BLOCKCHAIN");
      this.certNetworkDefinition = result;
    }).catch(err => {
      console.log("ERROR DURING INIT", err);
    });
  }

  async getId() {
    await this.certNetworkConnection.ping().then(res => {
      this.id = res.participant.split('#').pop();
    }).catch(err => {
      console.log('pinging failed ', err);
    });
  }

  async init() {
    await this.setupNetworkDefninition();
    await this.getId();
  }

  async createCertificateTransaction(certificateHash, studentID) {
    //get the factory for the business network.
    let factory = this.certNetworkConnection.getBusinessNetwork().getFactory();

    //create transaction
    const createCertificate = factory.newTransaction(namespace, 'createCertificate');
    createCertificate.creator = factory.newRelationship(namespace, 'Creator', this.id);
    createCertificate.certificateHash = certificateHash;
    createCertificate.studentID = studentID;
    //submit transaction
    await this.certNetworkConnection.submitTransaction(createCertificate).then((out) => {
      return true;
    }).catch((err) => {
      console.log("Error submitting create certificate transaction", err);
    });
  }

  async queryStatusOfCertificate(certificateHash) {
    let result = await this.certNetworkConnection.query('selectCertificatesByHash', {
      certificateHash: certificateHash
    }).then((res) => {
      console.log("QUERY RETURNED THIS ", res);
      return res;
    }).catch((err) => {
      console.log("ERROR WHILE QUERYING", err);
    });
    return result;
  }
}

function printCert(cert) {
  console.log(cert.certificateHash);
  console.log(cert.studentID);
  console.log(cert.verified);
}

let FILEHASH = "AHASHOFFILE8";
let STUDENTID = "42"

let tester = new Certificates();
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

