# HotelHub - Plataforma Integrada de Reserva de Hospedagem

## 📚 Informações Acadêmicas

**Disciplina:** Programação para Dispositivos Móveis - P8  
**Currículo:** Ciência da Computação  
**Instituição:** Centro Universitário de João Pessoa - Unipê  

**Desenvolvedor:** Gabriel Ângelo Oliveira Silva  
**RGM:** 29922941  
**Período:** Abril 2026  

---

## 1. Introdução e Objetivo

**HotelHub** é uma plataforma completa de gerenciamento e reserva de hospedagem, desenvolvida como projeto acadêmico integrando múltiplos domínios de engenharia de software. O sistema demonstra a aplicação prática de conceitos avançados em:

- Arquitetura de microserviços com padrão API-First
- Desenvolvimento de aplicações mobile nativas (React Native/Expo)
- Integração front-end com arquitetura serverless (Next.js App Router)
- Padrões de autenticação e autorização (JWT + OAuth2)
- Containerização e orquestração (Docker + Docker Compose)
- Pipelines de CI/CD com GitHub Actions
- Gerenciamento de monorepo (Turborepo)

### 1.1 Escopo do Projeto

O projeto implementa um **sistema de reserva de hospedagem** com três camadas de apresentação:

1. **Aplicação Web** (Next.js 15 + React 19) - Interface para bookings e admin panel
2. **Aplicação Mobile** (Expo + React Native) - Cliente nativo para iOS/Android
3. **API REST** (Spring Boot 3.5 + Kotlin) - Backend com autenticação JWT, persistência em PostgreSQL

### 1.2 Arquitetura de Alto Nível

```text
┌─────────────────────────────────────────────────────────┐
│           HotelHub - Monorepo (Turborepo)               │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Web App    │  │ Mobile App   │  │   Backend    │ │
│  │ (Next.js)    │  │ (React Native)│  │(Spring Boot) │ │
│  │ TypeScript   │  │ TypeScript   │  │ Kotlin/Java  │ │
│  │ TanStack Q   │  │ TanStack Q   │  │ PostgreSQL   │ │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘ │
│         │                 │                  │          │
│         └─────────────────┼──────────────────┘          │
│                    Shared SDK                           │
│            (@hotelhub/sdk - TypeScript)                 │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Design Tokens Package (@hotelhub/design-tokens) │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### 1.3 🚀 Quick Start (Local Development)

#### Prerequisites

- Node.js 22+
- Docker & Docker Compose
- Git

#### Setup em 5 minutos

```bash
# 1. Clone repository
git clone https://github.com/DevAngeloOliveira/HotelHub.git
cd HotelHub

# 2. Copie arquivo de variáveis de ambiente
cp .env.example .env.local

# 3. Inicie todos os services (PostgreSQL, Redis, API, Web)
docker-compose --env-file .env.local up -d

# 4. Instale dependências do frontend
npm install

# 5. Inicie development servers
npm run dev

