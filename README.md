# DeckLab

**English** | [Italiano](README.it.md)

[![CI](https://github.com/andrea-pugliatti/deck-lab/actions/workflows/ci.yml/badge.svg)](https://github.com/andrea-pugliatti/deck-lab/actions/workflows/ci.yml)
[![CD](https://github.com/andrea-pugliatti/deck-lab/actions/workflows/deploy.yml/badge.svg)](https://github.com/andrea-pugliatti/deck-lab/actions/workflows/deploy.yml)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

DeckLab is a full-stack Yu-Gi-Oh! deck builder, simulator, and AI-assisted strategy tool. Play it live at [decklab.games](https://decklab.games). I built it to keep deck building, legality checks, AI suggestions, and saved decks in one place. The frontend is React + Vite. The backend is Spring Boot and PostgreSQL. It started as a learning project about full-stack development, Spring Boot, React, and AI integrations, and it grew into something I actually reach for myself.

## Key Features

- Deck builder with Main, Extra, and Side deck sections
- Real-time legality validation across multiple formats
- AI-assisted deck generation and card suggestion flows
- Card search with filters for name, archetype, type, attribute, and race
- Starting hand draw simulation and deck consistency analytics
- JWT authentication with refresh token rotation and replay protection
- Docker Compose development setup for local orchestration

## Tech Stack

- **Backend**: Java 25, Maven, Spring Boot 4.1, Spring Data JPA, Spring Security, Spring AI (Gemini Integration)
- **Database**: PostgreSQL 18
- **Frontend**: React 19, Lucide React, TypeScript, Vite 8, Tailwind CSS 4, React Router 8, Oxlint (linting), Oxfmt (formatting), pnpm
- **Mobile**: Flutter 3, Dart 3, Riverpod, GoRouter, Dio, CachedNetworkImage
- **Infrastructure & Cloud**: OpenTofu/Terraform (IaC for GCP Cloud Run, Cloud SQL, Cloud Storage, Artifact Registry), Docker Compose
- **Frontend Testing**: Vitest, React Testing Library
- **Backend Testing**: JUnit, Mockito
- **Mobile Testing**: Flutter Test

---

## Preview

### Home Page

![Home Page](images/home.png)

### Card Database

![Card Database](images/card_database.png)

### Public Decks

![Public Decks](images/public_decks.png)

### Deck Builder

![Deck Builder](images/deck_builder.png)

### Hand Simulator

![Hand Simulator](images/hand_simulator.png)

---

## Directory Structure & Architecture

The code is split into modular layers. The frontend, backend, mobile app, and infrastructure each own their responsibilities:

```text
deck-lab/
├── .github/
│   └── workflows/
│       ├── ci.yml           # CI pipeline (backend/frontend/mobile build and tests)
│       ├── deploy.yml       # CD pipeline (GCP deployment setup)
│       └── mobile-release.yml # Mobile release workflow
├── backend/
│   ├── src/main/java/
│   │   └── com/deck/lab/backend/
│   │       ├── config/          # Application configuration and startup setup
│   │       ├── controller/      # Auth, card, deck, and AI-related endpoints
│   │       ├── dto/             # Request/response payloads and validation models
│   │       ├── exception/       # Global exception handling and custom errors
│   │       ├── mapper/          # DTO-to-entity and entity-to-DTO mapping layers
│   │       ├── model/           # Core database entities (User, Card, Deck, RefreshToken)
│   │       ├── repository/      # Spring Data repositories and specifications
│   │       ├── security/        # JWT, filters, and authentication configuration
│   │       ├── seeder/          # Database seeders for cards, banlists, and sample users
│   │       ├── service/         # Business logic for decks, validation, and auth
│   │       │   └── generation/  # AI deck generation & suggestion module
│   │       │       ├── model/   # Mapped AI prompt & response schemas
│   │       │       ├── tool/    # Registered Spring AI function callbacks
│   │       │       └── tool/dto/# Payload requests/responses used by AI tools
│   │       └── validation/      # Deck legality and rule-validation engine
│   ├── src/main/resources/
│   │   ├── application.yml      # Core backend configuration
│   │   └── static/              # Static assets served by the backend
│   └── src/test/java/           # Backend unit and integration tests
├── frontend/
│   ├── src/assets/              # Static assets and global icons
│   ├── src/components/          # Reusable UI widgets and feature modules
│   │   ├── card/                # Card grid elements and filter sidebars
│   │   ├── deck/                # Deck grid items and card lists
│   │   ├── deck-builder/        # Deck editor, validation alerts, and AI suggestions
│   │   │   └── ai-wizard/       # AI deck builder wizard flow
│   │   ├── hand-simulator/      # Probability calculators and simulator workspace
│   │   └── ui/                  # Core input and display primitives
│   ├── src/context/             # Auth, catalog search, and deck state providers
│   ├── src/hooks/               # Custom hooks for URL sync, fetch lifecycle, and metadata access
│   ├── src/layouts/             # Route wrappers for authenticated and public layouts
│   ├── src/pages/               # High-level route entry points
│   ├── src/reducers/            # Reducers for deck editing and simulator state
│   ├── src/services/            # REST API clients and JWT helpers
│   ├── src/test/                # Vitest test environment and setup files
│   ├── src/types/               # Shared TypeScript interfaces and schemas
│   └── src/utils/               # Utility helpers for math, formatting, and themed visuals
├── mobile/
│   ├── lib/
│   │   ├── data/                # Remote API repositories and mappers (Dio)
│   │   ├── domain/              # Domain models and repository interfaces
│   │   ├── navigation/          # GoRouter navigation and stateful tabs
│   │   └── ui/                  # Feature views, view models (Riverpod), and widgets
│   └── test/                    # Mobile unit, widget, and architecture tests
├── infra/                       # OpenTofu IaC modules for GCP
├── bruno/                       # API request collection for local development
├── .env.example                 # Template for environment configuration variables
├── docker-compose.yml           # Local orchestration for db, backend, and frontend
├── LICENSE                      # MIT License file
└── README.md                    # Project overview and development guide
```

### Request Flow Overview

```mermaid
flowchart LR
    User --> Frontend[React + Vite Frontend]

    subgraph API [Spring Boot API]
        Auth["Auth (/api/auth)"]
        Cards["Cards & Images (/api/cards, /api/images)"]
        Decks["Decks (/api/decks)"]
        Gen["AI Suggestions (/api/generate)"]
    end

    Frontend --> Auth
    Frontend --> Cards
    Frontend --> Decks
    Frontend --> Gen

    Auth --> DB[(PostgreSQL)]
    Cards --> DB
    Decks --> DB

    Cards --> Cache[Image Cache]
    Gen --> AI[Spring AI / Gemini]

    Cards -.-> YGO[YGOProDeck API]
```

### Core Concepts

#### State Management

- Local component state handles focused UI behavior.
- Shared state lives in React Context and reducers for deck editing, hand simulation, and search/query state.
- The frontend owns UX state. The backend is the source of truth for persistence and validation.

#### Custom Hooks

- URL sync hooks keep search and filter state in the address bar, so deck links are shareable and bookmarkable.
- Fetch hooks wrap loading and error states for API calls and metadata lookups.

#### Deck Legality Validation

- **Validation pipeline**: The backend checks decks against composite rules (`DeckRule`): copy limits (max 3 per card), type placement (Fusion/Synchro/Link monsters in the Extra Deck only), and deck-size bounds for Main, Extra, and Side.
- **Format rules**: The validator pulls banlists (Advanced, Goat, Edison, etc.) from the database and applies card restrictions in real time.

#### AI Suggestion & Generation

- **Structured Prompts**: The backend uses Spring AI's chat client to talk to Gemini. It sends structured output models to build deck lists and card suggestions around a user's archetype or strategy.
- **Spring AI Tool Calling**: Database and business-rule lookups run through registered callback functions in the `tool/` sub-package (`CardSearchTool`, `CardDetailsTool`, `GetFormatRulesTool`, `GetArchetypeCardsTool`, and `AnalyzeDeckStatsTool`). Each tool pulls its request/response shape from the `tool/dto/` package to keep context sizes down.
- **Contextual Search**: The backend maps AI output to JSON DTOs in `model/` (`CardEntry`, `DeckGenerateAiResponse`) and resolves them against the local PostgreSQL database with `CardResolver`. That's how we make sure every generated card name actually exists in the catalog.

#### Asynchronous Seeding & Graceful Shutdown

Seeding pulls a large card dataset without blocking startup, which matters on serverless platforms like Google Cloud Run:

- **Non-Blocking Startup**: Seeding runs on a dedicated single-threaded executor (`databaseSeederExecutor`), so the main thread binds to its port and passes container probes fast.
- **Image validation at startup**: Even with a populated database, the seeder scans every record and compares it to files on disk. Missing illustrations go into a background download queue.
- **Graceful interruption**: On scale-downs, redeployments, or container restarts, Spring's `@PreDestroy` hook signals the seeder thread to stop, halting in-flight card downloads and batch writes.
- **Async artwork downloads**: A pooled `imageDownloadExecutor` with a `CallerRunsPolicy` rejection handler runs downloads. When the pool fills up, that handler pushes work back to the seeding thread and slows it down naturally. On context shutdown it drops whatever's left. No `RejectedExecutionException`.

---

## Getting Started

### Prerequisites

- Docker or Podman
- Java JDK 25
- Node.js 22+ (tested with 24 in CI)
- pnpm

### Environment Configuration

Before running the application, prepare your environment configuration:

```bash
cp .env.example .env
```

The `.env.example` file contains the following variables:

| Variable             | Required | Default          | Description                          |
| -------------------- | -------- | ---------------- | ------------------------------------ |
| `POSTGRES_USER`      | No       | `postgres`       | Database user                        |
| `POSTGRES_PASSWORD`  | No       | `postgres`       | Database password                    |
| `JWT_SECRET`         | No       | Built-in dev key | HMAC signing key for JWTs            |
| `GEMINI_API_KEY`     | **Yes**  | —                | API key for AI-powered features      |
| `PRODUCTION_API_URL` | No       | —                | Only needed for deployment pipelines |

### Development

#### Option 1: Start with Docker Compose

From the repository root:

```bash
docker compose up -d
```

This starts:

- `db`: PostgreSQL 16
- `backend`: Spring Boot app on port 8080 (loads env from `.env`)
- `frontend`: Vite dev server on port 5173

##### Live Development with Compose Watch

The Compose setup supports **Docker Compose Watch** for hot reloading and file syncing. To run services with file syncing and auto-rebuilds, run:

```bash
docker compose watch
```

#### Option 2: Run services manually

To run services manually, you need PostgreSQL up first. Start just the database container with:

```bash
docker compose up -d db
```

##### Backend

Set the required environment variables in your shell. Spring Boot doesn't load `.env` when run manually, so export the variables or rely on defaults on localhost. Then run:

```bash
cd backend
./mvnw spring-boot:run
```

##### Frontend

```bash
cd frontend
pnpm install
pnpm run dev
```

Open the frontend at `http://localhost:5173`.

### Other Commands

Run these from their respective subdirectories:

- Frontend linting: `cd frontend && pnpm run lint` (uses Oxlint)
- Frontend formatting check: `cd frontend && pnpm run format:check` (uses Oxfmt)
- Frontend formatting fix: `cd frontend && pnpm run format` (uses Oxfmt)
- Frontend tests: `cd frontend && pnpm run test` or `cd frontend && pnpm run test:run` (uses Vitest)
- Backend tests: `cd backend && ./mvnw test`

## Backend Configuration

Key settings live in `backend/src/main/resources/application.yml`, with fallbacks in code:

- `spring.datasource.url`: Database connection URL
- `spring.ai.google.genai.api-key`: Gemini API key for AI features (defaults to `${GEMINI_API_KEY}`)
- `spring.ai.google.genai.chat.model`: Model version used for GenAI tasks (defaults to `gemini-3.1-flash-lite`)
- `jwt.secret`: HMAC signature key for JWT authentication
- `jwt.expiration`: Token expiration duration in milliseconds
- `refresh-token.duration-days`: Refresh token lifetime in days
- `refresh-token.max-per-user`: Session concurrency limit per user
- `refresh-token.cleanup-schedule`: Cron expression for clearing expired refresh tokens
- `refresh-token.grace-period-seconds`: Token replacement grace period in seconds
- `app.upload-dir`: Folder destination for cached card images
- `app.seed.cards`: Flag to seed cards from YGOPRODeck on startup
- `app.seed.users`: Flag to seed admin and sample users on startup (configured in code, defaults to true)
- `app.ygoprodeck.api-url`: External card catalog data source endpoint (configured in code, defaults to YGOProDeck api v7)

### Docker/System environment variables

- `DB_HOST`: Database address host (defaults to `localhost`, or `db` inside Docker)
- `POSTGRES_USER`: Database user (defaults to `postgres`)
- `POSTGRES_PASSWORD`: Database password (defaults to `postgres`)
- `IMAGE_UPLOAD_DIR`: Path to save card illustrations
- `GEMINI_API_KEY`: API key required for Spring AI integration
- `ALLOWED_CORS_ORIGINS`: Allowed client domains for CORS headers
- `JWT_SECRET`: Custom secret override for token signatures
- `VITE_API_URL`: Base API URL used by the Vite development server proxy (points to http://backend:8080 inside Docker Compose, or http://localhost:8080 for host-local dev)
- `PRODUCTION_API_URL`: Redundant variable defined for deployment pipelines (the production bundle only uses relative `/api` paths handled by the cloud load balancer)

## Backend behavior

Unless the flags `app.seed.cards` and `app.seed.users` are set to false, on startup the backend will:

- seed card data from the YGOPRODeck API
- verify and download missing card artwork under the configured storage directory (e.g. `backend/data/images`)
- seed format banlists
- create sample decks and default user accounts

The default seeded accounts are:

| Username | Password   | Email               |
| -------- | ---------- | ------------------- |
| `admin`  | `12345678` | `admin@example.com` |
| `yugi`   | `12345678` | `yugi@example.com`  |

## API Collection Usage

The `bruno/` folder holds a Bruno collection for hitting the API locally. It's handy for:

- testing auth flows like login and logout
- creating and validating decks through the API
- exploring card and deck endpoints without building a custom client
- quickly verifying backend behavior while frontend changes are in progress

To use it:

1. Open Bruno and import the collection from the `bruno/` directory.
2. Select the `Local` environment file to point requests at your local backend.
3. Start the backend and run requests directly from Bruno to inspect responses and payloads.

## Troubleshooting

- If the frontend cannot reach the backend, verify the backend container is running and that `VITE_API_URL` points to the correct origin.
- If the backend fails to start, confirm PostgreSQL is reachable and env vars like `GEMINI_API_KEY` are set.
- If you see port conflicts, stop services on ports `5173`, `8080`, or `5432` before restarting the stack.
- To reset local state, run `docker compose down -v` to start over with a clean database. The `-v` flag drops named volumes (including the database).

## CI/CD & Deployment

- **Continuous Integration (`ci.yml`)**: Triggered on pull requests and pushes to `main`, `master`, and `**/feature/**`. It runs frontend lint/format checks, Maven tests on the backend, and builds deployable artifacts.
- **Continuous Deployment (`deploy.yml`)**: Triggered on push to `main` (or on manual dispatch). It authenticates to Google Cloud with Workload Identity Federation (WIF) and runs this pipeline:
  1. Builds and pushes the backend image to Artifact Registry.
  2. Deploys the backend to Cloud Run, mounting a Cloud Storage bucket for card artwork and connecting Cloud SQL.
  3. Builds the frontend for production and copies static assets to a Cloud Storage bucket.
  4. Invalidates the Cloud CDN cache.

To enable the CD pipeline in your GitHub repository, configure the following secrets and variables:

| Type       | Name                           | Description                                                                                        |
| ---------- | ------------------------------ | -------------------------------------------------------------------------------------------------- |
| **Secret** | `GCP_WIF_PROVIDER`             | Full identifier of the Workload Identity Provider                                                  |
| **Secret** | `GCP_WIF_SERVICE_ACCOUNT`      | Email of the deployment Service Account in GCP                                                     |
| **Secret** | `GCP_CLOUDSQL_CONNECTION_NAME` | Connection name of the PostgreSQL Cloud SQL instance                                               |
| **Secret** | `DECK_LAB_DB_PASSWORD`         | Password for PostgreSQL database connection                                                        |
| **Secret** | `DECK_LAB_GEMINI_API_KEY`      | Gemini API Key for production Spring AI                                                            |
| **Secret** | `DECK_LAB_JWT_SECRET`          | Production signing secret for JWTs                                                                 |
| **Secret** | `PRODUCTION_API_URL`           | Cloud Run service endpoint URL for frontend API access (not directly compiled into frontend build) |
| **Secret** | `GCP_LOAD_BALANCER_NAME`       | Name of the GCP HTTP(S) Load Balancer url-map                                                      |
| **Secret** | `DB_USER`                      | Production database user name                                                                      |
| **Secret** | `ALLOWED_CORS_ORIGINS`         | Allowed client origins for production CORS                                                         |
| **Secret** | `GCP_PROJECT_ID`               | GCP Project ID                                                                                     |
| **Secret** | `GCP_FRONTEND_BUCKET_NAME`     | GCP Cloud Storage bucket name for frontend static hosting                                          |
| **Secret** | `GCP_IMAGE_BUCKET_NAME`        | GCP Cloud Storage bucket name for backend card image storage                                       |

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
