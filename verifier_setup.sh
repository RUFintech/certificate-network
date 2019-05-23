#!/bin/bash
Name=$1
Role=$2
Number=$3
NextVerifier=$4
tom="asdfasdf"
echo $Name
echo $Role
echo $Number


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