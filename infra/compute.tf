resource "tls_private_key" "votewave_ssh" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "local_file" "votewave_private_key" {
  content         = tls_private_key.votewave_ssh.private_key_pem
  filename        = "${path.module}/votewave-key.pem"
  file_permission = "0600"
}

resource "aws_key_pair" "votewave_key" {
  key_name   = "votewave-server-key"
  public_key = tls_private_key.votewave_ssh.public_key_openssh
}

resource "aws_instance" "votewave_server" {
  ami                         = data.aws_ami.amazon_linux_2.id
  instance_type               = "t2.micro"
  key_name                    = aws_key_pair.votewave_key.key_name
  subnet_id                   = aws_subnet.votewave_subnet_a.id
  associate_public_ip_address = true
  vpc_security_group_ids      = [aws_security_group.votewave_sg.id]

  user_data = <<-EOF
    #!/bin/bash
    yum update -y
    yum install -y docker
    systemctl start docker
    systemctl enable docker
    usermod -a -G docker ec2-user
  EOF

  tags = {
    Name = "VoteWave-Server"
  }
}

data "aws_ami" "amazon_linux_2" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp2"]
  }
}

