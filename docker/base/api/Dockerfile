# syntax=docker/dockerfile:1

FROM gradle:8.14.4-jdk21

RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates curl git \
    && rm -rf /var/lib/apt/lists/*

ENV GRADLE_USER_HOME=/home/gradle/.gradle

WORKDIR /workspace
