FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /build

COPY mvnw ./
COPY .mvn ./.mvn
COPY pom.xml ./
RUN sed -i 's/\r$//' mvnw && chmod +x mvnw && ./mvnw -B dependency:go-offline

COPY src ./src
RUN ./mvnw -B -DskipTests package

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

RUN addgroup -S app && adduser -S app -G app
COPY --chown=app:app --from=build /build/target/*.jar /app/app.jar

USER app
EXPOSE 8000
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
