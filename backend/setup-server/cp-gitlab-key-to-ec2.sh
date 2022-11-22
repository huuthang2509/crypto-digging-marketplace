#!/bin/bash
EC2_PUBLIC_IP=$(terraform output PublicIP | tr -d '"')
EC2_PUBLIC_DNS=$(terraform output public_dns | tr -d '"')

echo "${EC2_PUBLIC_IP}"
echo "${EC2_PUBLIC_DNS}"

scp -i "crypto-ec2-key.pem" ~/.ssh/id_rsa ubuntu@${EC2_PUBLIC_DNS}:~/.ssh/id_rsa
scp -i "crypto-ec2-key.pem" /home/thang/doantn/crypto-digging-marketplace/setup-server/setup-ssh/config ubuntu@${EC2_PUBLIC_DNS}:~/.ssh/config

# scp -i "crypto-ec2-key.pem" ~/.ssh/id_rsa "ubuntu@ec2-${EC2_PUBLIC_IP}.ap-southeast-1.compute.amazonaws.com":~/.ssh/id_rsa
# scp -i "crypto-ec2-key.pem" /home/thang/doantn/crypto-digging-marketplace/setup-server/setup-ssh/config "ubuntu@ec2-${EC2_PUBLIC_IP}.ap-southeast-1.compute.amazonaws.com":~/.ssh/config