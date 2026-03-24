# 1 Bazowy obraz z Gradle i Java 17
FROM gradle:8.5-jdk17
# Używamy oficjalnego obrazu Gradle, który już zawiera JDK i Gradle.
# To oszczędza czas i eliminuje problemy z instalacją JDK lub Gradle ręcznie.

# 2 Ustawiamy katalog roboczy w kontenerze
WORKDIR /app
# Wszystkie polecenia RUN, CMD i COPY będą wykonywane w katalogu /app w kontenerze.

# 3 Kopiowanie plików projektu do kontenera
COPY . .
# COPY . . kopiuje wszystkie pliki z bieżącego katalogu projektu (tam, gdzie jest Dockerfile)
# do katalogu /app w kontenerze.

# 4 Budowanie projektu Gradle
RUN gradle build --no-daemon
# RUN wykonuje polecenie podczas budowania obrazu.
# Tutaj budujemy projekt Gradle (np. HelloWorld Kotlin/Java).
# --no-daemon sprawia, że Gradle nie uruchamia procesu demona, co jest lepsze w Dockerze.

# 5 Domyślna komenda uruchamiana przy starcie kontenera
CMD ["gradle", "run", "--no-daemon"]
# CMD definiuje, co wykona się, gdy uruchomimy kontener.
# Tutaj uruchamiamy aplikację przez Gradle.
# --no-daemon jest ważne, żeby Gradle działał poprawnie w kontenerze bez pozostawiania procesów w tle.
