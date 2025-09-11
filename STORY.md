\# VoteWave Phase 2 – Complete Architecture Story



This file represents the \*\*end-to-end story of VoteWave Phase 2\*\*, showing all components, workflows, DevOps pipelines, and monitoring setups.



```mermaid

%% VoteWave Complete Architecture \& DevOps Story

graph TD

&nbsp;   %% Users

&nbsp;   U\[Users / Voters] -->|Access App| FE\[Frontend (React / HTML / CSS)]

&nbsp;   

&nbsp;   %% Frontend to Load Balancer

&nbsp;   FE -->|API Requests| LB\[Load Balancer (ALB / NLB)]

&nbsp;   

&nbsp;   %% Backend Servers

&nbsp;   LB --> BE1\[EC2 Instance 1 - Backend API]

&nbsp;   LB --> BE2\[EC2 Instance 2 - Backend API]

&nbsp;   

&nbsp;   %% Backend to Databases

&nbsp;   BE1 --> DB\[RDS / DynamoDB]

&nbsp;   BE2 --> DB

&nbsp;   DB --> LOGS\[Logs \& Metrics (CloudWatch / ELK)]

&nbsp;   

&nbsp;   %% Backend to Storage

&nbsp;   BE1 --> S3\[S3 Bucket - Static Files / Reports]

&nbsp;   BE2 --> S3

&nbsp;   S3 --> LOGS

&nbsp;   

&nbsp;   %% CI/CD Pipeline

&nbsp;   subgraph CI/CD Pipeline

&nbsp;       GIT\[GitHub / Git Repo] --> Jenkins\[Jenkins / GitHub Actions]

&nbsp;       Jenkins --> Build\[Build \& Unit Tests]

&nbsp;       Build --> Deploy\[Deploy to EC2 / S3]

&nbsp;       Deploy --> LB

&nbsp;   end

&nbsp;   

&nbsp;   %% Infrastructure as Code

&nbsp;   subgraph IaC

&nbsp;       Terraform\[Terraform Scripts]

&nbsp;       Terraform --> AWS\[AWS Resources: EC2, S3, RDS, IAM, Security Groups]

&nbsp;       AWS --> LB

&nbsp;       AWS --> BE1

&nbsp;       AWS --> BE2

&nbsp;       AWS --> DB

&nbsp;       AWS --> S3

&nbsp;   end

&nbsp;   

&nbsp;   %% Security

&nbsp;   subgraph Security

&nbsp;       IAM\[IAM Roles \& Policies]

&nbsp;       SG\[Security Groups]

&nbsp;       IAM --> BE1

&nbsp;       IAM --> BE2

&nbsp;       IAM --> S3

&nbsp;       SG --> BE1

&nbsp;       SG --> BE2

&nbsp;       SG --> DB

&nbsp;   end

&nbsp;   

&nbsp;   %% Monitoring

&nbsp;   subgraph Monitoring

&nbsp;       CloudWatch\[CloudWatch / Prometheus]

&nbsp;       ELK\[ELK Stack / Centralized Logs]

&nbsp;       CloudWatch --> LOGS

&nbsp;       ELK --> LOGS

&nbsp;       LOGS --> Dashboard\[Monitoring Dashboard \& Alerts]

&nbsp;   end

&nbsp;   

&nbsp;   %% User Feedback / Reporting

&nbsp;   S3 --> Reports\[Election Reports / Analytics]

&nbsp;   Reports --> Admins\[Admins \& Election Officers]



&nbsp;   %% Legend

&nbsp;   classDef frontend fill:#f9f,stroke:#333,stroke-width:1px;

&nbsp;   class FE frontend;

# VoteWave Phase 2 Infra Story – Mermaid Diagram



Imagine the VoteWave infrastructure as a well-secured, automated house where each component has a role. Here's the visual story of Phase 2.



```mermaid

flowchart TD

&nbsp;   %% User and GitHub

&nbsp;   U\[Developer / GitHub Actions] -->|Push Code| CI\[CI/CD Pipeline]

&nbsp;   CI -->|Build Docker Images| ECR1\[Votewave Auth ECR Repo]

&nbsp;   CI -->|Build Docker Images| ECR2\[Votewave Polls ECR Repo]



&nbsp;   %% VPC and Networking

&nbsp;   VPC\[VPC: Private Neighborhood] --> SubnetA\[Subnet A: us-east-1a]

&nbsp;   VPC --> SubnetB\[Subnet B: us-east-1b]

&nbsp;   IGW\[Internet Gateway] --> VPC

&nbsp;   RT\[Route Table] --> VPC

&nbsp;   SubnetA --> EC2A\[EC2 Instance: Auth+Polls Docker]

&nbsp;   SubnetB --> EC2B\[EC2 Instance: Auth+Polls Docker]



&nbsp;   %% Security Groups

&nbsp;   SG\_EC2\[SG: EC2 Servers] --> EC2A

&nbsp;   SG\_EC2 --> EC2B

&nbsp;   SG\_RDS\[SG: RDS DB] --> RDS\[RDS Postgres 14.11]

&nbsp;   EC2A -->|Connect Port 5432| RDS

&nbsp;   EC2B -->|Connect Port 5432| RDS



&nbsp;   %% Secrets

&nbsp;   SM\[Secrets Manager: DB Password] --> RDS



&nbsp;   %% Docker Flow

&nbsp;   ECR1 -->|Pull Auth Image| EC2A

&nbsp;   ECR2 -->|Pull Polls Image| EC2A

&nbsp;   ECR1 -->|Pull Auth Image| EC2B

&nbsp;   ECR2 -->|Pull Polls Image| EC2B



&nbsp;   %% Terraform State Management

&nbsp;   S3\[Terraform State Bucket: votewave-tfstate-bucket] --> DynamoDB\[Lock Table: votewave-tf-locks]

&nbsp;   Terraform\[Terraform Scripts] --> S3

&nbsp;   Terraform --> VPC

&nbsp;   Terraform --> SG\_EC2

&nbsp;   Terraform --> SG\_RDS

&nbsp;   Terraform --> EC2A

&nbsp;   Terraform --> EC2B

&nbsp;   Terraform --> RDS

&nbsp;   Terraform --> ECR1

&nbsp;   Terraform --> ECR2

&nbsp;   Terraform --> SM



&nbsp;   %% Flow Connections

&nbsp;   EC2A -->|App Running| Users\[End Users Browser]

&nbsp;   EC2B -->|App Running| Users







