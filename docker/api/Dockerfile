# syntax=docker/dockerfile:1

ARG BASE_API_IMAGE=gradle:8.14.4-jdk21
ARG RUNTIME_IMAGE=eclipse-temurin:21-jre

FROM ${BASE_API_IMAGE} AS build
WORKDIR /workspace

COPY apps/api/build.gradle.kts apps/api/settings.gradle.kts apps/api/gradlew apps/api/gradlew.bat ./apps/api/
COPY apps/api/gradle ./apps/api/gradle
COPY apps/api/src ./apps/api/src
COPY gradle ./gradle

WORKDIR /workspace/apps/api
RUN chmod +x gradlew && ./gradlew --no-daemon clean bootJar

FROM ${RUNTIME_IMAGE} AS runtime
WORKDIR /app

COPY --from=build /workspace/apps/api/build/libs/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
