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
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
