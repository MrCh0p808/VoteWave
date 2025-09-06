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
output "private_key_path" {
  value     = local_file.votewave_private_key.filename
  sensitive = true
}
