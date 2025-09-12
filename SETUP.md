# How to Run VoteWave (Current: Phase 2 State)

This guide will help you deploy the complete Phase 2 infrastructure and CI/CD pipeline.

---

## ✅ Prerequisites

Before starting, ensure you have:

- An **AWS Account**
- **AWS CLI** installed and configured (`aws configure`)
- **Terraform** installed
- **Git** installed
- An existing **SSH key pair** in `~/.ssh/` (e.g., `tf-aws-key.pub`)

---

## 🚀 Step 1: Clone the Repository
```bash
git clone https://github.com/MrCh0p808/VoteWave.git
cd VoteWave
```

## 🗄️ Step 2: Provision the Terraform Backend
The remote backend (S3 bucket + DynamoDB table) must be created first.

### Step 2.1: Navigate to the infra setup directory
```bash
cd infra/
```

### Step 2.2: Update S3 bucket name
Edit backend.tf and change the S3 bucket name to something globally unique:
```bash
nano backend.tf
```
### Step 2.3: Initialize and create backend resources while provisioning the Main Infrastructure
```bash
terraform init
terraform apply --auto-approve
```
### Step 2.4: Navigate back to the main project directory
```bash
cd ..
```

## 🔑 Step 3: Configure GitHub Secrets

For the CI/CD pipeline to work, add the following secrets in your GitHub repo:
Go to Settings > Secrets and variables > Actions.
```bash
AWS_ACCESS_KEY_ID → Your AWS IAM user access key
AWS_SECRET_ACCESS_KEY → Your AWS IAM user secret key
AWS_ACCOUNT_ID → Your 12-digit AWS account ID
```

##⚡ Step 4: Trigger the CI Pipeline

The pipeline runs on every push to the main branch.
Make a small change, commit, and push the code.
```bash
echo "# Test commit" >> README.md
git add .
git commit -m "feat: Trigger CI pipeline"
git push origin main
```

Check the Actions tab in GitHub to watch the pipeline build and push Docker images to ECR.

## 🌊 Project Journey & Evolution

VoteWave is being built iteratively in four phases, each adding new layers of infrastructure, automation, and DevOps practices.
Phase 2 (current) demonstrates cloud-native infrastructure, CI/CD pipelines, monitoring, and security working together in AWS.

