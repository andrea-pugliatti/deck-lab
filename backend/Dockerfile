# Build stage
FROM maven:3.9.16-eclipse-temurin-25-alpine AS base
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src

# Run tests
FROM base AS testrunner
RUN mvn test

# Build package
FROM base AS build
RUN mvn package -DskipTests

# Run stage
FROM eclipse-temurin:25-jre
WORKDIR /app
RUN apt-get update && \
    apt-get install -y --no-install-recommends wget curl && \
    rm -rf /var/lib/apt/lists/*
RUN addgroup --system --gid 1001 appgroup && \
    adduser --system --uid 1001 --ingroup appgroup --no-create-home appuser
COPY --from=build --chown=appuser:appgroup /app/target/*.jar app.jar
USER appuser
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
