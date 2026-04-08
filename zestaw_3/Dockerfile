# Określa bazowy obraz do pierwszego etapu budowy: jest to oficjalny obraz narzędzia Gradle ze środowiskiem Java Development Kit w wersji 21, i nadaje mu nazwę "builder"
FROM gradle:8.5-jdk21 AS builder

# Zmienia (lub tworzy, jeśli nie istnieje) aktualny katalog roboczy wewnątrz obrazu Dockera na "/app", gdzie będą od tej pory uruchamiane wszystkie kolejne komendy
WORKDIR /app

# Kopiuje nasze lokalne pliki konfiguracyjne projektu (budowania i ustawień) do aktualnego katalogu wewnątrz kontenera Dockera
COPY build.gradle.kts settings.gradle.kts ./

# Kopiuje cały lokalny folder z kodem źródłowym "src" wraz z jego podkatalogami do wnętrza aktualnego katalogu roboczego w kontenerze
COPY src ./src

# Uruchamia proces Gradle z poleceniem "installDist", który kompiluje projekt i przygotowuje pliki wykonywalne bota, a flaga "--no-daemon" zapobiega marnowaniu zasobów po zakończeniu budowy
RUN gradle installDist --no-daemon


# Rozpoczyna drugi, końcowy etap konfiguracji kontenera używając lekkiego obrazu zawierającego tylko środowisko uruchomieniowe Javy (JRE) bez zbędnych narzędzi deweloperskich
FROM eclipse-temurin:21-jre-jammy

# Ponownie ustawia katalog roboczy, tym razem dla docelowego, uruchomieniowego kontenera, na ścieżkę "/app"
WORKDIR /app

# Przenosi tylko gotową, skompilowaną aplikację z pierwszego etapu ("builder") do obecnego, omijając cały kod źródłowy i ciężkie środowisko narzędziowe (odchudza obraz)
COPY --from=builder /app/build/install/discord-bot ./

# Definiuje domyślne polecenie, które zostanie uruchomione automatycznie w momencie startu gotowego kontenera – jest to ścieżka do skryptu startowego wygenerowanego wcześniej przez wtyczkę 'application'
CMD ["./bin/discord-bot"]