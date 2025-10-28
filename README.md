# VoteWave : Cloud-Native Polling App

<p align="center">
  <!-- Project Status -->
  <img src="https://img.shields.io/badge/Status-Active-brightgreen?style=flat-square" alt="Status" style="height:22px;">&nbsp;&nbsp;

  <!-- Contributions -->
  <a href="https://github.com/MrCh0p808/AnnaSewa?tab=readme-ov-file#-contribution">
  <img src="https://img.shields.io/badge/Contributions-Welcome-blueviolet?style=flat-square&logo=github&logoColor=white" alt="Contributions" style="height:22px;">
  </a>&nbsp;&nbsp;
  <!-- LinkedIn -->
  <a href="https://www.linkedin.com/in/trideev-ganguly/">
    <img src="https://img.shields.io/badge/Connect%20on%20LinkedIn-0A66C2?style=flat-square&logo=linkedin&logoColor=white"height=22px>
  </a>&nbsp;&nbsp;
  <!-- LICENSE -->
  <a href="https://github.com/MrCh0p808/VoteWave/blob/main/LICENSE]">
    <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="License" style="height:22px;">
  </a>&nbsp;&nbsp;
  <!-- Made With Love -->
  <a href="https://img.shields.io/badge/Made%20with-❤️-red.svg">
    <img src="https://img.shields.io/badge/Made%20with-❤️-red.svg" alt="License" style="height:22px;">
  </a>&nbsp;&nbsp;
</p>
<p align="center">
  <!-- Frontend -->
  <a href="https://react.dev/">
    <img src="https://img.shields.io/badge/Frontend-React-61DAFB?style=flat-square&logo=react&logoColor=white" alt="React" style="height:22px;">
  </a>
  <!-- Backend -->
  <a href="https://www.python.org/doc/">
    <img src="https://img.shields.io/badge/Backend-Python-3776AB?style=flat-square&logo=python&logoColor=white" alt="Python" style="height:22px;">
  </a>
  <a href="https://fastapi.tiangolo.com/">
    <img src="https://img.shields.io/badge/API-FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white" alt="FastAPI" style="height:22px;">
  </a>
  <a href="#">
    <img src="https://img.shields.io/badge/API-REST-02569B?style=flat-square&logo=rest&logoColor=white" alt="REST API" style="height:22px;">
  </a>
  <!-- Cloud + Infra -->
  <a href="https://aws.amazon.com/">
    <img src="https://img.shields.io/badge/AWS-EC2%20%7C%20RDS%20%7C%20S3-orange?logo=amazon-aws" alt="AWS" style="height:22px;">
  </a>
  <a href="https://aws.amazon.com/">
    <img src="https://img.shields.io/badge/Cloud-AWS-FF9900?style=flat-square&logo=amazonaws&logoColor=white" alt="AWS" style="height:22px;">
  </a>
  <a href="https://docs.aws.amazon.com/eks/">
    <img src="https://img.shields.io/badge/Kubernetes-EKS-FF9900?style=flat-square&logo=kubernetes&logoColor=white" alt="EKS" style="height:22px;">
  </a>
  <a href="https://developer.hashicorp.com/terraform/docs">
    <img src="https://img.shields.io/badge/IaC-Terraform-7B42BC?style=flat-square&logo=terraform&logoColor=white" alt="Terraform" style="height:22px;">
  </a>
  <a href="https://docs.docker.com/">
    <img src="https://img.shields.io/badge/Containers-Docker-2496ED?style=flat-square&logo=docker&logoColor=white" alt="Docker" style="height:22px;">
  </a>
  <a href="https://kubernetes.io/docs/">
    <img src="https://img.shields.io/badge/Orchestration-Kubernetes-326CE5?style=flat-square&logo=kubernetes&logoColor=white" alt="Kubernetes" style="height:22px;">
  </a>
  <a href="https://docs.github.com/en/actions">
    <img src="https://img.shields.io/badge/CI%2FCD-GitHub_Actions-2088FF?style=flat-square&logo=githubactions&logoColor=white" alt="GitHub Actions" style="height:22px;">
  </a>

  <!-- Monitoring -->
  <a href="https://docs.aws.amazon.com/cloudwatch/">
    <img src="https://img.shields.io/badge/Monitoring-CloudWatch-FF4F8B?style=flat-square&logo=amazoncloudwatch&logoColor=white" alt="CloudWatch" style="height:22px;">
  </a>
  <a href="https://grafana.com/docs/">
    <img src="https://img.shields.io/badge/Monitoring-Grafana-F46800?style=flat-square&logo=grafana&logoColor=white" alt="Grafana" style="height:22px;">
  </a>
