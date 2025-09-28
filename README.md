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
  theme: neo-dark
  layout: dagre
  look: neo
---
flowchart LR
 subgraph subGraph0["External Systems"]
        User["👤 User"]
  end
 subgraph React_State["React State & Components"]
        PollForm["📝 CreatePollForm\n- pollQuestion\n- options[] (VoteUp, VoteDown, Abstain)\n- startDate, endDate\n- coverImage"]
        PollFeed["📜 PollFeed\nprops: polls\nstate: selectedPoll, votes"]
        VoteButton["🗳️ VoteButton\nstate: voteState"]
        Session["🔑 Session\n- userSession\n- token"]
  end
 subgraph API_Calls["Frontend API Calls"]
        FetchPolls["fetchPolls()"]
        CreatePoll["createPoll()"]
        CastVote["castVote()"]
        GetFeed["getFeed()"]
  end
 subgraph Frontend["Frontend (VoteWaveDemo.tsx)"]
        UI["🌐 Web UI"]
        React_State
        API_Calls
  end
 subgraph Infra["Infrastructure & Operations"]
        TF["🔧 Terraform\n- var.vpc_cidr\n- var.db_username\n- var.db_password"]
        Docker["🐳 Docker\n- DB_HOST\n- REDIS_HOST\n- S3_BUCKET"]
        ALB["⚖️ Application Load Balancer"]
        API_GW["🚪 API Gateway\nroutes via routeKey, authHeader"]
  end
 subgraph Auth["Auth Service"]
        Auth_API["🔐 Auth API\n/login, /register, /profile"]
        DB_Users[("📂 users table\n(id, email, password_hash, created_at)")]
  end
 subgraph Profiles["Profiles & Identity Service"]
        Profiles_API["👤 Profiles API\nGET /profiles/{id}, PUT /profiles"]
        DB_Profiles[("🗄️ profiles table\n(user_id, username, bio, profile_pic_url)")]
  end
 subgraph Polls["Polls Service"]
        Polls_API["📊 Polls API\n/createPoll, /vote, /getPolls"]
        DB_Polls[("🗄️ polls table\n(id, question, options[], cover_img, created_at)\nvotes table\n(id, poll_id, user_id, option)\ncomments table (ref)")]
        S3_Polls[("🪣 S3 Bucket\npollCovers/")]
  end
 subgraph Follows["Follows & Connections Service"]
        Follows_API["🔗 Follows API\nPOST/DELETE follows\nGET followers/following"]
        DB_Follows[("🗄️ follows table\n(follower_id, followed_id)")]
  end
 subgraph Expressions["Expressions Service"]
        Expr_API["🌊 Expressions API\nPOST /expressions/{item_id}, DELETE /expressions/{item_id}"]
        DB_Expr[("🗄️ expressions table\n(id, user_id, item_id, type: wave|ripple)")]
  end
 subgraph Comments["Comments Service"]
        Comments_API["💬 Comments API\nPOST/GET/DELETE comments"]
        DB_Comments[("🗄️ comments table\n(id, user_id, item_id, text, created_at)")]
  end
 subgraph Feed["Feed & Discovery Service"]
        Feed_API["📰 Feed API\nGET /feed, /search, /explore/trending"]
        Search_Engine["🔍 Search Engine\n(Postgres FTS / Elasticsearch)"]
  end
 subgraph Notifs["Notifications Service"]
        Notif_API["🔔 Notifications API\nGET /notifications, POST /mark-read"]
        DB_Notifs[("🗄️ notifications table\n(id, recipient_id, sender_id, type, content_id, is_read)")]
  end
 subgraph Services["VoteWave Microservices"]
        Auth
        Profiles
        Polls
        Follows
        Expressions
        Comments
        Feed
        Notifs
  end
 subgraph Shared["AWS Cloud Resources"]
        RDS[("🐘 PostgreSQL RDS\nschemas: users, profiles, polls, votes, follows, expressions, comments, notifications")]
        Redis[("⚡ Redis Cache\npollResultsCache, sessionStore")]
        S3[("🪣 S3 Buckets\npollCovers/, userUploads/")]
  end
    User -- Requests --> UI
    UI -- API Calls --> ALB
    ALB -- Routes --> API_GW
    API_GW --> Auth & Profiles & Polls & Follows & Expressions & Comments & Feed & Notifs
    Auth --> DB_Users
    Profiles --> DB_Profiles
    Polls --> DB_Polls & S3_Polls
    Follows --> DB_Follows
    Expressions --> DB_Expr
    Comments --> DB_Comments
    Feed --> Search_Engine
    Notifs --> DB_Notifs
    Services --> RDS & Redis & S3
    TF -- Provisions --> Shared
    Docker -- Manages --> Services
