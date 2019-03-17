#!/bin/bash

~/fabric-dev-servers/stopFabric.sh

~/fabric-dev-servers/teardownFabric.sh

~/fabric-dev-servers/startFabric.sh

composer network install -a certificate-network@0.1.16.bna -c PeerAdmin@hlfv1

composer network start --networkName certificate-network --networkVersion 0.1.16 --networkAdmin admin --networkAdminEnrollSecret adminpw --card PeerAdmin@hlfv1

rm cards/admin@certificate-network.card
composer card delete --card admin@certificate-network

mv admin@certificate-network.card ./cards
composer card import -f cards/admin@certificate-network.card

composer participant add -c admin@certificate-network -d '
{
  "$class": "org.university.certification.Verifier",
  "School": "Reykjavik University",
  "Role": "PDFStore",
  "memberId": "0"
}'

composer card delete --card PDFStore@certificate-network
composer identity issue -c admin@certificate-network -f ./cards/PDFStore@certificate-network.card -u PDFStore -a "resource:org.university.certification.Verifier#0"
composer card import -f ./cards/PDFStore@certificate-network.card

composer participant add -c admin@certificate-network -d '
{
  "$class": "org.university.certification.Verifier",
  "School": "Reykjavik University",
  "Role": "President",
  "nextVerifier": "resource:org.university.certification.Verifier#0",
  "memberId": "1"
}'

composer card delete --card president@certificate-network
composer identity issue -c admin@certificate-network -f ./cards/president@certificate-network.card -u president -a "resource:org.university.certification.Verifier#1"
composer card import -f ./cards/president@certificate-network.card

composer participant add -c admin@certificate-network -d '
{
  "$class": "org.university.certification.Verifier",
  "School": "Reykjavik University",
  "Role": "Dean",
  "nextVerifier": "resource:org.university.certification.Verifier#1",
  "memberId": "2"
}'

composer card delete --card dean@certificate-network
composer identity issue -c admin@certificate-network -f ./cards/dean@certificate-network.card -u dean -a "resource:org.university.certification.Verifier#2"
composer card import -f ./cards/dean@certificate-network.card

composer participant add -c admin@certificate-network -d '
{
  "$class": "org.university.certification.Verifier",
  "School": "Reykjavik University",
  "Role": "Department",
  "nextVerifier": "resource:org.university.certification.Verifier#2",
  "memberId": "3"
}'

composer card delete --card department@certificate-network
composer identity issue -c admin@certificate-network -f ./cards/department@certificate-network.card -u department -a "resource:org.university.certification.Verifier#3"
composer card import -f ./cards/department@certificate-network.card

composer participant add -c admin@certificate-network -d '
{
    "$class": "org.university.certification.Creator",
    "School": "Reykjavik University",
    "firstVerifier": "resource:org.university.certification.Verifier#3",
    "memberId": "4"
}'

composer card delete --card PDFCreator@certificate-network
composer identity issue -c admin@certificate-network -f ./cards/PDFCreator@certificate-network.card -u PDFCreator -a "resource:org.university.certification.Creator#4"
composer card import -f ./cards/PDFCreator@certificate-network.card
