# 1. Bazowy obraz Ubuntu 22.04
FROM ubuntu:22.04
# FROM określa, od jakiego obrazu startujemy budowę naszego obrazu.
# Tutaj używamy Ubuntu 22.04 jako systemu bazowego.

# 2. Wyłączenie interaktywnego trybu instalacji
ENV DEBIAN_FRONTEND=noninteractive
# Ustawienie zmiennej środowiskowej, żeby apt-get nie pytał o potwierdzenia podczas instalacji pakietów.

# 3. Aktualizacja listy pakietów i instalacja wymaganych narzędzi
RUN apt-get update && \
    apt-get install -y openjdk-8-jdk curl unzip wget git && \
    apt-get clean
# RUN wykonuje polecenia wewnątrz warstwy obrazu.
# - apt-get update → aktualizacja listy pakietów z repozytoriów Ubuntu
# - apt-get install -y … → instalacja JDK 8, curl, unzip, wget i git (niezbędne do Gradle i pobierania plików)
# - apt-get clean → usunięcie cache apt, żeby zmniejszyć ostateczny rozmiar obrazu

# 4. Zdefiniowanie wersji Gradle jako globalnej zmiennej środowiskowej
ENV GRADLE_VERSION=8.5
# ENV sprawia, że zmienna GRADLE_VERSION będzie widoczna w pamięci Dockera we WSZYSTKICH kolejnych krokach (zarówno w RUN, jak i ENV).

# 5. Pobranie i instalacja Gradle
RUN wget https://services.gradle.org/distributions/gradle-${GRADLE_VERSION}-bin.zip -P /tmp && \
    unzip -d /opt/gradle /tmp/gradle-${GRADLE_VERSION}-bin.zip && \
    rm /tmp/gradle-${GRADLE_VERSION}-bin.zip
# - wget pobiera wybraną wersję Gradle (tutaj 8.5) i zapisuje ją w folderze /tmp
# - unzip rozpakowuje archiwum do katalogu /opt/gradle
# - rm usuwa pobranego zipa, żeby zaoszczędzić miejsce i odchudzić kontener

# 6. Dodanie Gradle do zmiennej PATH
ENV PATH="/opt/gradle/gradle-${GRADLE_VERSION}/bin:${PATH}"
# Dzięki temu system wie, gdzie szukać narzędzia Gradle, a polecenie `gradle` staje się dostępne globalnie w całym kontenerze.

# 7. Utworzenie katalogu roboczego
WORKDIR /app
# WORKDIR mówi Dockerowi, że wszystkie kolejne polecenia (oraz domyślny start kontenera) mają odbywać się wewnątrz katalogu /app.

# 8. Kopiowanie plików projektu do kontenera
COPY . /app
# COPY kopiuje całą zawartość folderu lokalnego (tam, gdzie leży Twój Dockerfile) do katalogu /app wewnątrz kontenera.

# 9. Domyślna komenda uruchamiana przy starcie kontenera
CMD ["gradle", "build"]
# CMD definiuje domyślne polecenie, które wykona się ZAWSZE po uruchomieniu kontenera komendą `docker run`.
# Tutaj uruchamiamy po prostu standardowe budowanie projektu Gradle.
