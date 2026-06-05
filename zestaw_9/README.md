## Zadanie 9: Bot Discord + frontend JS + serwis GPT/Ollama

[Link do głównego folderu projektu](https://github.com/PrzemyslawWlazly/EBiznes/tree/main/zestaw_9)

✅ **3.0 Należy stworzyć po stronie serwerowej osobny serwis do łącznia z chatGPT**
* [Serwis Python/FastAPI: main.py](https://github.com/PrzemyslawWlazly/EBiznes/blob/main/zestaw_9/gpt-service/app/main.py)
* [Zależności serwisu: requirements.txt](https://github.com/PrzemyslawWlazly/EBiznes/blob/main/zestaw_9/gpt-service/requirements.txt)
* [Dockerfile serwisu GPT](https://github.com/PrzemyslawWlazly/EBiznes/blob/main/zestaw_9/gpt-service/Dockerfile)

✅ **3.5 Należy połączyć serwis z interfejsem frontendowym via serwis w Kotlinie (zadanie 3) - Discord + JS**
* [Frontend HTML: index.html](https://github.com/PrzemyslawWlazly/EBiznes/blob/main/zestaw_9/gpt-service/static/index.html)
* [Logika frontendu JS: app.js](https://github.com/PrzemyslawWlazly/EBiznes/blob/main/zestaw_9/gpt-service/static/app.js)
* [Style frontendu: style.css](https://github.com/PrzemyslawWlazly/EBiznes/blob/main/zestaw_9/gpt-service/static/style.css)
* [Bot Discord w Kotlinie z komendą `!gpt`: Main.kt](https://github.com/PrzemyslawWlazly/EBiznes/blob/main/zestaw_9/discord-bot/src/main/kotlin/pl/ebiznes/discordbot/Main.kt)
* [Konfiguracja Gradle bota: build.gradle.kts](https://github.com/PrzemyslawWlazly/EBiznes/blob/main/zestaw_9/discord-bot/build.gradle.kts)
* [Połączenie usług przez Docker Compose](https://github.com/PrzemyslawWlazly/EBiznes/blob/main/zestaw_9/docker-compose.yml)

✅ **4.0 Stworzyć listę 5 różnych otwarć oraz zamknięć rozmowy**
* [Listy `CONVERSATION_OPENINGS` i `CONVERSATION_CLOSINGS`: main.py](https://github.com/PrzemyslawWlazly/EBiznes/blob/main/zestaw_9/gpt-service/app/main.py)
* [Endpoint pokazujący otwarcia i zamknięcia: `/conversation-parts`](https://github.com/PrzemyslawWlazly/EBiznes/blob/main/zestaw_9/gpt-service/app/main.py)

✅ **4.5 Filtrowanie po zagadnieniach związanych ze sklepem do GPT**
* [Filtr tematyczny `SHOP_TOPIC_KEYWORDS`: main.py](https://github.com/PrzemyslawWlazly/EBiznes/blob/main/zestaw_9/gpt-service/app/main.py)
* [Funkcja sprawdzająca temat pytania `is_shop_related`: main.py](https://github.com/PrzemyslawWlazly/EBiznes/blob/main/zestaw_9/gpt-service/app/main.py)
* [Endpoint pokazujący słowa filtra: `/topic-filter`](https://github.com/PrzemyslawWlazly/EBiznes/blob/main/zestaw_9/gpt-service/app/main.py)
* [Szybkie odpowiedzi sklepowe z katalogu produktów: main.py](https://github.com/PrzemyslawWlazly/EBiznes/blob/main/zestaw_9/gpt-service/app/main.py)

❌ **5.0 Filtrowanie odpowiedzi po sentymencie**
* *(Nie zrealizowano)*

## Uruchomienie

Najpierw należy uruchomić lub przygotować lokalną Ollamę:

```bash
ollama pull qwen2.5:0.5b
ollama serve
```

Następnie w katalogu projektu:

```bash
cd /home/harry-potter/EBiznes_Repo/zestaw_9
export DISCORD_TOKEN="TWÓJ_TOKEN_BOTA"
docker compose up --build
```

Frontend jest dostępny pod adresem:

```text
http://127.0.0.1:8000/
```

Przykładowe komendy na Discordzie:

```text
!kategorie
!produkty Magia
!gpt Ile kosztuje kociołek?
!gpt Czy peleryna niewidka jest dostępna?
!gpt Opowiedz mi o piłce nożnej
```

Ostatnie pytanie powinno zostać odrzucone przez filtr tematyczny z punktu 4.5.
