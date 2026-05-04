# syntax=docker/dockerfile:1

ARG BASE_API_IMAGE=gradle:8.14.4-jdk21
ARG RUNTIME_IMAGE=eclipse-temurin:21-jre

FROM ${BASE_API_IMAGE} AS build
WORKDIR /workspace

COPY apps/api/ ./apps/api/

WORKDIR /workspace/apps/api
RUN sed -i 's/\r$//' gradlew && chmod +x gradlew && ./gradlew --no-daemon clean bootJar

FROM ${RUNTIME_IMAGE} AS runtime
WORKDIR /app

COPY --from=build /workspace/apps/api/build/libs/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
