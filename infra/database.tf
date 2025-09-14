# database.tf

# --- DB Subnet Group ---
# rds needs at least 2 subnets across different AZs

  resource "aws_db_subnet_group" "votewave_db_subnet_group" {
  name       = "votewave-db-subnet-group"
  subnet_ids = [
    aws_subnet.votewave_subnet_a.id,
    aws_subnet.votewave_subnet_b.id
  ]
  tags = {
    Name = "VoteWave-DB-SubnetGroup"
  }
}

# --- RDS Instance ---
# actual postgres database

  resource "aws_db_instance" "votewave_db" {
  identifier              = "votewave-db-instance"
  allocated_storage       = 20
  engine                  = "postgres"
  engine_version          = "14.13"
  instance_class          = "db.t3.micro"
  db_name                 = "votewavedb"
  username                = "votewaveadmin"

  # pulling password from secret manager

  password                = var.db_password

  db_subnet_group_name    = aws_db_subnet_group.votewave_db_subnet_group.name
  vpc_security_group_ids  = [aws_security_group.votewave_rds_sg.id]

  skip_final_snapshot     = true
  publicly_accessible     = false

  tags = {
    Name = "VoteWave-DB"
  }
}

#----------Add Random Password----------
resource "random_password" "db" {
  length           = 16
  special          = true
  override_special = "!@#$%&*"
}

#Local File Resource To Write Password To .env
resource "local_file" "db_env" {
  content  = "DB_PASSWORD=${random_password.db.result}"
  filename = "${path.module}/.env"
  file_permission = "0600"
}

