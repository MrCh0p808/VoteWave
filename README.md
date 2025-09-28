# VoteWave : Cloud-Native Polling App

[![Terraform](https://img.shields.io/badge/Terraform-v1.9+-623CE4?logo=terraform)](https://www.terraform.io/)
[![AWS](https://img.shields.io/badge/AWS-EC2%20%7C%20RDS%20%7C%20S3-orange?logo=amazon-aws)](https://aws.amazon.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Made with Love](https://img.shields.io/badge/Made%20with-❤️-red.svg)]()

---

Welcome to **VoteWave**, my *Dhaansu* Terraform project for deploying a cloud-native polling/voting app on **AWS EC2** and **RDS Postgres**!  
This repo automates the **entire infrastructure lifecycle**, from networking and security to compute, storage, and schema initialization.

---

## 📂 What's Inside?

- 📖 **[STORY.md](Docs/STORY.md)** – The journey and inspiration behind VoteWave  
- ⚙️ **[SETUP.md](Docs/SETUP.md)** – Step-by-step setup and deployment guide  
- 📑 **[DOCS.md](Docs/DOCS.md)** – Phase-wise development and infrastructure documentation  

---
## Architechture
As Per : September-October 2025

```mermaid
---
config:
  theme: redux-dark
  layout: dagre
---
flowchart TB
 subgraph EXT["External Systems"]
        USER(["User"])
  end
 subgraph FE["Frontend (React + TS)"]
        UI(["Web UI\nLogin, Profile, Polls, Feed, Notifs, Booths, Chat"])
        API(["API Client Layer\nfetch/axios"])
        STATE(["React State\nSession, PollFeed, VoteButton, Profile"])
  end
 subgraph INFRA["Infrastructure"]
        TF{{"Terraform"}}
        DOCKER{{"Docker Compose"}}
        ALB[/"App Load Balancer"/]
        APIGW[/"API Gateway"/]
  end
 subgraph AUTH["Auth Service"]
        AAPI(["Endpoints:\nlogin, register, profile"])
        ADB[("users db")]
  end
 subgraph PROF["Profiles Service"]
        PAPI(["Endpoints:\nget profile, update profile"])
        PDB[("profiles db")]
  end
 subgraph POLLS["Polls Service"]
        POLAPI(["Endpoints:\ncreate poll, vote, get poll"])
        POLDB[("polls, votes db")]
        PBUCKET[["S3: poll covers"]]
        PCACHE{{"Redis: poll cache"}}
  end
 subgraph FOL["Follows Service"]
        FAPI(["Endpoints:\nfollow, unfollow, list"])
        FDB[("follows db")]
  end
 subgraph EXPR["Expressions Service"]
        EAPI(["Endpoints:\nadd expression, remove expression"])
        EDB[("expressions db")]
  end
 subgraph COM["Comments Service"]
        CAPI(["Endpoints:\nadd comment, list comments, delete"])
        CDB[("comments db")]
  end
 subgraph FEED["Feed Service"]
        FDAPI(["Endpoints:\nfeed, search, trending"])
        FDDB[("aggregated data")]
        FDSEARCH[/"Search Engine"/]
  end
 subgraph NOTIF["Notifications Service"]
        NAPI(["Endpoints:\nlist notifs, mark read"])
        NDB[("notifications db")]
  end
 subgraph BOOTH["VoteBooth Service"]
        BAPI(["Endpoints:\ncreate booth, join booth, pin poll"])
        BDB[("booths db")]
  end
 subgraph MSG["Messaging Service"]
        MAPI(["Endpoints:\nget msgs, post msg, ws chat"])
        MDB[("messages db")]
        MPUBSUB{{"Redis pub/sub"}}
  end
 subgraph SHARED["Shared Cloud Resources"]
        RDS[("Postgres RDS")]
        REDIS{{"Redis Cache"}}
        S3[["S3 Buckets"]]
  end
    USER --> UI
    UI --> API
    API --> ALB
    ALB --> APIGW
    APIGW --> AUTH & PROF & POLLS & FOL & EXPR & COM & FEED & NOTIF & BOOTH & MSG
    AUTH --> ADB
    PROF --> PDB
    POLLS --> POLDB & PBUCKET & PCACHE
    FOL --> FDB
    EXPR --> EDB
    COM --> CDB
    FEED --> FDDB & FDSEARCH
    NOTIF --> NDB
    BOOTH --> BDB
    MSG --> MDB & MPUBSUB
    SHARED --> RDS & REDIS & S3
    TF --> SHARED
    DOCKER --> AUTH & PROF & POLLS & FOL & EXPR & COM & FEED & NOTIF & BOOTH & MSG
    caption["VoteWave Microservices Architecture"]

```
---
## End-To-End Request Life-Cycle
```mermaid
---
config:
  theme: dark
---
sequenceDiagram
    autonumber
    participant U as 👤 User
    participant UI as 🖥️ Web UI (React)
    participant ALB as ⚖️ ALB (Load Balancer)
    participant APIGW as 🚪 API Gateway
    participant AUTH as 🔐 Auth Service
    participant PROFILES as 🗂️ Profiles Service
    participant POLLS as 📊 Polls Service
    participant FOLLOWS as 🔗 Follows Service
    participant EXPR as 🌊 Expressions Service
    participant COMMENTS as 💬 Comments Service
    participant FEED as 📰 Feed Service
    participant NOTIFS as 🔔 Notifications Service
    participant BOOTH as 🏛️ VoteBooth Service
    participant MSG as 💬 Messaging Service
    participant RDS as 🐘 DB (Postgres)
    participant REDIS as ⚡ Cache (Redis)
    participant S3 as 🪣 Storage (S3)
    participant SEARCH as 🔍 Search Engine
    U->>UI: Submit login/register
    UI->>ALB: HTTP request
    ALB->>APIGW: Forward
    APIGW->>AUTH: /login or /register
    AUTH->>RDS: Verify/insert user
    RDS-->>AUTH: userId + token
    AUTH-->>APIGW: Auth success
    APIGW-->>UI: Return token
    UI->>U: Session stored
    U->>UI: Update profile
    UI->>ALB: API call
    ALB->>APIGW: Forward
    APIGW->>PROFILES: /profiles
    PROFILES->>RDS: Update profiles table
    PROFILES-->>APIGW: Success
    APIGW-->>UI: Profile updated
    UI->>U: Profile refreshed
    U->>UI: Create poll (Q + options + cover)
    UI->>ALB: API call
    ALB->>APIGW: Forward
    APIGW->>POLLS: /createPoll
    POLLS->>RDS: Insert poll
    POLLS->>S3: Upload cover
    POLLS-->>APIGW: pollId returned
    APIGW-->>UI: Poll created
    UI->>U: Poll visible
    U->>UI: Cast vote
    UI->>ALB: API call
    ALB->>APIGW: Forward
    APIGW->>POLLS: /vote
    POLLS->>RDS: Insert vote
    POLLS->>REDIS: Update poll cache
    POLLS-->>APIGW: Vote success
    APIGW-->>UI: Updated results
    UI->>U: Vote shown
    U->>UI: Add expression
    UI->>ALB: API call
    ALB->>APIGW: Forward
    APIGW->>EXPR: /expressions
    EXPR->>RDS: Insert expression
    EXPR-->>APIGW: Saved
    APIGW-->>UI: Update UI
    UI->>U: Expression visible
    U->>UI: Post comment
    UI->>ALB: API call
    ALB->>APIGW: Forward
    APIGW->>COMMENTS: /comments
    COMMENTS->>RDS: Insert comment
    COMMENTS-->>APIGW: Saved
    APIGW-->>UI: Display comment
    UI->>U: Comment visible
    U->>UI: Follow user
    UI->>ALB: API call
    ALB->>APIGW: Forward
    APIGW->>FOLLOWS: /follows
    FOLLOWS->>RDS: Insert follow
    FOLLOWS-->>APIGW: Success
    APIGW-->>UI: Follow confirmed
    UI->>U: Feed connections updated
    U->>UI: Open feed
    UI->>ALB: API call
    ALB->>APIGW: Forward
    APIGW->>FEED: /feed
    FEED->>RDS: Query polls/follows/expr
    FEED->>SEARCH: Run text search
    FEED->>S3: Get media
    FEED-->>APIGW: Feed data
    APIGW-->>UI: Deliver feed
    UI->>U: Personalized feed
    NOTIFS->>RDS: Insert notif (wave/comment/follow)
    U->>UI: Check notifs
    UI->>ALB: API call
    ALB->>APIGW: Forward
    APIGW->>NOTIFS: /notifications
    NOTIFS->>RDS: Fetch notifs
    NOTIFS-->>APIGW: List returned
    APIGW-->>UI: Deliver notifs
    UI->>U: Notifs visible
    U->>UI: Join booth
    UI->>ALB: API call
    ALB->>APIGW: Forward
    APIGW->>BOOTH: /booths/join
    BOOTH->>RDS: Update booth_members
    BOOTH-->>APIGW: Join confirmed
    APIGW-->>UI: Booth joined
    UI->>U: Booth page refreshed
    U->>UI: Send booth message
    UI->>ALB: WS/HTTP request
    ALB->>APIGW: Forward
    APIGW->>MSG: /messages or WS
    MSG->>MDB: Save message
    MSG->>REDIS: Publish event
    MSG-->>APIGW: Ack
    APIGW-->>UI: Message delivered
    UI->>U: Chat updated

```
---
## 🚀 Quickstart

Make sure you have [Terraform](https://www.terraform.io/downloads) installed and your AWS credentials configured.

### Apply infrastructure
Now, provision the core application infrastructure. This process is fully automated and does not require you to provide any passwords manually.

```bash
# Navigate to the main infrastructure directory
cd infra/

# Initialize Terraform to connect to your remote S3 backend
terraform init

# Apply the configuration to build the infrastructure
# No variables are needed.
terraform apply --auto-approve
```
### Retrieve the Generated Database Password
The infrastructure now uses AWS Secrets Manager and a randomly generated password for maximum security. To view the new password for manual inspection or testing, you can use the output command: 

```bash
# This will display the generated password
terraform output -sensitive db_password
```
## ⚡ Recommended Setup

### Export AWS Credentials
```bash
export AWS_ACCESS_KEY_ID="your_access_key"
export AWS_SECRET_ACCESS_KEY="your_secret_key"
```

Ensure your local machine has Terraform installed (terraform -v).

Follow [SETUP.md](SETUP.md) for detailed deployment instructions.

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

This project is open-source under the [MIT LICENSE](LICENSE)
.

## 🔖 Tags











