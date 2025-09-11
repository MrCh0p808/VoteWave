\# How to Run VoteWave (Current : Phase 2 State)



This guide will help you deploy the complete Phase 2 infrastructure and CI pipeline.



\### Prerequisites



\*   An AWS Account

\*   AWS CLI installed and configured (`aws configure`)

\*   Terraform installed

\*   Git installed

\*   An existing SSH key pair in `~/.ssh/` (e.g., `tf-aws-key.pub`)



\## Step 1: Clone the Repository



git clone <your-repository-url>

\_cd VoteWave\_



\## Step 2: Provision the Terraform Backend

The remote backend (S3 bucket and DynamoDB table) must be created first.



\### Step 2.1 : Navigate to the backend setup directory

\_cd terraform-backend\_



\### Step 2.2 : IMPORTANT: Open main.tf and change the S3 bucket name to something globally unique.

\_nano main.tf\_ 



\### Step 2.3 : Initialize and create the backend resources

\_terraform init

terraform apply --auto-approve\_



\### Step 2.4 : Navigate back to the main project directory

\_cd ..\_



\## Step 3: Provision the Main Infrastructure

Now, provision the core application infrastructure (VPC, EC2, RDS, ECR, etc.).



\### Step 3.1 : Navigate to the main infrastructure directory

\_cd infra

\_

\### Step 3.2 : Initialize Terraform to connect to your remote S3 backend

\_terraform init

\_

\### Step 3.3 : Apply the configuration to build the infrastructure

\_terraform apply --auto-approve\_



\## Step 4: Configure GitHub Secrets

For the CI pipeline to work, you must add the following secrets to your GitHub repository under Settings > Secrets and variables > Actions.



\*\*\_AWS\_ACCESS\_KEY\_ID\_\*\*: Your AWS IAM user access key.

\_\*\*AWS\_SECRET\_ACCESS\_KEY\*\*\_: Your AWS IAM user secret key.

\*\*\_AWS\_ACCOUNT\_ID\_\*\*: Your 12-digit AWS Account ID.



\## Step 5: Trigger the CI Pipeline

The pipeline is configured to run on every push to the main branch. Make a small change, commit, and push the code.



\### Example of a small change

echo "# Test commit" >> README.md

git add .

git commit -m "feat: Trigger CI pipeline"

git push origin main



You can now go to the Actions tab in your GitHub repository to watch the pipeline build your Docker images and push them to ECR.



\## Project Journey \& Evolution

The project is being built iteratively in four distinct phases, each layering on new skills and technologies.

