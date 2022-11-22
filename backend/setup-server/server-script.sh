#!/bin/bash

# Install awscli
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
sudo apt install unzip -y
unzip awscliv2.zip
sudo ./aws/install

echo $(aws --version) > /root/awsversion

# Copy gitlab-key
aws s3 cp s3://gitlab-credential/id_rsa /root/.ssh/id_rsa
aws s3 cp s3://gitlab-credential/config /root/.ssh/config

# More secure permission
sudo chmod 400 /root/.ssh/id_rsa

# Clone souce code
git clone git@gitlab.com:nguyen-quoc-thai/crypto-digging-marketplace.git /root/src/

# install Docker using script
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# add user to Docker group
sudo usermod -aG docker ubuntu
newgrp docker

# install hasura cli
curl -L https://github.com/hasura/graphql-engine/raw/stable/cli/get.sh | bash

# install make cli
sudo apt install make

# make deploy-dev
cp /root/src/server/dotenv /root/src/server/.env
sudo bash -c 'echo "127.0.0.1 data.crypto-digging.r2ws" >> /etc/hosts'

#Install npm
sudo apt update -y
sudo apt install nodejs -y
sudo apt install npm -y

#Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
nvm install 16.13.0

sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-ports 9000

cd /root/src/server/ && make package

cd /root/src/server/ && make dev

cd /root/src/server/ && make bootstrap