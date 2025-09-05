#Container Repository
# Repository for our Authentication service image
resource "aws_ecr_repository" "auth_service_repo" {
  name = "votewave-auth-service"
}

# Repository for our Polls service image
resource "aws_ecr_repository" "polls_service_repo" {
  name = "votewave-polls-service"
}

# We need a subnet group for RDS to know which subnets it can live in
resource "aws_db_subnet_group" "votewave_db_subnet_group" {
  name = "votewave-db-subnet-group"
  subnet_ids = [
    aws_subnet.votewave_subnet_a.id,
    aws_subnet.votewave_subnet_b.id
  ]

  tags = {
    Name = "votewave-db-subnet-group"
  }
}

resource "aws_db_instance" "votewave_db" {
  identifier             = "votewave-db-instance"
  instance_class         = "db.t3.micro"
  allocated_storage      = 20
  engine                 = "postgres"
  engine_version         = "14.17"
  username               = "postgres"
  password               = "MustBeAtLeast8Chars"
  db_subnet_group_name   = aws_db_subnet_group.votewave_db_subnet_group.name
  vpc_security_group_ids = [aws_security_group.votewave_rds_sg.id]
  publicly_accessible    = false
  skip_final_snapshot    = true
}
