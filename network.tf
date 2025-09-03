#network.tf

#0. Get your public IP to restrict SSH access
data "http" "myip" {
  url = "http://ipv4.icanhazip.com"
}

#1. IGW
resource "aws_internet_gateway" "votewave_gw" {
  vpc_id = aws_vpc.votewave_vpc.id
  tags = {
    Name = "VoteWave-IGW"
  }
}

#2. RT
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

#3. Subnet
resource "aws_subnet" "votewave_subnet_a" {
  vpc_id                  = aws_vpc.votewave_vpc.id
  cidr_block              = "10.0.10.0/24"
  availability_zone       = "us-east-1a"
  map_public_ip_on_launch = true

  tags = {
    Name = "votewave-subnet-a"
  }
}

resource "aws_subnet" "votewave_subnet_b" {
  vpc_id                  = aws_vpc.votewave_vpc.id
  cidr_block              = "10.0.20.0/24"
  availability_zone       = "us-east-1b"
  map_public_ip_on_launch = true

  tags = {
    Name = "votewave-subnet-b"
  }
}

#4. Assoc RT <-> Subnet
resource "aws_route_table_association" "a" {
  subnet_id      = aws_subnet.votewave_subnet_a.id
  route_table_id = aws_route_table.votewave_rt.id
}

resource "aws_route_table_association" "b" {
  subnet_id      = aws_subnet.votewave_subnet_b.id
  route_table_id = aws_route_table.votewave_rt.id
}

#5. SG
resource "aws_security_group" "votewave_sg" {
  name        = "votewave-sg"
  description = "Allow HTTP and SSH traffic"
  vpc_id      = aws_vpc.votewave_vpc.id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["${chomp(data.http.myip.response_body)}/32"]
  }

  ingress {
    from_port   = 5001 # Auth Service
    to_port     = 5001
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    from_port   = 5002 # Polls Service
    to_port     = 5002
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "VoteWave-SG"
  }
}

#6. SG for the RDS Database (allows access ONLY from our EC2 instance)
resource "aws_security_group" "votewave_rds_sg" {
  name        = "votewave-rds-sg"
  vpc_id      = aws_vpc.votewave_vpc.id
  description = "Allow PostgreSQL traffic from the EC2 instance"

  # This key rule: allows inbound traffic on port 5432
  # ONLY from sources that are part of the 'votewave_sg' group.

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
    cidr_blocks = ["0.0.0.0/0"]
  }
}
