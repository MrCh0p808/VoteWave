# database.tf

# --- Secret Manager Setup ---
# we create a secret container
resource "aws_secretsmanager_secret" "db_password" {
  name = "votewave-db-password"
}

# generate a random secure password (length 16, with special chars)
resource "random_password" "db" {
  length           = 16
  special          = true
  override_special = "!@#$%&*"
}

# store generated password inside secret manager
resource "aws_secretsmanager_secret_version" "db_password_value" {
  secret_id     = aws_secretsmanager_secret.db_password.id
  secret_string = random_password.db.result
}

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
  engine_version          = "15.3"
  instance_class          = "db.t3.micro"
  db_name                 = "votewavedb"
  username                = "admin"

  # pulling password from secret manager

  password                = random_password.db.result

  db_subnet_group_name    = aws_db_subnet_group.votewave_db_subnet_group.name
  vpc_security_group_ids  = [aws_security_group.votewave_rds_sg.id]

  skip_final_snapshot     = true
  publicly_accessible     = false

  tags = {
    Name = "VoteWave-DB"
  }
}