</p>

---

Welcome to **VoteWave**, my *Dhaansu* Terraform project for deploying a cloud-native polling/voting app on **AWS EC2** and **RDS Postgres**!  
This repo automates the **entire infrastructure lifecycle**, from networking and security to compute, storage, schema initialization, and full observability.

---

## 📂 What's Inside?

- 📖 **[STORY.md](docs/STORY.md)** – The journey, story, and vision behind VoteWave  
- ⚙️ **[SETUP.md](docs/SETUP.md)** – Step-by-step setup and deployment guide  
- 📑 **[DOCS.md](docs/DOCS.md)** – Phase-wise development and infrastructure documentation  

---

## Expanded Architecture (September–October 2025)

VoteWave’s architecture is a full-stack playground where every piece talks cleanly to each other.

### 1. External Layer: 
Users and admins access a React + TypeScript UI handling login, profiles, polls, feeds, notifications, VoteBooth, and chat. State manages sessions, feeds, votes, and profiles, while API requests carry JWTs via axios/fetch.

### 2. Public Infrastructure: 
Requests hit an Application Load Balancer in the public subnet, then route to a private API Gateway. Security is tight -only allowed sources reach backend services on ports 5001–5002.

### 3. Private Services: 
Microservices sit behind the gateway:

- Auth (login/profile), Profiles (metadata), Polls (create/vote/cache)
- Follows, Expressions, Comments, Feed, Notifications, VoteBooth, Messaging
- Planned services: Reactions, Reports

### 4. Shared Cloud Resources: 
PostgreSQL RDS stores relational data, Redis handles caching and pub/sub, and S3 stores media. Observability via CloudWatch, Prometheus, and Grafana tracks metrics, alerts, and traces.

### 5. Infra & Dev Builds: 
Terraform provisions VPCs, subnets, security groups, databases, and caches. Docker Compose spins up local environments mirroring production.

### 6. Service Flow: 
User → UI → API → ALB → API Gateway → microservices → shared resources. Every service knows where to get data, cache results, and push updates.

<p>This setup is both sandbox and production-ready. I can iterate fast, scale services independently, monitor everything, and add new microservices, analytics, or reactions seamlessly. VoteWave is now a living ecosystem of microservices, cloud infra, and observability working together effortlessly.

I want this diagram to reflect **all planned microservices**, the shared infra, observability, and dependencies.</p>

