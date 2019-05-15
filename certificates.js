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
      return res;
    }).catch((err) => {
      console.log('ERROR WHILE QUERYING', err);
    });
    return result;
  }

  async queryAllCertificates() {
    let result = await this.certNetworkConnection.query('selectAllCertificates').then((res) => {
      return res;
    }).catch((err) => {
      console.log('ERROR WHILE QUERYING', err);
    });
    return result;
  }

  async queryAllCreators() {
    let result = await this.certNetworkConnection.query('selectAllCreators').then((res) => {
      return res;
    }).catch((err) => {
      console.log('ERROR WHILE QUERYING', err);
    });
    return result;
  }

  async queryAllVerifiers() {
    let result = await this.certNetworkConnection.query('selectAllVerifiers').then((res) => {
      return res;
    }).catch((err) => {
      console.log('ERROR WHILE QUERYING', err);
    });
    return result;
  }

  async queryVerifier(Id) {
    let result = await this.certNetworkConnection.query('selectVerifier',  {
      Id: Id
    }).then((res) => {
      return res;
    }).catch((err) => {
      console.log('ERROR WHILE QUERYING', err);
    });
    return result;
  }

  async queryAssetTransactions(certificateHash) {
    let result = await this.certNetworkConnection.query('selectAssetTransactions',  {
      certificateHash: certificateHash
    }).then((res) => {
      return res;
    }).catch((err) => {
      console.log('ERROR WHILE QUERYING', err);
    });
    return result;
  }


  async acceptCertificate(certificateHash) {
    //get the certificate
    this.queryStatusOfCertificate(certificateHash).then((res) => {
      res.forEach(cert => {
        let verifierId = (cert.verifier + "").split('#');
        verifierId = verifierId[1].substr(0, (verifierId[1].length - 1));
        //get the verifier
        this.queryVerifier(verifierId).then((res2) => {
          //get the role of the one accepting
          let role = res2[0].Role;
          //get the factory for the business network.
          let factory = this.certNetworkConnection.getBusinessNetwork().getFactory();
          //create transaction
          const acceptCertificate = factory.newTransaction(this.namespace, 'acceptCertificate');
          acceptCertificate.certificate = factory.newRelationship(this.namespace, 'Certificate', certificateHash);
          acceptCertificate.role = role;
          //submit transaction
          this.certNetworkConnection.submitTransaction(acceptCertificate).then((out) => {
            return true;
          }).catch((err) => {
            console.log('Error submitting create certificate transaction', err);
          });
        }).catch((err) => {
          console.log('Error submitting create certificate transaction', err);
        });
      })

    }).catch((error) => {
      console.log(error);
    });
  }
}

module.exports = Certificates;