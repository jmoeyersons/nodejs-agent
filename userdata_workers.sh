#!/usr/bin/env bash

cd ~
git clone https://github.com/moeyerke/nodejs-agent.git
cd nodejs-agent
sudo apt install npm -y
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt-get install -y nodejs 
sudo npm install
curl -L -s http://git.openstack.org/cgit/openstack/faafo/plain/contrib/install.sh | bash -s -- \
        -i faafo -r worker -e 'http://%(ip_controller)s' -m 'amqp://faafo:guest@%(ip_controller)s:5672/'
sudo npm start 