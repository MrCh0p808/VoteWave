#EC2.tf

#1. Instance Creation
resource "aws_instance" "votewave_server" {
  ami           = data.aws_ami.amazon_linux_2.id
  instance_type = "t2.micro"
  subnet_id     = aws_subnet.votewave_subnet.id
  vpc_security_group_ids = [aws_security_group.votewave_sg.id]
  key_name      = aws_key_pair.votewave_key.key_name
  #Script To Install Docker On Launch
   user_data = <<-EOF
              #!/bin/bash
              yum update -y
              amazon-linux-extras install docker -y
              service docker start
              usermod -a -G docker ec2-user
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

#3. Output Public IP Of Server For Access
output "server_public_ip" {
  value = aws_instance.votewave_server.public_ip
}