```
---
## End-To-End Request Life-Cycle
```mermaid
---
config:
  theme: neo-dark
---
sequenceDiagram
    autonumber
    participant U as 👤 User
    participant UI as 🌐 Web UI (React)
    participant ALB as ⚖️ ALB
    participant APIGW as 🚪 API Gateway
    participant AUTH as 🔐 Auth Service
    participant PROFILES as 👤 Profiles Service
    participant POLLS as 📊 Polls Service
    participant FOLLOWS as 🔗 Follows Service
    participant EXPR as 🌊 Expressions Service
    participant COMMENTS as 💬 Comments Service
    participant FEED as 📰 Feed Service
    participant NOTIFS as 🔔 Notifications Service
    participant RDS as 🐘 RDS (Postgres)
    participant REDIS as ⚡ Redis Cache
    participant S3 as 🪣 S3 Bucket
    participant SEARCH as 🔍 Search Engine

    %% === Authentication ===
    U->>UI: Submit login/register form
    UI->>ALB: HTTP request
    ALB->>APIGW: Forward request
    APIGW->>AUTH: /login or /register
    AUTH->>RDS: Verify or insert user
    RDS-->>AUTH: userID, token
    AUTH-->>APIGW: token returned
    APIGW-->>UI: Auth success
    UI->>U: Session stored

    %% === Profile Management ===
    U->>UI: Update profile (bio, pic)
    UI->>ALB: API call
    ALB->>APIGW: Forward request
    APIGW->>PROFILES: /profiles
    PROFILES->>RDS: Update profiles table
    PROFILES-->>APIGW: Success
    APIGW-->>UI: Profile updated
    UI->>U: Profile refreshed

    %% === Poll Creation ===
    U->>UI: Create poll (question, options, cover)
    UI->>ALB: API call
    ALB->>APIGW: Forward request
    APIGW->>POLLS: /createPoll
    POLLS->>RDS: Insert into polls table
    POLLS->>S3: Upload poll cover
    POLLS-->>APIGW: pollID returned
    APIGW-->>UI: Poll created
    UI->>U: Poll visible

    %% === Voting ===
    U->>UI: Cast vote (pollID, option)
    UI->>ALB: API call
    ALB->>APIGW: Forward request
    APIGW->>POLLS: /vote
    POLLS->>RDS: Insert into votes table
    POLLS->>REDIS: Update pollResultsCache
    POLLS-->>APIGW: Vote success
    APIGW-->>UI: Updated results
    UI->>U: Vote shown

    %% === Expressions (Waves/Ripples) ===
    U->>UI: Add expression (wave/ripple)
    UI->>ALB: API call
    ALB->>APIGW: Forward request
    APIGW->>EXPR: /expressions/{item_id}
    EXPR->>RDS: Insert into expressions table
    EXPR-->>APIGW: Expression saved
    APIGW-->>UI: UI updated
    UI->>U: Expression visible

    %% === Comments ===
    U->>UI: Post comment
    UI->>ALB: API call
    ALB->>APIGW: Forward request
    APIGW->>COMMENTS: /comments/{item_id}
    COMMENTS->>RDS: Insert into comments table
    COMMENTS-->>APIGW: Comment saved
    APIGW-->>UI: Comment displayed
    UI->>U: Comment visible

    %% === Follows ===
    U->>UI: Follow another user
    UI->>ALB: API call
    ALB->>APIGW: Forward request
    APIGW->>FOLLOWS: /follows/{id}
    FOLLOWS->>RDS: Insert into follows table
    FOLLOWS-->>APIGW: Success
    APIGW-->>UI: Follow confirmed
    UI->>U: Updated feed connections

    %% === Feed & Search ===
    U->>UI: Open feed
    UI->>ALB: API call
    ALB->>APIGW: Forward request
    APIGW->>FEED: /feed
    FEED->>RDS: Query polls, follows, expressions
    FEED->>SEARCH: Run text/hashtag search
    FEED->>S3: Retrieve media
    FEED-->>APIGW: Feed data
    APIGW-->>UI: Feed delivered
    UI->>U: Personalized feed

    %% === Notifications ===
    NOTIFS->>RDS: Insert notification (wave, comment, follow, poll update)
    U->>UI: Check notifications
    UI->>ALB: API call
    ALB->>APIGW: Forward request
    APIGW->>NOTIFS: /notifications
    NOTIFS->>RDS: Fetch notifications
    NOTIFS-->>APIGW: Notifications list
    APIGW-->>UI: Notifications delivered
    UI->>U: User sees notifications

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










