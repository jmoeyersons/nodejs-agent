#!/usr/bin/env bash
ip_addr1="$1"
ip_addr2="$2"
if [[ $ip_addr == 10* ]]
then 
ip_addr=$ip_addr1
fi
if [[ $ip_addr2 == 10* ]]
then 
ip_addr=$ip_addr2
fi
echo "Ip-adress is $ip_addr"
cd ~
git clone https://github.com/moeyerke/nodejs-agent.git
cd nodejs-agent
#sudo apt install npm -y
#curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
#sudo apt-get install -y nodejs 
#sudo npm install
echo "Going to sleep for 2min so the controller is ready..."
sleep 2m
curl -L -s http://git.openstack.org/cgit/openstack/faafo/plain/contrib/install.sh | bash -s -- \
        -i faafo -r worker -e "http://$ip_addr" -m "amqp://faafo:guest@$ip_addr:5672/"
sleep 10s
supervisorctl restart faafo_worker
#sudo npm start 