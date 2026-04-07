# syntax=docker/dockerfile:1

ARG BASE_MOBILE_IMAGE=node:22-alpine

FROM ${BASE_MOBILE_IMAGE}
WORKDIR /workspace

ENV CI=true
ENV EXPO_NO_TELEMETRY=1

COPY package.json package-lock.json turbo.json ./
COPY packages/sdk/package.json ./packages/sdk/package.json
COPY packages/design-tokens/package.json ./packages/design-tokens/package.json
COPY apps/mobile/package.json ./apps/mobile/package.json
COPY apps/web/package.json ./apps/web/package.json

RUN npm install --legacy-peer-deps

COPY packages/sdk ./packages/sdk
COPY packages/design-tokens ./packages/design-tokens
COPY apps/mobile ./apps/mobile

WORKDIR /workspace/apps/mobile

CMD ["npm", "run", "typecheck"]
