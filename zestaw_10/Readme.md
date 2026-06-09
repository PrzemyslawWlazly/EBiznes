# Zestaw 10 - Chmura

Projekt zawiera aplikację React oraz backend Go przygotowane do uruchomienia
w osobnych kontenerach Docker i wdrożenia na platformę chmurową.

## Zakres zadania

- **3.0** Utworzenie odpowiednich instancji Docker w chmurze.
- **3.5** Pipeline GitHub Actions budujący aplikację.
- **4.0** Powiadomienie mailowe o wyniku budowania.
- **4.5** Automatyczny deployment frontendu i backendu do chmury.
- **5.0** Regresyjne testy funkcjonalne uruchamiane w GitHub Actions.

## Struktura

- `backend` - aplikacja serwerowa Go,
- `frontend` - aplikacja React serwowana produkcyjnie przez Nginx,
- `docker-compose.yml` - lokalne uruchomienie obu usług.

## Uruchomienie lokalne

```bash
docker compose up --build
```

Frontend:

```text
http://localhost:3000
```

Backend:

```text
http://localhost:8080/api/products
```

## Aktualny status

- Przygotowano obrazy Docker frontendu i backendu.
- Backend obsługuje port przekazywany przez zmienną `PORT`.
- Frontend przyjmuje adres API przez argument `REACT_APP_API_URL`.
- Przygotowano pipeline budowania obrazów w GitHub Actions.
- Usługi chmurowe, notyfikacja i deployment wymagają konfiguracji dla repozytorium EBiznes.
- Punkt 5.0 nie został zrealizowany.
