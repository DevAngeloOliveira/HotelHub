# syntax=docker/dockerfile:1

ARG BASE_WEB_IMAGE=node:22-alpine

FROM ${BASE_WEB_IMAGE} AS deps
WORKDIR /workspace

COPY package.json package-lock.json ./
COPY apps/web/package.json ./apps/web/package.json
COPY apps/mobile/package.json ./apps/mobile/package.json

RUN npm install --legacy-peer-deps

FROM deps AS builder
WORKDIR /workspace
ARG NEXT_PUBLIC_API_BASE_URL=/api/v1
ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}

COPY apps/web ./apps/web

RUN npm run build --workspace web

FROM ${BASE_WEB_IMAGE} AS runner
WORKDIR /workspace

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ARG NEXT_PUBLIC_API_BASE_URL=/api/v1
ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}

COPY --from=deps /workspace/package.json ./package.json
COPY --from=deps /workspace/package-lock.json ./package-lock.json
COPY --from=deps /workspace/node_modules ./node_modules
COPY --from=deps /workspace/apps/web/package.json ./apps/web/package.json

COPY --from=builder /workspace/apps/web/.next ./apps/web/.next
COPY --from=builder /workspace/apps/web/public ./apps/web/public
COPY --from=builder /workspace/apps/web/package.json ./apps/web/package.json
COPY --from=builder /workspace/apps/web/next.config.ts ./apps/web/next.config.ts

WORKDIR /workspace/apps/web

EXPOSE 3000

CMD ["npm", "run", "start"]