```mermaid
---
config:
  theme: dark
  layout: elk
  look: classic
---
flowchart LR
 subgraph EXT["🌍 External Systems (Public Internet)"]
        USER(["End User / Admin"])
  end
 subgraph FE["🖥️ Frontend (React + TypeScript)  - Public"]
        UI(["Web UI\nLogin, Profile, Polls, Feed, Notifications, VoteBooth, Chat"])
        API(["API Client Layer\naxios/fetch\nHandles JWT"])
        STATE(["React State\nSession, Feed, PollVote, Profile"])
  end
 subgraph PUB["Public Subnet"]
        ALB[/"Application Load Balancer\nRoutes to API Gateway"/]
  end
 subgraph PRIV["Private Subnet"]
        APIGW[/"API Gateway\nAuthorizes + Routes Requests"/]
        SGNOTE(["Security Groups:\nOnly ALB or VPC CIDR\nPorts 5001–5002"])
  end
 subgraph NET["🏗️ Networking + Infrastructure"]
        TF{{"Terraform - IaC\nCreates VPC, Subnets, SGs, RDS, Redis, S3"}}
        DOCKER{{"Docker Compose / Dev Builds"}}
  end
 subgraph SERVICES["🛠️ Microservices & Planned Services"]
        AUTH["🔐 Auth Service\nLogin/Register/Profile"]
        PROF["👤 Profiles\nUser Profiles & Metadata"]
        POLLS["📊 Polls\nCreate, Vote, Cache Results"]
        FOL["🔗 Follows\nFollow/Unfollow/List"]
        EXPR["🌊 Expressions\nWave/Ripple"]
        COMM["💬 Comments\nThreaded Poll Comments"]
        FEED["📰 Feed & Discovery\nPersonalized feed, search, trends"]
        NOTIF["🔔 Notifications\nList/Mark Read"]
        BOOTH["🏛️ VoteBooth\nPin Poll, Join Booth"]
        MSG["💬 Messaging\nWebSocket Chat / PubSub"]
        REACTIONS["❤️ Reactions Service (Planned)\nLike / Clap / Emoji"]
        REPORTS["📈 Reports Service (Planned)\nAnalytics / Election Reports"]
  end
 subgraph SHARED["☁️ Shared Cloud Resources  - Private"]
        RDS[("🐘 PostgreSQL RDS\nUsers, Profiles, Polls, Follows, Expressions, Comments, Notifications")]
        REDIS{{"⚡ Redis Cache\nPollResults, SessionStore, Pub/Sub"}}
        S3[["🪣 S3 Buckets\npollCovers/, userUploads/"]]
        OBS["🔭 Observability\nCloudWatch + Prometheus + Grafana"]
  end
    USER --> UI
    UI --> API
    API --> ALB
    ALB --> APIGW
    APIGW --> AUTH & PROF & POLLS & FOL & EXPR & COMM & FEED & NOTIF & BOOTH & MSG & REACTIONS & REPORTS
    AUTH --> RDS
    PROF --> RDS
    POLLS --> RDS & S3 & REDIS
    FOL --> RDS
    EXPR --> RDS
    COMM --> RDS
    FEED --> RDS & REDIS
    NOTIF --> RDS
    BOOTH --> RDS
    MSG --> RDS & REDIS
    REACTIONS --> RDS
    REPORTS --> RDS & S3
    SHARED --> RDS & REDIS & S3 & OBS
    TF --> SHARED
    DOCKER --> AUTH & PROF & POLLS & FOL & EXPR & COMM & FEED & NOTIF & BOOTH & MSG
    caption["VoteWave  - Full Microservices Architecture + Shared Infra + Observability Layer"]
````

---

## 🧭 VoteWave Architecture Evolution (Old vs New)

```mermaid
flowchart LR
subgraph OLD["🌊 Phase 2 — Early Microservices + Basic Standards"]
direction TB
  OARCH["🏗️ Architecture<br>EC2 + RDS + S3 + Terraform (v1)"]
  OAUTH["🔐 Auth Service<br>Login / Register / JWT"]
  OPROF["👤 Profiles Service<br>Public Profile / Pic"]
  OPOLLS["📊 Polls Service<br>Polls + Votes"]
  OFOL["🔗 Follows Service"]
  OEXPR["🌊 Expressions Service"]
  OCOMM["💬 Comments Service"]
  OFEED["📰 Feed Service<br>Trending + Search"]
  ONOTIF["🔔 Notifications Service"]
  OINFRA["☁️ Infra<br>Terraform + Docker + ALB"]
  OSTD["📜 API Standards<br>PEP8 • REST nouns • JWT users<br>No observability"]
end

%% Spacer to visually separate columns
EMPTY[ ]