# Services rodando:
# Backend:  http://localhost:8080/api/v1 (ou via nginx: http://localhost/api/v1)
# Web:      http://localhost:3000
# Swagger:  http://localhost:8080/swagger-ui.html
# Database: postgres://postgres@localhost:5432/hotelhub (senha: postgres)
```

#### API Documentation

- **Swagger UI:** [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- **OpenAPI JSON:** [http://localhost:8080/v3/api-docs](http://localhost:8080/v3/api-docs)

#### Environment Configuration

Veja [.env.example](.env.example) para todas as variáveis de configuração.

**Importante:** Gere um novo `JWT_SECRET` para produção:

```bash
openssl rand -base64 32
```

---

## 2. Monorepo Structure

O projeto utiliza **Turborepo** para gerenciar workspaces interdependentes:

```text
HotelHub/
├── apps/
│   ├── api/                    # Backend REST API (Spring Boot 3.5)
│   │   ├── src/main/kotlin/    # Controllers, Services, Repositories
│   │   ├── src/main/resources/ # Application.yml, DB migrations (Flyway)
│   │   └── build.gradle.kts    # Gradle build configuration
│   │
│   ├── web/                    # Web App (Next.js 15 + React 19)
│   │   ├── src/app/            # App Router (layout, page)
│   │   ├── src/components/     # React Components
│   │   ├── src/hooks/          # Custom hooks (TanStack Query)
│   │   ├── src/lib/            # Utilities, API client
│   │   ├── src/actions/        # Server Actions (auth, data mutations)
│   │   └── next.config.ts      # Next.js configuration
│   │
│   └── mobile/                 # Mobile App (Expo + React Native)
│       ├── app/                # Expo Router (navigation)
│       ├── src/components/     # React Native Components
│       ├── src/screens/        # Screen components
│       ├── src/hooks/          # Custom hooks (TanStack Query)
│       ├── src/state/          # Global state (Context API)
│       └── app.json            # Expo app configuration
│
├── packages/
│   ├── sdk/                    # @hotelhub/sdk (Shared TypeScript SDK)
│   │   ├── src/core/           # HttpClient, Auth, Config
│   │   ├── src/types/          # Type definitions
│   │   ├── src/modules/        # API modules (auth, destinations, hotels, reservations)
│   │   ├── src/hooks/          # Query key factory
│   │   └── package.json        # Published to npm
│   │
│   └── design-tokens/          # @hotelhub/design-tokens (Design System)
│       ├── src/index.ts        # CSS variables generation
│       └── package.json
│
├── docker/                     # Docker build configurations
│   ├── base/                   # Base images for each platform
│   │   ├── api/Dockerfile
│   │   ├── web/Dockerfile
│   │   └── mobile/Dockerfile
│   ├── api/Dockerfile          # Production API image
│   ├── web/Dockerfile          # Production web image
│   ├── mobile/Dockerfile       # Mobile artifacts builder
│   └── nginx/default.conf      # Nginx reverse proxy config
│
├── .github/workflows/          # CI/CD Pipelines
│   ├── ci-api.yml
│   ├── ci-web.yml
│   ├── ci-mobile.yml
│   ├── publish-base-images.yml
│   ├── publish-api.yml
│   ├── publish-web.yml
│   └── publish-mobile-artifacts.yml
│
├── docs/                       # Project documentation
│   ├── figma-prototyping.md    # Design & prototyping guide
│   ├── screen-spec.md          # Screen specifications
│   └── INTEGRATION_GUIDE.md    # SDK integration examples
│
├── docker-compose.yml          # Local development stack
├── package.json                # Root monorepo configuration
├── turbo.json                  # Turborepo task configuration
└── README.md                   # This file
```

---

## 3. Arquitetura Técnica Detalhada

### 3.1 Backend (API REST)

**Stack:** Java 21, Spring Boot 3.5, Kotlin, PostgreSQL, Redis

**Componentes principais:**

- **Controllers** - REST endpoints (`/api/v1/*`)
- **Services** - Lógica de negócio
- **Repositories** - Acesso a dados (Spring Data JPA)
- **Security** - JWT authentication, OAuth2 support
- **Database** - PostgreSQL com Flyway migrations
- **Cache** - Redis para sessões e tokens

**Endpoints principais:**

- `POST /auth/login` - Autenticação
- `POST /auth/register` - Registro
- `POST /auth/refresh` - Renovação de token
- `GET /destinations` - Listar destinos
- `GET /hotels` - Listar hotéis
- `POST /reservations` - Criar reserva
- `PATCH /reservations/:id/cancel` - Cancelar reserva
- `GET /admin/...` - Admin panel endpoints

### 3.2 Frontend Web (Next.js)

**Stack:** Node.js 22, Next.js 15, React 19, TypeScript, TanStack Query

**Arquitetura:**

```text
App Router (SSR + Client Components)
├── Pages (src/app/)
│   ├── / (home)
│   ├── /login
│   ├── /hotels
│   ├── /reservations
│   └── /admin
├── Components (Reusable UI)
├── Hooks (TanStack Query)
│   ├── useAuth()
│   ├── useHotelsList()
│   ├── useCreateReservation()
│   └── ... (10+ hooks)
├── Server Actions (Data mutations)
├── Providers (Query, Auth)
└── Lib (Utilities, API client)
```

**Recursos:**

- Server-Side Rendering (SSR) para SEO
- Client Components para interatividade
- TanStack Query para gerenciamento de cache
- TypeScript para type safety
- Tailwind CSS para styling
- Design tokens via CSS variables

### 3.3 Frontend Mobile (Expo)

**Stack:** Node.js 22, Expo, React Native, TypeScript, TanStack Query

**Arquitetura:**

```text
Expo Router (Navigation)
├── App (Tabs)
│   ├── Home
│   ├── Destinations
│   ├── Hotels
│   ├── Reservations
│   └── Profile
├── Screens (Screen components)
├── Hooks (TanStack Query)
├── State (Context API + Provider)
├── Components (Native UI)
└── Lib (Utilities, Theme)
```

**Recursos:**

- Expo Go para development
- React Navigation (Expo Router)
- TanStack Query para state management
- AsyncStorage para persistência local
- Gestures com React Native Gesture Handler
- Native performance otimizado

### 3.4 Shared SDK (@hotelhub/sdk)

**Stack:** TypeScript, Fetch API, TanStack Query

**Módulos:**

```typescript
core/
├── http.ts           // HttpClient com retry, timeout, token injection
├── config.ts         // Environment configuration
├── errors.ts         // Error handling
├── auth-interceptor.ts // JWT token management
└── initialize.ts     // SDK initialization

types/
├── common.ts         // Common types (paginated response, errors)
├── auth.ts           // Authentication types
├── destinations.ts   // Destination types
├── hotels.ts         // Hotel types
├── reservations.ts   // Reservation types
└── profile.ts        // User profile types

modules/
├── auth.ts           // Auth API module
├── destinations.ts   // Destinations API module
├── hotels.ts         // Hotels API module
├── reservations.ts   // Reservations API module
└── profile.ts        // Profile API module

hooks/
└── query-keys.ts     // TanStack Query key factory
```

**Funcionalidades:**

- Type-safe API client
- Automatic token management
- JWT refresh with deduplication
- Request retry with exponential backoff
- Request timeout handling
- Error normalization
- Monorepo-compatible imports

---

## 4. Dependências e Tecnologias

### 4.1 Backend

- **Java 21** - Runtime
- **Spring Boot 3.5** - Framework
- **Kotlin 1.9** - Language
- **PostgreSQL 15** - Database
- **Redis 7** - Cache
- **Gradle 8** - Build tool
- **Flyway** - Database migrations
- **JWT** - Token-based authentication

### 4.2 Frontend Web

- **Node.js 22** - Runtime
- **Next.js 15** - Framework
- **React 19** - UI library
- **TypeScript 5** - Language
- **TanStack Query 5** - State management
- **Tailwind CSS 3** - Styling
- **@hotelhub/sdk** - Shared SDK
- **@hotelhub/design-tokens** - Design system

### 4.3 Frontend Mobile

- **Node.js 22** - Runtime
- **Expo 51** - Development platform
- **React Native 0.76** - Framework
- **TypeScript 5** - Language
- **TanStack Query 5** - State management
- **Expo Router** - Navigation
- **React Native Gesture Handler** - Gestures
- **@hotelhub/sdk** - Shared SDK

### 4.4 DevOps & Infrastructure

- **Docker** - Containerization
- **Docker Compose** - Local orchestration
- **GitHub Actions** - CI/CD
- **Turborepo** - Monorepo management
- **Nginx** - Reverse proxy
- **GHCR** - Container registry

---

## 5. Pré-Requisitos e Instalação

### 5.1 Requisitos do Sistema

**Obrigatório:**

- Node.js 22.0 ou superior
- npm 11.0 ou superior
- Git 2.34 ou superior

**Para desenvolvimento local (Backend):**

- Java Development Kit (JDK) 21 LTS
- Gradle 8.0 (fornecido via wrapper)

**Para containerização:**

- Docker 24.0 ou superior
- Docker Compose 2.20 ou superior

**Opcional:**

- Visual Studio Code (Com extensões TypeScript, Kotlin)
- Expo CLI (`npm install -g expo-cli`)
- PostgreSQL 15 (se não usar Docker)
- Redis 7 (se não usar Docker)

### 5.2 Instalação de Dependências

#### Clone do repositório

```bash
git clone https://github.com/DevAngeloOliveira/HotelHub.git
cd HotelHub
```

#### Instalação de dependências (web/mobile)

```bash
npm install
```

Isto instala todas as dependências para:

- Web app (Next.js)
- Mobile app (Expo)
- Shared SDK (@hotelhub/sdk)
- Design tokens (@hotelhub/design-tokens)

---

## 6. Execução Local

### 6.1 Backend (Spring Boot API)

**Pré-requisitos:**

- Java 21 instalado
- PostgreSQL em execução (porta 5432)
- Redis em execução (porta 6379)

**Iniciar API:**

```bash
cd apps/api
./gradlew bootRun
```

**URLs:**

- API base path: `http://localhost:8080/api/v1`
- Swagger UI: `http://localhost:8080/api/v1/swagger-ui.html`
- Health check: `http://localhost:8080/actuator/health`

### 6.2 Web App (Next.js)

**Iniciar servidor de desenvolvimento:**

```bash
npm run dev --workspace web
```

**URLs:**

- Aplicação web: `http://localhost:3000`
- Hot reload automático em mudanças

### 6.3 Mobile App (Expo)

**Iniciar Expo:**

```bash
npm run start --workspace mobile
```

**Opções:**

- Pressione `w` para abrir no browser
- Pressione `i` para abrir no iOS simulator
- Pressione `a` para abrir no Android emulator
- Escaneie QR code com Expo Go app (iOS/Android)

### 6.4 Todos os Serviços com Docker Compose

**Inicia:** PostgreSQL + Redis + API + Web + Nginx

```bash
npm run docker:up
```

**URLs:**

- Nginx (entrypoint): `http://localhost`
- Web app (via Nginx): `http://localhost`
- API (via Nginx): `http://localhost/api/v1`
- Swagger (via Nginx): `http://localhost/api/v1/swagger-ui.html`
- PostgreSQL: `localhost:5432`
- Redis: `localhost:6379`

**Parar stack:**

```bash
npm run docker:down
```

---

## 7. Comandos Disponíveis

### 7.1 Desenvolvimento

```bash
# Starta todos os apps em modo dev
npm run dev

# Builds produção
npm run build

# Linting (ESLint)
npm run lint

# Type checking (TypeScript)
npm run typecheck

# Testes unitários
npm run test
```

### 7.2 Docker

```bash
# Inicia stack local (DB + Redis + API + Web + Nginx)
npm run docker:up

# Para stack
npm run docker:down

# Status dos containers
npm run docker:ps

# Constrói base images
npm run docker:build:base

# Constrói services
npm run docker:build:services

# Constrói mobile builder
npm run docker:build:mobile-builder

# Constrói todas as imagens
npm run docker:build:all
```

### 7.3 Workspaces específicos

```bash
# Backend
npm run dev --workspace api
npm run build --workspace api
npm run test --workspace api

# Web
npm run dev --workspace web
npm run build --workspace web
npm run lint --workspace web

# Mobile
npm run start --workspace mobile
npm run build --workspace mobile
npm run eas:build --workspace mobile

# SDK
npm run build --workspace @hotelhub/sdk
npm run publish --workspace @hotelhub/sdk
```

---

## 8. Pipeline CI/CD

O projeto implementa pipelines separados por domínio:

### 8.1 Continuous Integration

**`ci-api.yml`**

- Testa API (JUnit)
- Lint Kotlin (detekt)
- Build Gradle
- Security scan (OWASP Dependency-Check)

**`ci-web.yml`**

- Instala dependências
- TypeScript check
- ESLint
- Build Next.js
- Testes (Jest)

**`ci-mobile.yml`**

- Instala dependências
- TypeScript check
- ESLint
- Linting React Native
- Security audit

### 8.2 Continuous Deployment

**`publish-base-images.yml`**

- Publica imagens base (API, Web, Mobile) no GHCR
- Tags: `java21-v1`, `node22-v1`, `node22-java17-v1`

**`publish-api.yml`**

- Constrói e publica `hotelhub-api`

**`publish-web.yml`**

- Constrói e publica `hotelhub-web`

**`publish-mobile-artifacts.yml`**

- Constrói artifacts (APK/AAB via Expo EAS)

**Estratégia de tagging:**

- `latest` - Build mais recente no branch default
- `sha-<commit>` - Identificação por commit
- `v*` - Tags semânticas (GitHub releases)

---

## 9. Funcionalidades Implementadas

### 9.1 Autenticação & Autorização

- ✅ JWT token-based authentication
- ✅ Automatic token refresh (com deduplicação)
- ✅ Role-based access control (CLIENT/ADMIN)
- ✅ HttpOnly cookies (web)
- ✅ Persistent sessions (localStorage/AsyncStorage)

### 9.2 Destinos

- ✅ Listar com paginação e filtros
- ✅ Visualizar detalhes
- ✅ Admin: CRUD operations
- ✅ Filtros: name, category, country, state

### 9.3 Hotéis

- ✅ Listar com paginação e filtros
- ✅ Visualizar detalhes e quartos
- ✅ Consultar disponibilidade por data
- ✅ Admin: CRUD hotéis e quartos
- ✅ Filtros: destinationId, minRating, maxPrice

### 9.4 Reservas

- ✅ Criar nova reserva
- ✅ Listar minhas reservas (usuário)
- ✅ Visualizar detalhes
- ✅ Cancelar com motivo
- ✅ Admin: listar todas as reservas

### 9.5 Perfil Usuário

- ✅ Visualizar perfil
- ✅ Editar informações pessoais
- ✅ Trocar senha
- ✅ Admin: listar usuários

---

## 10. Padrões de Design Utilizados

### 10.1 Backend

- **MVC** - Model-View-Controller para estrutura REST
- **Repository** - Abstração de acesso a dados
- **Service Layer** - Lógica de negócio centralizada
- **DTO** - Data Transfer Objects
- **Filter/Interceptor** - JWT validation
- **Exception Handling** - Global error handlers

### 10.2 Frontend Web

- **Component-driven** - Reusable UI components
- **Custom Hooks** - TanStack Query para async state
- **Server Actions** - Next.js data mutations
- **Context API** - Global state (auth context)
- **Compound Components** - Complex UI patterns

### 10.3 Frontend Mobile

- **Container/Presentational** - Smart/dumb components
- **Custom Hooks** - TanStack Query para async state
- **Context Providers** - Global state management
- **Navigation Stack** - Expo Router for multi-screen flow

### 10.4 Shared SDK

- **Module Pattern** - Organize endpoints by domain
- **Interceptor** - Cross-cutting concerns (auth, errors)
- **Factory Pattern** - Query key generation
- **Type Safety** - Full TypeScript coverage

---

## 11. Testes

### 11.1 Backend

Testes implementados com JUnit 5:

```bash
cd apps/api
./gradlew test
```

Cobertura:

- Service layer tests
- Repository tests with H2 in-memory database
- Controller integration tests

### 11.2 Frontend Web

Testes com Jest + React Testing Library:

```bash
npm run test --workspace web
```

Cobertura:

- Component tests
- Hook tests
- Integration tests

### 11.3 Frontend Mobile

Linting e type checking:

```bash
npm run typecheck --workspace mobile
npm run lint --workspace mobile
```

---

## 12. Documentação Adicional

Para mais detalhes técnicos, consulte:

- **[docs/figma-prototyping.md](docs/figma-prototyping.md)** - Design system e prototyping com Figma
- **[docs/screen-spec.md](docs/screen-spec.md)** - Especificações de telas
- **[docs/INTEGRATION_GUIDE.md](docs/INTEGRATION_GUIDE.md)** - Exemplos de uso do SDK
- **[apps/api/README.md](apps/api/README.md)** - Documentação específica da API
- **[apps/web/README.md](apps/web/README.md)** - Documentação específica da web app
- **[apps/mobile/README.md](apps/mobile/README.md)** - Documentação específica da mobile app

---

## 13. Contribuindo ao Projeto

### 13.1 Configuração do Ambiente de Desenvolvimento

1. Clone o repositório e instale dependências
2. Configure as variáveis de ambiente (.env)
3. Inicie os serviços com Docker Compose
4. Desenvolva na branch feature

### 13.2 Padrões de Código

**TypeScript:**

- ESLint configuration for web and mobile
- Type safety: no `any` types unless absolutely necessary
- Naming: camelCase para variáveis/funções, PascalCase para tipos/componentes

**Kotlin/Java:**

- Detekt for linting
- Packages organized by feature
- Service-oriented architecture

**Git:**

- Branch naming: `feature/`, `bugfix/`, `refactor/`
- Commit messages: descriptive and in English
- PR required before merge to main

### 13.3 Code Review Checklist

- [ ] Código compila/não tem erros de type
- [ ] Testes passam
- [ ] Linting passa (ESLint, Detekt)
- [ ] Documentação atualizada
- [ ] Sem quebra de compatibilidade backward
- [ ] Performance considerado

---

## 14. Variáveis de Ambiente

### Backend (.env)

```env
# Database
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/hotelhub
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=postgres

# Redis
SPRING_REDIS_HOST=localhost
SPRING_REDIS_PORT=6379

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRATION=86400000

# API
SERVER_PORT=8080
SPRING_JPA_HIBERNATE_DDL_AUTO=validate
```

### Web (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
NEXT_PUBLIC_SDK_BASE_URL=http://localhost:8080/api/v1
```

### Mobile (.env)

```env
EXPO_PUBLIC_API_URL=http://localhost:8080/api/v1
```

---

## 15. Troubleshooting

### Erro: "Port already in use"

```bash
# Matando processo na porta
lsof -i :3000  # ou :8080, :5432
kill -9 <PID>
```

### Erro: TypeScript compilation failed

```bash
# Limpar cache e reinstalar
rm -rf node_modules
npm install
npm run typecheck
```

### Erro: PostgreSQL connection refused

```bash
# Verificar se Docker está rodando
docker ps

# Reiniciar stack
npm run docker:down
npm run docker:up
```

### Erro: Module not found in SDK

```bash
# Reconstruir SDK
npm run build --workspace @hotelhub/sdk
npm install
```

---

## 16. Performance & Otimizações

### Frontend Web

- **Code Splitting** - Next.js automatic code splitting
- **Image Optimization** - Next.js Image component
- **Caching** - TanStack Query cache strategy
- **Lazy Loading** - Routes and components
- **CSS in JS** - Tailwind purging unused styles

### Frontend Mobile

- **Bundle Size** - Metro bundler optimization
- **Lazy Loading** - Expo lazy loading
- **Memory Management** - React Native profiling
- **Network** - Request batching and debouncing

### Backend

- **Database Indexing** - Strategic indexes on frequently queried columns
- **Query Optimization** - Custom queries with projections
- **Caching** - Redis for tokens and sessions
- **Connection Pooling** - HikariCP configuration

---

## 17. Segurança

### Implementado

- ✅ **JWT Authentication** - Stateless token-based auth
- ✅ **Token Refresh** - Automatic refresh com rotation
- ✅ **CORS** - Configured for web and mobile
- ✅ **HTTPS in Production** - Nginx with SSL termination
- ✅ **Input Validation** - Server-side validation
- ✅ **Rate Limiting** - Per-endpoint rate limiting
- ✅ **SQL Injection Prevention** - Parameterized queries
- ✅ **XSS Protection** - Content Security Policy headers

### Recomendações

- Usar variáveis de ambiente para secrets
- Regular dependency updates (Dependabot)
- Security scanning in CI (OWASP Dependency-Check)
- Regular code reviews
- Penetration testing before production

---

## 18. Referências & Recursos

### Documentação Oficial

- [Spring Boot 3.5 Docs](https://spring.io/projects/spring-boot)
- [Next.js 15 Docs](https://nextjs.org/docs)
- [React Native Docs](https://reactnative.dev/)
- [Expo Docs](https://docs.expo.dev/)
- [TanStack Query Docs](https://tanstack.com/query/latest)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Padrões & Arquitetura

- [RESTful API Design](https://restfulapi.net/)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [Microservices Patterns](https://microservices.io/)

---

## 19. Autor e Créditos

**Desenvolvedor:** Gabriel Ângelo Oliveira Silva  
**RGM:** 29922941  
**Disciplina:** Programação para Dispositivos Móveis - P8  
**Currículo:** Ciência da Computação  
**Instituição:** Centro Universitário de João Pessoa - Unipê  
**Período:** Abril 2026

### Agradecimentos

- Professores orientadores da disciplina
- Comunidades open-source
- Ferramentas e plataformas utilizadas (Spring, Next.js, Expo, etc.)

---

## 20. Licença

Este projeto é fornecido como trabalho acadêmico. A reutilização do código é permitida desde que o devido crédito seja dado ao desenvolvedor em conformidade com as normas acadêmicas da instituição.

**Copyright © 2026 Gabriel Ângelo Oliveira Silva - Todos os direitos reservados.**

---

## 21. Contato & Suporte

**Desenvolvedor:** Gabriel Ângelo Oliveira Silva  
**GitHub:** [@DevAngeloOliveira](https://github.com/DevAngeloOliveira)  
**Repositório:** [HotelHub](https://github.com/DevAngeloOliveira/HotelHub)

Para dúvidas, sugestões, bugs ou melhorias relativos ao projeto, favor abrir uma issue no repositório GitHub.

---

**Última Atualização:** Abril 2026  
**Versão da Documentação:** 1.0  
**Status do Projeto:** ✅ Completo e Funcional
