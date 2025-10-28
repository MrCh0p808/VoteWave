resource "aws_vpc" "votewave_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name = "VoteWave-VPC"
  }
}

resource "aws_subnet" "votewave_subnet_a" {
  vpc_id                  = aws_vpc.votewave_vpc.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "us-east-1a"
  map_public_ip_on_launch = true

  tags = {
    Name = "votewave-subnet-a"
  }
}

resource "aws_subnet" "votewave_subnet_b" {
  vpc_id                  = aws_vpc.votewave_vpc.id
  cidr_block              = "10.0.2.0/24"
  availability_zone       = "us-east-1b"
  map_public_ip_on_launch = true

  tags = {
    Name = "votewave-subnet-b"
  }
}

resource "aws_internet_gateway" "votewave_gw" {
  vpc_id = aws_vpc.votewave_vpc.id

  tags = {
    Name = "VoteWave-GW"
  }
}

resource "aws_route_table" "votewave_rt" {
  vpc_id = aws_vpc.votewave_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.votewave_gw.id
  }

  tags = {
    Name = "VoteWave-RT"
  }
}

resource "aws_route_table_association" "a" {
  subnet_id      = aws_subnet.votewave_subnet_a.id
  route_table_id = aws_route_table.votewave_rt.id
}

resource "aws_route_table_association" "b" {
  subnet_id      = aws_subnet.votewave_subnet_b.id
  route_table_id = aws_route_table.votewave_rt.id
}

resource "aws_security_group" "votewave_sg" {
  vpc_id      = aws_vpc.votewave_vpc.id
  name        = "votewave-sg"
  description = "Security group for VoteWave services"

  ingress {
    from_port   = 5001
    to_port     = 5001
    protocol    = "tcp"
    cidr_blocks = [var.allowed_ip]
    description = "Restricted backend API access"
  }

  ingress {
    from_port   = 5002
    to_port     = 5002
    protocol    = "tcp"
    cidr_blocks = [var.allowed_ip]
    description = "Restricted backend API access"
  }

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["${chomp(data.http.myip.response_body)}/32"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = [var.allowed_ip]
  }

  tags = {
    Name = "VoteWave-SG"
  }
}

resource "aws_security_group" "votewave_rds_sg" {
  vpc_id      = aws_vpc.votewave_vpc.id
  name        = "votewave-rds-sg"
  description = "Allow PostgreSQL traffic from EC2"

  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.votewave_sg.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = [var.allowed_ip]
  }
}

