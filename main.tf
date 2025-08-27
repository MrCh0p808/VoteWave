#main.tf

#1. AWS Provider
provider "aws" {
  region = "us-east-1"
}

#2. VPC Creation
resource "aws_vpc" "votewave_vpc" {
  cidr_block = "10.0.0.0/16"
  tags = {
    Name = "VoteWave-VPC"
  }
}

#2. AMI 
data "aws_ami" "amazon_linux_2" {
  most_recent = true
  owners      = ["amazon"]
  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp2"]
  }
}
