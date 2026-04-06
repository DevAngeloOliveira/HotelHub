# HotelHub Monorepo

Monorepo containing:

- `apps/api`: Kotlin + Spring Boot backend
- `apps/web`: Next.js web app
- `apps/mobile`: React Native app (Expo)

## Architecture

```text
apps/
  api/      # REST API, JWT auth, Flyway, PostgreSQL
  web/      # Next.js (App Router)
  mobile/   # Expo React Native
.github/workflows/
  ci.yml    # CI for API + Web + Mobile
  cd.yml    # CD publishing API image to GHCR
```

## Prerequisites

- Node.js 22+
- Java 21 (for local API development)
- Docker (optional for local containers)

## Install Dependencies (web/mobile workspace)

```bash
npm install
```

## Run Locally

### API

```bash
cd apps/api
./gradlew bootRun
```

API base path: `http://localhost:8080/api/v1`

Swagger: `http://localhost:8080/api/v1/swagger-ui.html`

### Web

```bash
npm run dev --workspace web
```

Web app: `http://localhost:3000`

### Mobile

```bash
npm run start --workspace mobile
```

## Monorepo scripts

```bash
npm run dev
npm run build
npm run lint
npm run typecheck
npm run test
```

## Docker (API + PostgreSQL)

```bash
docker compose up --build
```

Services:

- API: `http://localhost:8080/api/v1`
- PostgreSQL: `localhost:5432`

## CI/CD

- `CI` workflow validates:
  - API tests (`apps/api`)
  - Web lint/typecheck/build (`apps/web`)
  - Mobile typecheck (`apps/mobile`)
- `CD` workflow publishes API Docker image to GHCR on `main`.

## Design & Prototyping

- Figma bootstrap: [docs/figma-prototyping.md](docs/figma-prototyping.md)
- Screen specification: [docs/screen-spec.md](docs/screen-spec.md)
