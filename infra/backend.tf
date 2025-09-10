terraform {
  backend "s3" {
    bucket         = "votewave-tfstate-bucket"
    key            = "infra/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
  }
}

