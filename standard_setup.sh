#!/bin/bash

~/fabric-dev-servers/stopFabric.sh

~/fabric-dev-servers/teardownFabric.sh

~/fabric-dev-servers/startFabric.sh

composer network install -a certificate-network@0.1.41.bna -c PeerAdmin@hlfv1

composer network start --networkName certificate-network --networkVersion 0.1.41 --networkAdmin admin --networkAdminEnrollSecret adminpw --card PeerAdmin@hlfv1

rm cards/admin@certificate-network.card
composer card delete --card admin@certificate-network

mv admin@certificate-network.card ./cards
composer card import -f cards/admin@certificate-network.card


#Uncomment to import card instead of using authentication for the rest server
#composer card import -f ./cards/PDFCreator@certificate-network.card


composer participant add -c admin@certificate-network -d '
{
  "$class": "org.university.certification.Observer",
  "School": "Reykjavik University",
  "memberId": "1"
}'
composer card delete --card observer@certificate-network
composer identity issue -c admin@certificate-network -f ./cards/observer@certificate-network.card -u observer -a "resource:org.university.certification.Observer#1"
composer card import -f ./cards/observer@certificate-network.card

composer participant add -c admin@certificate-network -d '
{
  "$class": "org.university.certification.Creator",
  "School": "Reykjavik University",
  "memberId": "0"
}
'
composer card delete --card PDFCreator@certificate-network
composer identity issue -c admin@certificate-network -f ./cards/PDFCreator@certificate-network.card -u PDFCreator -a "resource:org.university.certification.Creator#0"