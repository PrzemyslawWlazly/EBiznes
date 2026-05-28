# Jako bazy używamy lekkiego, oficjalnego obrazu "alpine" systemu Linux ze zintegrowanym środowiskiem Go w wersji 1.20
FROM golang:1.20-alpine

# Tworzymy folder "/app" wewnątrz wirtualnego kontenera i ustawiamy go jako domyślne miejsce pracy dla kolejnych komend
WORKDIR /app

# Kopiujemy z naszego komputera plik definicji środowiska (go.mod) prosto do ścieżki "/app" w kontenerze
COPY go.mod ./

# Kopiujemy nasz fizyczny kod źródłowy (main.go) w to samo miejsce w kontenerze
COPY main.go ./

# Uruchamiamy kompilator w kontenerze, który przetworzy kod i stworzy z niego plik wykonywalny o nazwie "server"
RUN go build -o server main.go

# Komunikat informacyjny dla mechanizmów sieciowych Dockera, że ten konkretny kontener chce nadawać na porcie 8080
EXPOSE 8080

# Definiujemy absolutnie ostatnią komendę - uruchomienie skompilowanego chwilę wcześniej pliku po restarcie kontenera
CMD ["./server"]