# W pierwszym etapie budujemy produkcyjne pliki aplikacji React.
FROM node:20-alpine AS build

# Ustawiamy katalog roboczy etapu budowania.
WORKDIR /app

# Kopiujemy pliki zależności osobno, aby Docker mógł wykorzystać pamięć podręczną.
COPY package*.json ./

# Instalujemy dokładnie wersje zależności zapisane w package-lock.json.
RUN npm ci

# Kopiujemy kod źródłowy aplikacji.
COPY . .

# Przyjmujemy adres backendu jako argument budowania obrazu.
ARG REACT_APP_API_URL=http://localhost:8080
ENV REACT_APP_API_URL=$REACT_APP_API_URL

# Tworzymy zoptymalizowane statyczne pliki produkcyjne.
RUN npm run build

# W drugim etapie serwujemy gotową aplikację za pomocą lekkiego Nginx.
FROM nginx:alpine

# Wgrywamy konfigurację obsługującą port Rendera i routing aplikacji SPA.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Kopiujemy wyłącznie gotowy build, bez Node.js i zależności deweloperskich.
COPY --from=build /app/build /usr/share/nginx/html

# Dokumentujemy port używany przez usługę frontendową.
EXPOSE 10000

# Uruchamiamy Nginx jako główny proces kontenera.
CMD ["nginx", "-g", "daemon off;"]