subgraph NEW["☁️ Phase 3 — Cloud-Native + Evolved Standards"]
direction TB
  NARCH["🏗️ Architecture<br>Terraform Full Stack + Private Subnets<br>ECR → ECS/EKS Pipeline"]
  NAUTH["🔐 Auth v2<br>Refresh Tokens + Secrets Rotation"]
  NPROF["👤 Profiles v2<br>Audit Logs → CloudWatch"]
  NPOLLS["📊 Polls v2<br>Redis Cache + S3 Covers + Event Hooks"]
  NFOL["🔗 Follows v2<br>Streams → Feed"]
  NEXPR["🌊 Expressions v2<br>Metrics → Prometheus"]
  NCOMM["💬 Comments v2<br>Moderation + Soft Delete"]
  NFEED["📰 Feed v2<br>Redis + Search Engine (FTS)"]
  NNOTIF["🔔 Notifications v2<br>Async Jobs + Bulk API"]
  NBOOTH["🏛 VoteBooth (New)<br>Realtime Poll Rooms"]
  NMSG["💬 Messaging (New)<br>WebSockets + Redis Pub/Sub"]
  NREACT["😀 Reactions (New)<br>Likes / Claps / Emoji"]
  NREPORTS["📈 Reports (New)<br>Aggregated Analytics → S3"]
  NOBS["🔭 Observability Layer<br>CloudWatch + Prometheus + Grafana"]
  NSEC["🔐 Security & IAM<br>AWS Secrets Manager + SG Hardening"]
  NSTD["📜 API Standards v2<br>OpenAPI • Trace IDs • Rate Limits • Grafana Metrics"]
end

%% Connections between old and new
OARCH --> NARCH
OAUTH --> NAUTH
OPROF --> NPROF
OPOLLS --> NPOLLS
OFOL --> NFOL
OEXPR --> NEXPR
OCOMM --> NCOMM
OFEED --> NFEED
ONOTIF --> NNOTIF
OINFRA --> NOBS
OSTD --> NSTD

%% Newly added services
NBOOTH -. Added .-> NMSG
NMSG -. Realtime Chat .-> NOBS
NREACT -. Reactions .-> NREPORTS
NREPORTS -. Analytics .-> NOBS
NSEC -. Security Upgrade .-> NARCH

%% Style
classDef old fill:#ffe8c6,stroke:#555,color:#000
classDef new fill:#c2ffd8,stroke:#333,color:#000
class OARCH,OAUTH,OPROF,OPOLLS,OFOL,OEXPR,OCOMM,OFEED,ONOTIF,OINFRA,OSTD old
class NARCH,NAUTH,NPROF,NPOLLS,NFOL,NEXPR,NCOMM,NFEED,NNOTIF,NBOOTH,NMSG,NREACT,NREPORTS,NOBS,NSEC,NSTD new

```

## Microservice Dependencies & Observability

This part maps how VoteWave’s microservices talk to shared resources and how we keep everything observable.

### 1. Polls Service: 
Caches poll results in Redis for fast retrieval and stores poll cover images in S3. This keeps the app responsive and media persistent.
### 2. Feed Service: 
Uses Redis to cache personalized feeds, so users get near-instant updates without hammering the database.
### 3. Messaging Service: 
Relies on Redis pub/sub channels to handle real-time chat, keeping messages flowing smoothly.
### 4. Reports Service (Planned): 
Pulls data from S3 to generate analytics and election reports without stressing the core database.
### 5. Observability: 
Every service -literally all of them -pushes logs and metrics to CloudWatch, Prometheus, and Grafana. 
That means I can see everything from API performance to cache hits, trace requests across services, and set alerts for any hiccups.

<p>Basically, Redis and S3 act like the shared brain and storage for microservices, while CloudWatch, Prometheus, and Grafana give me full visibility into the system. The services are decoupled but still talk cleanly through these shared resources, making debugging, scaling, and monitoring super smooth.</p>

```mermaid
flowchart LR
    POLLS --> REDIS["Cache Poll Results"]
    POLLS --> S3["Store Poll Covers"]
    FEED --> REDIS["Feed Cache"]
    MSG --> REDIS["Pub/Sub Channel"]
    REPORTS --> S3["Generate Reports"]
    ALL["All Services"] --> OBS["Logs & Metrics\nCloudWatch + Prometheus + Grafana"]
