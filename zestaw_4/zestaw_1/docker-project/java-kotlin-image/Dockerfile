# FROM określa obraz bazowy, na którym budujemy nasz obraz
# Używamy Ubuntu 22.04, ponieważ ma dobre wsparcie dla pakietów (w tym Java 8)
FROM ubuntu:22.04

# ENV ustawia zmienną środowiskową wewnątrz obrazu
# DEBIAN_FRONTEND=noninteractive powoduje, że instalator apt nie zadaje pytań (np. o strefę czasową)
# Jest to bardzo ważne w Dockerze, bo build musi być automatyczny
ENV DEBIAN_FRONTEND=noninteractive

# RUN wykonuje polecenia w trakcie budowania obrazu
# Wszystko w jednej linii (połączone &&), żeby uniknąć błędów ze znakami "\" oraz zmniejszyć liczbę warstw
RUN apt-get update && apt-get install -y openjdk-8-jdk kotlin curl unzip && apt-get clean

# WORKDIR ustawia katalog roboczy wewnątrz kontenera
# Jeśli katalog nie istnieje, Docker automatycznie go utworzy
# Wszystkie kolejne operacje (COPY, RUN, CMD) będą wykonywane w tym katalogu
WORKDIR /app

# CMD definiuje domyślne polecenie uruchamiane przy starcie kontenera
# Tutaj uruchamiamy komendę sprawdzającą wersję Java
# Składnia tablicowa ["komenda", "argument"] jest bezpieczniejsza niż tekstowa
CMD ["java", "-version"]
