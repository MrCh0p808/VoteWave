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
resource "aws_subnet" "votewave_subnet" {
  vpc_id     = aws_vpc.votewave_vpc.id
  cidr_block = "10.0.1.0/24"
  map_public_ip_on_launch = true # Public IP Assign Krega
  tags = {
    Name = "VoteWave-Subnet"
  }
}

#4. Assoc RT <-> Subnet
resource "aws_route_table_association" "a" {
  subnet_id      = aws_subnet.votewave_subnet.id
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
    from_port   = 5000 # Flask App Ke Liye Port
    to_port     = 5000
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
