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
  ci-api.yml
  ci-web.yml
  ci-mobile.yml
  publish-base-images.yml
  publish-api.yml
  publish-web.yml
  publish-mobile-artifacts.yml
docker/
  base/
    api/
    web/
    mobile/
  api/
  web/
  mobile/
  nginx/
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
npm run docker:up
npm run docker:down
npm run docker:ps
npm run docker:build:base
npm run docker:build:services
npm run docker:build:mobile-builder
npm run docker:build:all
```

## Docker (DB + Redis + API + Web + Nginx)

```bash
npm run docker:up
```

Services:

- Nginx (entrypoint): `http://localhost`
- Web (via Nginx): `http://localhost`
- API (via Nginx): `http://localhost/api/v1`
- Swagger (via Nginx): `http://localhost/api/v1/swagger-ui.html`
- PostgreSQL: `localhost:5432`
- Redis: `localhost:6379`

Mobile no Docker compose e tratado como **builder environment** (`mobile-builder`), nao como runtime service.
Para build local do builder:

```bash
npm run docker:build:mobile-builder
```

Stop stack:

```bash
npm run docker:down
```

## CI/CD

- CI separado por dominio:
  - `ci-api.yml`
  - `ci-web.yml`
  - `ci-mobile.yml`
- CD separado por responsabilidade:
  - `publish-base-images.yml`
  - `publish-api.yml`
  - `publish-web.yml`
  - `publish-mobile-artifacts.yml`

Imagens publicadas no GHCR:

- Bases:
  - `hotelhub-base-api` (`java21-v1`)
  - `hotelhub-base-web` (`node22-v1`)
  - `hotelhub-base-mobile` (`node22-java17-v1`)
- Apps:
  - `hotelhub-api`
  - `hotelhub-web`
  - `hotelhub-mobile-builder`

Tags usadas:

- branch (`main`/`develop`)
- `sha-<commit>`
- semver (em tags `v*`)

## Design & Prototyping

- Figma bootstrap: [docs/figma-prototyping.md](docs/figma-prototyping.md)
- Screen specification: [docs/screen-spec.md](docs/screen-spec.md)
