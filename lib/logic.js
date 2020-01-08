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
        throw new Error('Certificate is already verified')
    }
    const verifier = acceptCertificate.verifier

    if(!certificate.verifiers.includes(verifier)) {
        throw new Error("Verifier doesn't exist in certificate array")
    }
    let verifiers = certificate.verifiers
    verifiers = verifiers.filter(val => val !== verifier)
    certificate.verifiers = verifiers
    if(verifiers.length == 0) certificate.verified = 'VERIFIED'
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
    newCertificate.verifiers = createCertificate.verifiers
    if (newCertificate.verifiers === undefined || newCertificate.verifiers.length == 0) {
        newCertificate.verifiers = []
        newCertificate.verified= 'VERIFIED'
    }

    // Add the bond asset to the registry.
    await registry.add(newCertificate);
}


/**
 * Publish a new bond
 * @param {org.university.certification.rejectCertificate} rejectCertificate - the rejectCertificate tx
 * @transaction
 */
async function rejectCertificate(rejectCertificate){
    let certificate = rejectCertificate.certificate
    if(certificate.verified === 'REJECTED') {
        throw new Error('Certificate is already in a rejected state')
    }
    const verifier = rejectCertificate.verifier

    if(!certificate.verifiers.includes(verifier)) {
        throw new Error("Verifier isn't one of the verifiers")
    }
    certificate.verified = 'REJECTED'
    const CertificateRegistry = await getAssetRegistry('org.university.certification.Certificate')
    await CertificateRegistry.update(certificate)
}