# Używamy Ubuntu jako bazy
FROM ubuntu:22.04

# Wyłączenie interakcji
ENV DEBIAN_FRONTEND=noninteractive

# Aktualizacja pakietów
RUN apt-get update

# Instalacja Python 3.10
RUN apt-get install -y python3.10 python3-pip

# Katalog roboczy
WORKDIR /app

# Komenda startowa
CMD ["python3.10", "--version"]
