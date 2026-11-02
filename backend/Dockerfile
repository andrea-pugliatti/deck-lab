# Build stage
FROM maven:3.9.16-eclipse-temurin-25-alpine AS base
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src

# Run tests
FROM base AS testrunner
RUN mvn test

# Build package and extract Spring Boot layers
FROM base AS build
RUN mvn package -DskipTests && \
    java -Djarmode=tools -jar target/*.jar extract --layers --destination target/extracted

# Run stage with JVM Class Data Sharing (CDS) for fast scale-to-zero cold starts
FROM eclipse-temurin:25-jre
WORKDIR /app
RUN apt-get update && \
    apt-get install -y --no-install-recommends wget curl && \
    rm -rf /var/lib/apt/lists/*
RUN addgroup --system --gid 1001 appgroup && \
    adduser --system --uid 1001 --ingroup appgroup --no-create-home appuser
COPY --from=build --chown=appuser:appgroup /app/target/extracted/dependencies/ ./
COPY --from=build --chown=appuser:appgroup /app/target/extracted/spring-boot-loader/ ./
COPY --from=build --chown=appuser:appgroup /app/target/extracted/snapshot-dependencies/ ./
COPY --from=build --chown=appuser:appgroup /app/target/extracted/application/ ./
USER appuser
RUN java -XX:ArchiveClassesAtExit=application.jsa -Dspring.context.exit=onRefresh -jar app.jar --spring.autoconfigure.exclude=org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration,org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration || true
ENV JAVA_OPTS="-XX:TieredStopAtLevel=1 -Xmx512m -XX:SharedArchiveFile=application.jsa"
EXPOSE 8080
ENTRYPOINT ["sh", "-c", "exec java ${JAVA_OPTS} -jar app.jar"]
