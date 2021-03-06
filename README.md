# PremCerts - Certificate network
This repository is for the blockchain implementation of the **PremCerts** framework. The implementation uses Hyperledger Fabric, Composer, and Composer rest server. 

# Prerequisites

 - [Set up Hyperledger Fabric
   ](https://hyperledger.github.io/composer/v0.19/installing/installing-prereqs.html)
 - [Download fabric-dev-servers](https://github.com/hyperledger/composer-tools) -  Our scripts assume fabric-dev-servers (which is in the packages  directory) is in the root directory (~). You will need to move it so you can access the directory in ~/fabric-dev-servers.
 - Install Mongodb
- Install Python3 and Pip3

To install composer we need to switch node to version 8 and npm version 5.5.1

	nvm install 8
	nvm use --delete-prefix v8.17.0
	npm install -g npm@5.5.1

Note! It is important to use node version 8 everytime you run a composer command. Switch to node version 8 with the command nvm use 8.

Install composer and composer rest server:

    npm install -g composer-cli@0.20
    npm install -g composer-rest-server@0.20
    
If you get this *error* -".../.nvm/versions/node/v8.17.0/lib/node_modules/npm/bin/node-gyp-bin/node-gyp: Permission denied" - you may need to install node-gyp globally

    npm install -g node-gyp


# PREMCERTS process for certification
Below is a simplified BPMN of  the certification process. When a student graduates the school creates a digital certificate of their diploma. A hash is taken of the certificate and uploaded to the blockchain. A set of verifier has to accept the certificate before it gains a status of verified. 


![Simplified version of the certification processs](https://i.imgur.com/7IV5Jvs.png)


# Set up certificate network
### Create Admin Card
    cd fabric-dev-servers
    ./createPeerAdminCard.sh
    
###  Create BNA file
    cd certificate-network
    npm install
    composer archive create -t dir -n .

###  Start network
    cd certificate-network
    pip3 install -r requirements.txt
	sudo python3 startcertchain.py

### Restarting network
You can reset network by running startcertchain.py and deleting the certificate entries in psql:
    psql -U certuser
    \c certificates
    DELETE FROM certificate;

### Setup REST API
There are two types of API's: an authenticated and an unauthenticated API. 
#### Authenticated API on port 3000
The Authenticated API currently uses a github authentication strategy and a mongodb connector. When someone uploads an identity card to the authenticated API, information about the github id and identity card is stored in a mongodb collection. 

    npm install -g loopback-connector-mongodb
    npm install -g passport-github
    sudo ./comprestauth.sh
    
#### Unauthenticated API on port 3001
The Unauthenticated API uses no authentication. The API is set up using an observer identity card. The observer identity card is generated by the startcertchain.py script. 

    sudo ./compobserver3001.sh

### Upgrade network
If you want to change the business network definitions (i.e., .acl, .cto, .qry, or lib/logic.js file/s) then you must upgrade the network. 
Before you upgrade the network you must upgrade the version number in package.json, standard_setup.sh, and upgrade_network.sh. 
If package.json is like this:

  

      {
    
	    "engines": {
	    
	    "composer": "^0.20.0"
	    
	    },
	    
	    "name": "certificate-network",
	    
	    "version": "0.1.34",
	    ...
	    ...
	   }
You should change version from 0.1.34 to 0.1.35. The same applies to the three files mentioned above. 
After you have updated the version number, you should run the upgrade_network.sh script:

    ./upgrade_network.sh

# TODO

 - [ ] Upgrade from Hyperledger Composer (deprecated)
 - [x] Clean up directory. Remove unnecessary files. Group together files. 
 - [x] Make verification dynamic instead of sequential. Verifier B doesn't have to wait for verifier A to verify before they can verify. 
 - [ ] Make acceptCertificate take in multiple certificates at a time. 



