variable "aws_region" {
  description = "AWS region to deploy VoteWave"
  type        = string
  default     = "us-east-1"
}

variable "allowed_ip" {
  description = "CIDR block allowed to access backend (default: your local IP)"
  type        = string
  default     = "106.192.205.112/32"
}



