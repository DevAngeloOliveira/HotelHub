# syntax=docker/dockerfile:1

FROM node:22-alpine

RUN apk add --no-cache bash git openjdk17-jdk

ENV JAVA_HOME=/usr/lib/jvm/java-17-openjdk
ENV PATH="${JAVA_HOME}/bin:${PATH}"

WORKDIR /workspace
