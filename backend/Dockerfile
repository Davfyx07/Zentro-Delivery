# Stage 1 — build con Maven + JDK 21
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Copiar pom y wrapper para aprovechar cache (paths adjusted for repo root build context)
COPY backend/pom.xml ./
COPY backend/mvnw ./
COPY backend/.mvn .mvn

# Copiar código y compilar
COPY backend/src ./src
RUN mvn -B -DskipTests package

# Stage 2 — runtime con JRE 21
FROM eclipse-temurin:21-jre-jammy AS runtime
WORKDIR /app

# Copiar jar desde el stage de build
COPY --from=build /app/target/*.jar app.jar

# Opcional: crear usuario no-root
RUN addgroup --system appgroup && adduser --system appuser && chown appuser:appgroup /app
USER appuser

EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/app.jar"]