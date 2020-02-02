var crypto = require('crypto');
var fs = require('fs');

class pdfToBlockChain{
    constructor(fileName, studentInformation) {
        this.fileName = fileName;
        this.studentInformation = studentInformation;
        this.hash = "";
    }

    async fileToHash() {
        var fd = fs.createReadStream(this.fileName);
        var hash = crypto.createHash('sha256');
        hash.setEncoding('hex');
        // read all file and pipe it (write it) to the hash object
        fd.pipe(hash);

        var end = new Promise(function(resolve, reject) {
            hash.on('finish', () => resolve(hash.read()));
            fd.on('error', reject); // or something like that. might need to close `hash`
        });
        return end;
    }

    studentInformationToHash() {

    }

    sendToBlockchain() {

    }

    sendToDatabase() {

    }

}

pdf = new pdfToBlockChain("example.pdf", '{"fname": "John","lname": "jeff","ssn": "2511932669"}');
pdf.fileToHash().then(function(hash) {
    console.log("HASH: " + hash);
});