```

---

## CI/CD & Terraform Interaction

I wanted Terraform to provision infra and GitHub Actions to handle builds and deployments, all in sync.

```mermaid
flowchart LR
    Dev["Developer Push Code"] --> GH["GitHub Actions"]
    GH --> Build["Build Docker Images"]
    Build --> ECR["Push to AWS ECR"]
    TF["Terraform Apply"] --> Infra["Provision VPC, RDS, Redis, S3, ALB, Secrets"]
    Infra --> APIGW
    ECR --> APIGW
    APIGW --> Services["Microservices"]
```

---

## End-to-End Request Flow (Expanded)

```mermaid
sequenceDiagram
    autonumber
    participant U as 👤 User
    participant UI as 🖥️ Web UI
    participant ALB as ⚖️ ALB
    participant APIGW as 🚪 API Gateway
    participant AUTH as 🔐 Auth Service
    participant POLLS as 📊 Polls Service
    participant FEED as 📰 Feed
    participant MSG as 💬 Messaging
    participant RDS as 🐘 DB
    participant REDIS as ⚡ Cache
    participant S3 as 🪣 Storage

    U->>UI: Login or Register
    UI->>ALB: Request
    ALB->>APIGW: Forward
    APIGW->>AUTH: /login
    AUTH->>RDS: Verify user
    RDS-->>AUTH: Return token
    AUTH-->>UI: JWT
    UI->>APIGW: Fetch Feed / Polls
    APIGW->>FEED: /feed
    FEED->>RDS: Aggregate
    FEED->>REDIS: Update cache
    UI->>APIGW: Vote / Reaction
    APIGW->>POLLS: /vote
    POLLS->>RDS: Insert vote
    POLLS->>REDIS: Update cache
    UI->>APIGW: Upload media
    APIGW->>S3: Store cover images
    UI->>APIGW: Chat
    APIGW->>MSG: Send message
    MSG->>REDIS: Publish event
```

---

## End-to-End Request LifeCycle

```mermaid
sequenceDiagram
    autonumber
    participant U as 👤 User
    participant UI as Frontend
    participant ALB as ⚖️ ALB
    participant APIGW as API Gateway
    participant S as Services
    participant DB as RDS
    participant Cache as Redis

    U->>UI: Submit action
    UI->>ALB: Forward request
    ALB->>APIGW: Route
    APIGW->>S: Target service
    S->>DB: Read/Write
    S->>Cache: Update cache or pub/sub
    S-->>APIGW: Response
    APIGW-->>UI: Send data
    UI->>U: Display update
```

---
## ⚡ Recommended Setup

### Export AWS Credentials
```bash
export AWS_ACCESS_KEY_ID="your_access_key"
export AWS_SECRET_ACCESS_KEY="your_secret_key"
```

Ensure your local machine has Terraform installed (terraform -v).

Follow **[SETUP.md](docs/SETUP.md)** for detailed deployment instructions.

## MicroServices At Glance
```mermaid
---
config:
  theme: neo-dark
  layout: elk
