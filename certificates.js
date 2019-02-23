//'use strict';

const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;


class Certificates {

  constructor(cardName, namespace) {
    this.certNetworkConnection = new BusinessNetworkConnection();
    this.cardName = cardName;//'PDFCreator@certificate-network';
    this.namespace = namespace;//'org.university.certification';
  }

  async setupNetworkDefninition() {
    await this.certNetworkConnection.connect(this.cardName).then(result => {
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
    const createCertificate = factory.newTransaction(this.namespace, 'createCertificate');
    createCertificate.creator = factory.newRelationship(this.namespace, 'Creator', this.id);
    createCertificate.certificateHash = certificateHash;
    createCertificate.studentID = studentID;
    //submit transaction
    await this.certNetworkConnection.submitTransaction(createCertificate).then((out) => {
      return true;
    }).catch((err) => {
      console.log('Error submitting create certificate transaction', err);
    });
  }

  async queryStatusOfCertificate(certificateHash) {
    let result = await this.certNetworkConnection.query('selectCertificatesByHash', {
      certificateHash: certificateHash
    }).then((res) => {
      console.log('QUERY RETURNED THIS ', res);
      return res;
    }).catch((err) => {
      console.log('ERROR WHILE QUERYING', err);
    });
    return result;
  }

  async acceptCertificate(certificateHash) {
    //get the factory for the business network.
    let factory = this.certNetworkConnection.getBusinessNetwork().getFactory();
    //create transaction
    const acceptCertificate = factory.newTransaction(this.namespace, 'acceptCertificate');
    acceptCertificate.certificate = factory.newRelationship(this.namespace, 'Certificate', certificateHash);
    //submit transaction
    await this.certNetworkConnection.submitTransaction(acceptCertificate).then((out) => {
      return true;
    }).catch((err) => {
      console.log('Error submitting create certificate transaction', err);
    });

  }
}

module.exports = Certificates;