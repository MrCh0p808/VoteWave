resource "aws_db_subnet_group" "votewave_db_subnet_group" {
  name        = "votewave-db-subnet-group"
  description = "DB subnet group for VoteWave"

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
  engine                 = "postgres"
  engine_version         = "14.13"
  instance_class         = "db.t3.micro"
  allocated_storage      = 20
  username               = "postgres"
  password               = "postgrespassword123" # replace with secret manager later
  db_subnet_group_name   = aws_db_subnet_group.votewave_db_subnet_group.name
  vpc_security_group_ids = [aws_security_group.votewave_rds_sg.id]
  skip_final_snapshot    = true
  publicly_accessible    = false

  tags = {
    Name = "votewave-db-instance"
  }

  depends_on = [
    aws_db_subnet_group.votewave_db_subnet_group
  ]
}