---
flowchart LR
 subgraph Auth["🔐 Authentication Service"]
        AuthDesc["Purpose: Authenticate users, register, issue tokens"]
        AuthAPI["API Endpoints:\nPOST /auth/register\nPOST /auth/login\nGET /auth/profile"]
        AuthDB["DB Schema:\nusers(id, email, password_hash, created_at)"]
  end
 subgraph Profiles["👤 Profiles & Identity Service"]
        ProfDesc["Purpose: Manage public profiles (bio, pic)"]
        ProfAPI["API Endpoints:\nGET /profiles/{id}\nPUT /profiles"]
        ProfDB["DB Schema:\nprofiles(user_id, username, bio, profile_pic_url)"]
  end
 subgraph Polls["📊 Polls Service"]
        PollsDesc["Purpose: Create polls, votes, cache results"]
        PollsAPI["API Endpoints:\nPOST /polls/create\nPOST /polls/vote\nGET /polls/{id}"]
        PollsDB["DB Schema:\npolls(id, question, options[], cover_img_url)\nvotes(id, poll_id, user_id, option_index)"]
  end
 subgraph Follows["🔗 Follows Service"]
        FollowsDesc["Purpose: Manage follow relationships"]
        FollowsAPI["API Endpoints:\nPOST /follows/{id}\nDELETE /follows/{id}\nGET /followers/{id}\nGET /following/{id}"]
        FollowsDB["DB Schema:\nfollows(follower_id, followed_id, created_at)"]
  end
 subgraph Expressions["🌊 Expressions Service"]
        ExprDesc["Purpose: Manage Waves (strong) & Ripples (soft)"]
        ExprAPI["API Endpoints:\nPOST /expressions/{item_id}\nDELETE /expressions/{item_id}"]
        ExprDB["DB Schema:\nexpressions(id, user_id, item_id, type: wave|ripple, created_at)"]
  end
 subgraph Comments["💬 Comments Service"]
        CommDesc["Purpose: Threaded discussions under polls"]
        CommAPI["API Endpoints:\nPOST /comments/{item_id}\nGET /comments/{item_id}\nDELETE /comments/{comment_id}"]
        CommDB["DB Schema:\ncomments(id, user_id, item_id, text, created_at)"]
  end
 subgraph Feed["📰 Feed & Discovery Service"]
        FeedDesc["Purpose: Personalized feeds, search, trending"]
        FeedAPI["API Endpoints:\nGET /feed\nGET /search\nGET /explore/trending"]
        FeedLogic["Business Logic:\nCombine follows, engagement, trends\nUse Postgres FTS/Elasticsearch"]
  end
 subgraph Notifs["🔔 Notifications Service"]
        NotifDesc["Purpose: Real-time user notifications"]
        NotifAPI["API Endpoints:\nGET /notifications\nPOST /notifications/mark-read"]
        NotifDB["DB Schema:\nnotifications(id, recipient_id, sender_id, type, content_id, is_read, created_at)"]
  end
 subgraph Infra["☁️ Shared Infrastructure"]
        RDS["🐘 PostgreSQL RDS:\nusers, profiles, polls, follows, expressions, comments, notifications"]
        Redis["⚡ Redis:\npollResultsCache, sessionStore"]
        S3["🪣 S3:\npollCovers/, userUploads/"]
        Tools["Terraform: provision infra\nDocker: containerize services\nALB+API GW: route requests"]
  end
 subgraph ARCH["📖 VoteWave Microservices Architecture"]
    direction TB
        Auth
        Profiles
        Polls
        Follows
        Expressions
        Comments
        Feed
        Notifs
        Infra
  end
 subgraph Login["1️⃣ User Login"]
        L1["User -> UI: enter credentials"]
        L2["UI -> API Gateway -> Auth Service"]
        L3["Auth -> RDS: verify user"]
        L4["Auth -> UI: return JWT token"]
  end
 subgraph CreatePoll["2️⃣ Create Poll"]
        CP1["User -> UI: fill form"]
        CP2["UI -> API Gateway -> Polls Service"]
        CP3["Polls -> RDS: insert poll"]
        CP4["Polls -> S3: upload cover image"]
        CP5["Polls -> UI: poll_id returned"]
  end
 subgraph Vote["3️⃣ Cast Vote"]
        V1["User -> UI: vote"]
        V2["UI -> API Gateway -> Polls Service"]
        V3["Polls -> RDS: insert vote"]
        V4["Polls -> Redis: update pollResultsCache"]
        V5["Polls -> UI: success response"]
  end
 subgraph Expression["4️⃣ Wave/Ripple"]
        E1["User -> UI: send Wave/Ripple"]
        E2["UI -> API Gateway -> Expressions Service"]
        E3["Expressions -> RDS: insert wave/ripple"]
        E4["Expressions -> UI: updated UI"]
  end
 subgraph Notify["5️⃣ Notifications"]
        N1["Event: poll/vote/comment/follow"]
        N2["Service -> Notifications -> RDS: insert notification"]
        N3["User -> UI: GET /notifications"]
        N4["Notifications -> RDS: fetch list"]
        N5["UI: display notifications"]
  end
 subgraph LIFECYCLES["🔄 Request Lifecycle Examples"]
    direction TB
        Login
        CreatePoll
        Vote
        Expression
        Notify
  end
