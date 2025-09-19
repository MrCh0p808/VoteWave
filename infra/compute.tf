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
    set -e
    yum update -y
    yum install -y docker jq
    curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "/tmp/awscliv2.zip"
    unzip -q /tmp/awscliv2.zip -d /tmp
    /tmp/aws/install
    systemctl start docker
    systemctl enable docker
    usermod -a -G docker ec2-user

    # So app loads DB creds via python-dotenv
    mkdir -p /home/ec2-user/app
    cat > /home/ec2-user/app/.env <<EOT
    DB_HOST=${aws_db_instance.votewave_db.address}
    DB_NAME=${aws_db_instance.votewave_db.db_name}
    DB_USER=${aws_db_instance.votewave_db.username}
    DB_PASSWORD=${random_password.db.result}
    EOT
    chown -R ec2-user:ec2-user /home/ec2-user/app

    # Login to ECR and pull images
    AWS_REGION="${var.aws_region != "" ? var.aws_region : "us-east-1"}"
    $(aws ecr get-login-password --region ${aws_region} | xargs -I{} echo docker login --username AWS --password-stdin ${aws_ecr_repository.auth_service_repo.repository_url} ) || true

    # Pull images
    docker pull ${aws_ecr_repository.auth_service_repo.repository_url}:latest || true
    docker pull ${aws_ecr_repository.polls_service_repo.repository_url}:latest || true

    # Run containers
    docker rm -f votewave-auth || true
    docker rm -f votewave-polls || true

    docker run -d --restart always --name votewave-auth --env-file /home/ec2-user/app/.env -p 5001:5001 ${aws_ecr_repository.auth_service_repo.repository_url}:latest
    docker run -d --restart always --name votewave-polls --env-file /home/ec2-user/app/.env -p 5002:5002 ${aws_ecr_repository.polls_service_repo.repository_url}:latest
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

