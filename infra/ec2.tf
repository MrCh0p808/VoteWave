#EC2.tf

#1. Instance Creation
resource "aws_instance" "votewave_server" {
  ami                    = data.aws_ami.amazon_linux_2.id
  instance_type          = "t2.micro"
  subnet_id              = aws_subnet.votewave_subnet_a.id
  vpc_security_group_ids = [aws_security_group.votewave_sg.id]
  key_name               = aws_key_pair.votewave_key.key_name
  associate_public_ip_address = true

user_data = <<-EOF
              #!/bin/bash
              yum update -y
              amazon-linux-extras install docker -y
              service docker start
              usermod -a -G docker ec2-user
              yum install -y unzip
              curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
              unzip awscliv2.zip
              ./aws/install
              EOF
  tags = {
    Name = "VoteWave-Server"
  }
}

#2. Linking Public SSH Key To AWS
resource "aws_key_pair" "votewave_key" {
  key_name   = "votewave-server-key"
  public_key = file("~/.ssh/tf-aws-key.pub")
}

#3. Outputs Public IP Of Server, DB Instance Address, Auth Repo URL, Polls Repo URL

output "server_public_ip" {
  value = aws_instance.votewave_server.public_ip
}
output "db_instance_address" {
  value = aws_db_instance.votewave_db.address
}
output "ecr_auth_repo_url" {
  value = aws_ecr_repository.auth_service_repo.repository_url
}
output "ecr_polls_repo_url" {
  value = aws_ecr_repository.polls_service_repo.repository_url
}
