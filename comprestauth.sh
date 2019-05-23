#!/bin/bash

# Setup the Environment variables for the REST Server

#1. Set up the card to be used
export COMPOSER_MULTIUSER=true

export COMPOSER_CARD=admin@certificate-network

#2. Set up the namespace usage    always |  never
export COMPOSER_NAMESPACES=never

#3. Set up the REST server Authhentcation    true | false
export COMPOSER_AUTHENTICATION=true

#4. Set up the Passport strategy provider
export COMPOSER_PROVIDERS='{
  "github": {
    "provider": "github",
    "module": "passport-github",
    "clientID": "56caff4e2555ad942111",
    "clientSecret": "6dd31ded5e08a6c4432c9108b94e1f7035dd221e",
    "authPath": "/auth/github",
    "callbackURL": "/auth/github/callback",
    "successRedirect": "/",
    "failureRedirect": "/"
  }
}'
export COMPOSER_DATASOURCES='{
    "db": {
        "name": "db.",
        "connector": "mongodb",
        "host": "localhost"
    }
}'
#5. Execute the REST server
composer-rest-server