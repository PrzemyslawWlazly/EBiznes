# Używamy oficjalnego obrazu SBT jako obrazu bazowego (Zawiera Javę i SBT potrzebne dla Scali)
FROM sbtscala/scala-sbt:eclipse-temurin-jammy-17.0.10_7_1.9.9_2.13.12
# Utworzenie i ustawienie folderu roboczego /app wewnątrz wirtualnej przestrzeni naszego obrazu
WORKDIR /app
# Kopiowanie definicji zależności build.sbt do środowiska kontenera
COPY build.sbt .
# Wykonanie instalacji zależności w fazie bazy (SBT pobierze setki bibliotek na tym etapie warstwy)
RUN sbt update
# Przerzucanie reszty kodu, np. z folderu 'src', do wnętrza wyizolowanego kontenera
COPY src /app/src
# Informowanie środowiska docker że aplikacja w środku wystawia port sieciowy 8080
EXPOSE 8080
# Instrukcja końcowa CMD która odpali proces, czyli wywoła komendę 'run' we frameworku kompilacyjnym (uruchomi JettyMain)
CMD ["sbt", "run"]
