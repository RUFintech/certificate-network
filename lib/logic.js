/**
 * Verify a certificate to it's next level of verification
 * @param {org.university.certification.acceptCertificate} acceptCertificate
 * @transaction
 */
async function acceptCertificate(acceptCertificate){
  let certificate = acceptCertificate.certificate
    if(certificate.verified === 'REJECTED') {
        throw new Error('Certificate is in rejected state')
    }
    if(certificate.verified === 'VERIFIED') {
        throw new Error('Certificate is already has verified status')
    }
    const verifier = certificate.verifier
    
    if(!verifier.nextVerifier) {
        throw new Error("Final verifier doesn't verify")
    }
    certificate.verifier = verifier.nextVerifier
    if(!verifier.nextVerifier.nextVerifier) {
        certificate.verified = 'VERIFIED'
    }
    const CertificateRegistry = await getAssetRegistry('org.university.certification.Certificate')
    await CertificateRegistry.update(certificate)
}

/* global getAssetRegistry getFactory */


/**
 * Publish a new bond
 * @param {org.university.certification.createCertificate} createCertificate - the createCertificate tx
 * @transaction
 */

async function createCertificate(createCertificate) {  // eslint-disable-line no-unused-vars

    if(!createCertificate.certificateHash){
      throw new Error('you should supply a certificatehash') 
    }
  
    const registry = await getAssetRegistry('org.university.certification.Certificate');
    const factory = getFactory();

    // Create the bond asset.
    const newCertificate = factory.newResource('org.university.certification', 'Certificate', createCertificate.certificateHash);
    // add all the correct information
  
    newCertificate.studentInformationHash = createCertificate.studentInformationHash
    newCertificate.certificateJsonHash = createCertificate.certificateJsonHash
    newCertificate.studentID = createCertificate.studentID
    newCertificate.verified = "NOT_VERIFIED"
    newCertificate.verifier = createCertificate.creator.firstVerifier

    // Add the bond asset to the registry.
    await registry.add(newCertificate);
}

