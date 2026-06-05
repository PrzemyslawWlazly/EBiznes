FROM gradle:8.5-jdk21 AS builder
# Pierwszy etap obrazu zawiera Gradle oraz JDK potrzebne do zbudowania bota.

WORKDIR /app
# Ustawiamy katalog roboczy etapu budowania.

COPY build.gradle.kts settings.gradle.kts ./
# Kopiujemy konfiguracje Gradle przed kodem, aby lepiej wykorzystac cache Dockera.

COPY src ./src
# Kopiujemy zrodla Kotlin bota Discord.

RUN gradle installDist --no-daemon
# Budujemy aplikacje i przygotowujemy katalog wykonywalny przez plugin application.

FROM eclipse-temurin:21-jre-jammy
# Drugi etap zawiera tylko JRE, czyli srodowisko potrzebne do uruchomienia gotowej aplikacji.

WORKDIR /app
# Ustawiamy katalog roboczy finalnego kontenera.

COPY --from=builder /app/build/install/discord-bot ./
# Kopiujemy z etapu builder tylko zbudowana aplikacje, bez calego Gradle i zrodel.

CMD ["./bin/discord-bot"]
# Uruchamiamy skrypt startowy wygenerowany przez Gradle.
