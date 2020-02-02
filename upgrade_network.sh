composer archive create -t dir -n . -a ./dist/certificate-network@0.1.42.bna
composer network install -a ./dist/certificate-network@0.1.42.bna -c peeradmin@hlfv1
composer network upgrade -c peeradmin@hlfv1 -n ./dist/certificate-network -V 0.1.42

