# Використовуємо офіційний образ OpenJDK як базу
FROM openjdk:21-jdk-slim  

# Встановлюємо робочу директорію в контейнері
WORKDIR /app

# Копіюємо JAR-файл вашого бекенду в контейнер
COPY target/minAuthProj-0.0.1-SNAPSHOT.jar app.jar

# Вказуємо команду для запуску додатку
ENTRYPOINT ["java", "-jar", "app.jar"]

# Експонуємо порт (наприклад, 8080, якщо ваш бекенд його використовує)
EXPOSE 8080