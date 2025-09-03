#EC2.tf

#1. Instance Creation
resource "aws_instance" "votewave_server" {
  ami                    = data.aws_ami.amazon_linux_2.id
  instance_type          = "t2.micro"
  subnet_id              = aws_subnet.votewave_subnet_a.id
  vpc_security_group_ids = [aws_security_group.votewave_sg.id]
  key_name               = aws_key_pair.votewave_key.key_name

  user_data = <<-EOF
              #!/bin/bash
              yum update -y
              yum install -y docker
              systemctl start docker
              systemctl enable docker
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
