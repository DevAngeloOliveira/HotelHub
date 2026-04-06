# syntax=docker/dockerfile:1

ARG BASE_MOBILE_IMAGE=node:22-alpine

FROM ${BASE_MOBILE_IMAGE}
WORKDIR /workspace

ENV CI=true
ENV EXPO_NO_TELEMETRY=1

COPY package.json package-lock.json ./
COPY apps/mobile/package.json ./apps/mobile/package.json
COPY apps/web/package.json ./apps/web/package.json

RUN npm install --legacy-peer-deps

COPY apps/mobile ./apps/mobile

WORKDIR /workspace/apps/mobile

CMD ["npm", "run", "typecheck"]