```
## STANDARDS & API GUIDELINES
```mermaid
---
config:
  theme: redux-dark
  layout: dagre
---
flowchart TB
caption["VoteWave Standards & API Guidelines"]
 subgraph STYLE["Code Style"]
        PY["Python: PEP8 + Black"]
        TS["TypeScript: ESLint + Prettier"]
        COMMITS["Commits: Conventional"]
  end
 subgraph ERRORS["Error Handling"]
        JSONERR["JSON: {error,msg,code}"]
        HTTPERR["HTTP: 2xx/4xx/5xx"]
        VALID["Validation errors: 422"]
  end
 subgraph AUTH["Authentication"]
        USERJWT["JWT for users"]
        SRVJWT["JWT for services"]
        REFRESH["Token refresh flow"]
  end
 subgraph VERSION["API Versioning"]
        V1["Prefix: /api/v1/"]
        V2["Breaking → /api/v2/"]
  end
 subgraph DBMIG["Database Migrations"]
        ALEMBIC["Alembic / Flyway"]
        SCHEMA["Per-service schema"]
  end
 subgraph TESTS["Testing"]
        UNIT["Unit: pytest / Jest"]
        INTEG["Integration: Docker Compose"]
        E2E["E2E: Postman / Playwright"]
        LOAD["Load: k6"]
  end
 subgraph LOGGING["Logging & Monitoring"]
        LOGS["JSON logs (stdout)"]
        LEVELS["Levels: DEBUG→ERROR"]
        PROM["Prometheus + Grafana"]
        ALERTS["Alerts: CPU/mem/Redis"]
  end
 subgraph SECRETS["Secrets & Config"]
        ENV[".env local only"]
        AWSSEC["AWS Secrets Manager"]
        ROTATE["Rotate credentials"]
  end
 subgraph RATE["Rate Limiting & Security"]
        RLIMIT["Redis token bucket"]
        PROTECT["Protect login/chat"]
        CORS["Strict CORS"]
  end
 subgraph ARCH["Standards & Conventions"]
    direction TB
        STYLE
        ERRORS
        AUTH
        VERSION
        DBMIG
        TESTS
        LOGGING
        SECRETS
        RATE
  end
 subgraph REST["REST Principles"]
        NOUNS["Resources = nouns (/polls)"]
        VERBS["Actions = HTTP verbs"]
  end
 subgraph ENDPOINTS["Endpoints"]
        POST["POST /resource → create"]
        GETALL["GET /resource → list"]
        GETONE["GET /resource/{id} → retrieve"]
        PUT["PUT /resource/{id} → update"]
        DEL["DELETE /resource/{id} → remove"]
  end
 subgraph REQRES["Request & Response"]
        FORMAT["JSON only"]
        VALIDATE["Schema validation"]
        SUCCESS["Success: {data,meta}"]
        ERROR["Error: {error,msg,code}"]
  end
 subgraph PAGINATION["Pagination & Filters"]
        LIMIT["limit+offset (20 default)"]
        MAX["max 100 items"]
        FILTER["filter + sort params"]
  end
 subgraph DOCS["API Documentation"]
        SWAG["OpenAPI / Swagger"]
        EXAMPLES["Request/response examples"]
        CHEATS["Markdown cheatsheet for FE"]
  end
 subgraph API["API Guidelines"]
    direction TB
        REST
        ENDPOINTS
        REQRES
        PAGINATION
        DOCS
  end
    ARCH --> API
```

## 🤝 Contributing

- Got ideas or improvements?
- Fork the repo
- Create a new branch
- Submit a PR 🎉
- Or ping me directly on LinkedIn [Trideev Ganguly](https://www.linkedin.com/in/trideev-ganguly/) to discuss the project!

## 📜 License

This project is open-source under the [MIT LICENSE](https://github.com/MrCh0p808/VoteWave/blob/main/LICENSE)
.

## 🔖 Tags

SocialAwareness. Social Media, Swadeshi, VoiceOfPeople


