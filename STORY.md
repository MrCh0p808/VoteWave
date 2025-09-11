# VoteWave Phase 2 (Current) – Complete Architecture Story

This file represents the **end-to-end story of VoteWave Phase 2**, showing all components, workflows, DevOps pipelines, and monitoring setups.

---

## 🏗️ High-Level Architecture

```mermaid
flowchart TD

    U["Users / Voters"] -->|Access App| FE["Frontend (React / HTML / CSS)"]

    FE -->|API Requests| LB["Load Balancer (ALB / NLB)"]

    LB --> BE1["EC2 Instance 1 - Backend API"]
    LB --> BE2["EC2 Instance 2 - Backend API"]

    BE1 --> DB["RDS / DynamoDB"]
    BE2 --> DB
    DB --> LOGS["Logs & Metrics (CloudWatch / ELK)"]

    BE1 --> S3["S3 Bucket - Static Files / Reports"]
    BE2 --> S3
    S3 --> LOGS

    subgraph CICD [CI/CD Pipeline]
        GIT["GitHub / Git Repo"] --> Jenkins["Jenkins / GitHub Actions"]
        Jenkins --> Build["Build & Unit Tests"]
        Build --> Deploy["Deploy to EC2 / S3"]
        Deploy --> LB
    end

    subgraph IaC [Infrastructure as Code]
        Terraform["Terraform Scripts"]
        Terraform --> AWS["AWS Resources: EC2, S3, RDS, IAM, Security Groups"]
        AWS --> LB
        AWS --> BE1
        AWS --> BE2
        AWS --> DB
        AWS --> S3
    end

    subgraph Security
        IAM["IAM Roles & Policies"]
        SG["Security Groups"]
        IAM --> BE1
        IAM --> BE2
        IAM --> S3
        SG --> BE1
        SG --> BE2
        SG --> DB
    end

    subgraph Monitoring
        CloudWatch["CloudWatch / Prometheus"]
        ELK["ELK Stack / Centralized Logs"]
        CloudWatch --> LOGS
        ELK --> LOGS
        LOGS --> Dashboard["Monitoring Dashboard & Alerts"]
    end

    S3 --> Reports["Election Reports / Analytics"]
    Reports --> Admins["Admins & Election Officers"]
```
## VoteWave Phase 2 Infra Story – Mermaid Diagram

Imagine the VoteWave infrastructure as a well-secured, automated house where each component has a role. Here's the visual story of Phase 2.

```mermaid
flowchart TD

    %% User and GitHub
    U[Developer / GitHub Actions] -->|Push Code| CI[CI/CD Pipeline]
    CI -->|Build Docker Images| ECR1[Votewave Auth ECR Repo]
    CI -->|Build Docker Images| ECR2[Votewave Polls ECR Repo]

    %% VPC and Networking
    VPC[VPC: Private Neighborhood] --> SubnetA[Subnet A: us-east-1a]
    VPC --> SubnetB[Subnet B: us-east-1b]
    IGW[Internet Gateway] --> VPC
    RT[Route Table] --> VPC
    SubnetA --> EC2A[EC2 Instance: Auth+Polls Docker]
    SubnetB --> EC2B[EC2 Instance: Auth+Polls Docker]

    %% Security Groups
    SG_EC2[SG: EC2 Servers] --> EC2A
    SG_EC2 --> EC2B
    SG_RDS[SG: RDS DB] --> RDS[RDS Postgres 14.11]
    EC2A -->|Connect Port 5432| RDS
    EC2B -->|Connect Port 5432| RDS

    %% Secrets
    SM[Secrets Manager: DB Password] --> RDS

    %% Docker Flow
    ECR1 -->|Pull Auth Image| EC2A
    ECR2 -->|Pull Polls Image| EC2A
    ECR1 -->|Pull Auth Image| EC2B
    ECR2 -->|Pull Polls Image| EC2B

    %% Terraform State Management
    S3[Terraform State Bucket: votewave-tfstate-bucket] --> DynamoDB[Lock Table: votewave-tf-locks]
    Terraform[Terraform Scripts] --> S3
    Terraform --> VPC
    Terraform --> SG_EC2
    Terraform --> SG_RDS
    Terraform --> EC2A
    Terraform --> EC2B
    Terraform --> RDS
    Terraform --> ECR1
    Terraform --> ECR2
    Terraform --> SM

    %% Flow Connections
    EC2A -->|App Running| Users[End Users Browser]
    EC2B -->|App Running| Users
```
