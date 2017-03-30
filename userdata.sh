#!/usr/bin/env bash

cd ~
git clone https://github.com/moeyerke/nodejs-agent.git
cd nodejs-agent
sudo apt install npm -y
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt-get install -y nodejs 
sudo npm install
sudo apt-get install stress-ng -y
sudo npm start & stress-ng --matrix 4 --timeout 60s 