# syntax=docker/dockerfile:1

FROM gradle:8.14.4-jdk21 AS build
WORKDIR /home/gradle/project

COPY --chown=gradle:gradle build.gradle.kts settings.gradle.kts gradlew gradlew.bat ./
COPY --chown=gradle:gradle gradle ./gradle
COPY --chown=gradle:gradle src ./src

RUN gradle --no-daemon clean bootJar

FROM eclipse-temurin:21-jre
WORKDIR /app

COPY --from=build /home/gradle/project/build/libs/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
