resource "aws_ecr_repository" "auth_service_repo" {
  name                 = "votewave-auth-service"
  image_tag_mutability = "MUTABLE"
  force_delete         = true
}

resource "aws_ecr_repository" "polls_service_repo" {
  name                 = "votewave-polls"
  image_tag_mutability = "MUTABLE"
  force_delete         = true
}

