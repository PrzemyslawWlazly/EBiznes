 Zadanie 1 Docker

✅ 3.0 obraz ubuntu z Pythonem w wersji 3.10 [ link do obrazu](https://hub.docker.com/r/przemyslawwlazly/python310)  
✅ 3.5 obraz ubuntu:24.02 z Javą w wersji 8 oraz Kotlinem [ link do obrazu](https://hub.docker.com/r/przemyslawwlazly/java-kotlin)  
✅ 4.0 do powyższego należy dodać najnowszego Gradle’a oraz paczkę JDBC 
SQLite w ramach projektu na Gradle (build.gradle) [ link do obrazu](https://hub.docker.com/r/przemyslawwlazly/gradle-sqlite)  
✅ 4.5 stworzyć przykład typu HelloWorld oraz uruchomienie aplikacji   
przez CMD oraz gradle [link do obrazu](https://hub.docker.com/r/przemyslawwlazly/hello-app)  
❌ 5.0 dodać konfigurację docker-compose  

[link do zadania 1](https://github.com/PrzemyslawWlazly/EBiznes/tree/main/zestaw_1/docker-project)  


-----------------------------------------
Zadanie 2 

[Link do głównego folderu zadania 2](https://github.com/PrzemyslawWlazly/EBiznes/tree/main/zestaw_2)

Należy stworzyć aplikację na frameworku Play lub Scalatra. Projekt zrealizowano przy użyciu frameworka **Scalatra**.

✅ **3.0 Należy stworzyć kontroler do Produktów** [link do obrazu na Docker Hub](https://hub.docker.com/r/przemyslawwlazly/scalatra-app) | [kod rozwiązania: ProductController.scala](https://github.com/PrzemyslawWlazly/EBiznes/blob/main/zestaw_2/src/main/scala/controllers/ProductController.scala)

✅ **3.5 Do kontrolera należy stworzyć endpointy zgodnie z CRUD - dane pobierane z listy** [link do obrazu na Docker Hub](https://hub.docker.com/r/przemyslawwlazly/scalatra-app) | [kod rozwiązania: ProductController.scala](https://github.com/PrzemyslawWlazly/EBiznes/blob/main/zestaw_2/src/main/scala/controllers/ProductController.scala), [Models.scala](https://github.com/PrzemyslawWlazly/EBiznes/blob/main/zestaw_2/src/main/scala/models/Models.scala)

✅ **4.0 Należy stworzyć kontrolery do Kategorii oraz Koszyka + endpointy zgodnie z CRUD** [link do obrazu na Docker Hub](https://hub.docker.com/r/przemyslawwlazly/scalatra-app) | [kod rozwiązania: CategoryController.scala](https://github.com/PrzemyslawWlazly/EBiznes/blob/main/zestaw_2/src/main/scala/controllers/CategoryController.scala), [CartController.scala](https://github.com/PrzemyslawWlazly/EBiznes/blob/main/zestaw_2/src/main/scala/controllers/CartController.scala)

❌ **4.5 Należy aplikację uruchomić na dockerze (stworzyć obraz) oraz dodać skrypt uruchamiający aplikację via ngrok** *(skrypty utworzone - problem środowiskowy z ngrok)*
[kod rozwiązania: Dockerfile](https://github.com/PrzemyslawWlazly/EBiznes/blob/main/zestaw_2/Dockerfile), [ngrok_start.sh](https://github.com/PrzemyslawWlazly/EBiznes/blob/main/zestaw_2/ngrok_start.sh)

✅ **5.0 Należy dodać konfigurację CORS dla dwóch hostów dla metod CRUD** [link do obrazu na Docker Hub](https://hub.docker.com/r/przemyslawwlazly/scalatra-app) | [kod rozwiązania: ScalatraBootstrap.scala](https://github.com/PrzemyslawWlazly/EBiznes/blob/main/zestaw_2/src/main/scala/ScalatraBootstrap.scala), [BaseController](https://github.com/PrzemyslawWlazly/EBiznes/blob/main/zestaw_2/src/main/scala/controllers/ProductController.scala)


-----------------------------------------

Zadanie 3 Kotlin

[Link do głównego folderu zadania 3](https://github.com/PrzemyslawWlazly/EBiznes/tree/main/zestaw_3)

✅ **3.0 Należy stworzyć aplikację kliencką w Kotlinie we frameworku, która pozwala na przesyłanie wiadomości na platformę Discord** [link do obrazu na Docker Hub](https://hub.docker.com/r/przemyslawwlazly/ebiznes-discord-bot) | [kod rozwiązania: Main.kt](https://github.com/PrzemyslawWlazly/EBiznes/blob/main/zestaw_3/src/main/kotlin/pl/ebiznes/discordbot/Main.kt), [Dockerfile](https://github.com/PrzemyslawWlazly/EBiznes/blob/main/zestaw_3/Dockerfile)

✅ **3.5 Aplikacja jest w stanie odbierać wiadomości użytkowników z platformy Discord skierowane do aplikacji (bota)** [link do obrazu na Docker Hub](https://hub.docker.com/r/przemyslawwlazly/ebiznes-discord-bot) | [kod rozwiązania: Main.kt](https://github.com/PrzemyslawWlazly/EBiznes/blob/main/zestaw_3/src/main/kotlin/pl/ebiznes/discordbot/Main.kt)

✅ **4.0 Zwróci listę kategorii na określone żądanie użytkownika** [link do obrazu na Docker Hub](https://hub.docker.com/r/przemyslawwlazly/ebiznes-discord-bot) | [kod rozwiązania: Main.kt](https://github.com/PrzemyslawWlazly/EBiznes/blob/main/zestaw_3/src/main/kotlin/pl/ebiznes/discordbot/Main.kt)

✅ **4.5 Zwróci listę produktów wg żądanej kategorii** [link do obrazu na Docker Hub](https://hub.docker.com/r/przemyslawwlazly/ebiznes-discord-bot) | [kod rozwiązania: Main.kt](https://github.com/PrzemyslawWlazly/EBiznes/blob/main/zestaw_3/src/main/kotlin/pl/ebiznes/discordbot/Main.kt)

❌ **5.0 Aplikacja obsłuży dodatkowo jedną z platform: Slack lub Messenger** *(nie zrealizowano)*



-----------------------------------------


Zadanie 4 Go + GORM

[Link do głównego folderu zadania 4](https://github.com/PrzemyslawWlazly/EBiznes/tree/main/zestaw_4)

✅ **3.0 Należy stworzyć aplikację we frameworku echo w j. Go, która będzie miała kontroler Produktów zgodny z CRUD** | [kod rozwiązania: main.go](https://github.com/PrzemyslawWlazly/EBiznes/blob/main/zestaw_4/main.go), [handlers/product.go](https://github.com/PrzemyslawWlazly/EBiznes/blob/main/zestaw_4/handlers/product.go)

✅ **3.5 Należy stworzyć model Produktów wykorzystując gorm oraz wykorzystać model do obsługi produktów (CRUD) w kontrolerze (zamiast listy) - użycie SQLite** | [kod rozwiązania: models/product.go](https://github.com/PrzemyslawWlazly/EBiznes/blob/main/zestaw_4/models/product.go), [database/db.go](https://github.com/PrzemyslawWlazly/EBiznes/blob/main/zestaw_4/database/db.go)

✅ **4.0 Należy dodać model Koszyka oraz dodać odpowiedni endpoint (relacja Many-to-Many)** | [kod rozwiązania: models/cart.go](https://github.com/PrzemyslawWlazly/EBiznes/blob/main/zestaw_4/models/cart.go), [handlers/cart.go](https://github.com/PrzemyslawWlazly/EBiznes/blob/main/zestaw_4/handlers/cart.go)

✅ **4.5 Należy stworzyć model kategorii i dodać relację między kategorią, a produktem (relacja One-to-Many)** | [kod rozwiązania: models/category.go](https://github.com/PrzemyslawWlazly/EBiznes/blob/main/zestaw_4/models/category.go), [handlers/category.go](https://github.com/PrzemyslawWlazly/EBiznes/blob/main/zestaw_4/handlers/category.go)

✅ **5.0 Pogrupować zapytania w gorm’owe scope'y (filtrowanie produktów po cenie)** | [kod rozwiązania: models/product.go (scope)](https://github.com/PrzemyslawWlazly/EBiznes/blob/main/zestaw_4/models/product.go), [handlers/product.go (użycie)](https://github.com/PrzemyslawWlazly/EBiznes/blob/main/zestaw_4/handlers/product.go)



[ FILM ](https://github.com/user-attachments/assets/1abd9af8-3cd4-465a-b9ce-397bfadab9bc)


-----------------------------------------
Zadanie 5

# Zadanie 5 Frontend

✅ **3.0** W ramach projektu stworzono dwa komponenty: Produkty oraz Płatności. Komponent [Products.js](https://github.com/PrzemyslawWlazly/EBiznes/blob/main/zestaw_5/frontend/src/components/Products.js) pobiera dane o asortymencie, natomiast [Payments.js](https://github.com/PrzemyslawWlazly/EBiznes/blob/main/zestaw_5/frontend/src/components/Payments.js) wysyła dane o płatnościach do serwera.

✅ **3.5** Dodano komponent [Cart.js](https://github.com/PrzemyslawWlazly/EBiznes/blob/main/zestaw_5/frontend/src/components/Cart.js) (Koszyk) wraz z dedykowanym widokiem. Do nawigacji między podstronami wykorzystano bibliotekę `react-router-dom`, skonfigurowaną w pliku [App.js](https://github.com/PrzemyslawWlazly/EBiznes/blob/main/zestaw_5/frontend/src/App.js).

✅ **4.0** Dane pomiędzy wszystkimi komponentami (produkty, stan koszyka, suma płatności) są przesyłane za pomocą React Hooks oraz Context API, co zostało zaimplementowane w pliku [AppContext.js](https://github.com/PrzemyslawWlazly/EBiznes/blob/main/zestaw_5/frontend/src/context/AppContext.js).

✅ **4.5** Przygotowano skrypt [docker-compose.yml](https://github.com/PrzemyslawWlazly/EBiznes/blob/main/zestaw_5/docker-compose.yml), który automatycznie buduje i uruchamia aplikację serwerową (Go) oraz kliencką (React).
- [Link do obrazu Frontend](https://hub.docker.com/r/przemyslawwlazly/esy-floresy-frontend)
- [Link do obrazu Backend](https://hub.docker.com/r/przemyslawwlazly/esy-floresy-backend)

❌ **5.0** Aplikacja serwerowa w języku Go nie została wyposażona w nagłówki obsługujące CORS 

[Link do całego zadania 5](https://github.com/PrzemyslawWlazly/EBiznes/tree/main/zestaw_5)




[EBiznes_zestaw5.webm](https://github.com/user-attachments/assets/d96a3c2c-6581-4abd-a75c-ff8f781f137d)



-----------------------
Zadanie 6

# Zadanie 6 Testy

✅ **3.0** W ramach projektu stworzono 20 zautomatyzowanych przypadków testowych end-to-end (E2E) w technologii CypressJS. Wszystkie scenariusze testowe weryfikujące interakcje użytkownika z aplikacją znajdują się w pliku [shop.cy.js](https://github.com/PrzemyslawWlazly/EBiznes/blob/main/zestaw_6/frontend/cypress/e2e/shop.cy.js).

✅ **3.5** Rozszerzono testy funkcjonalne E2E w pliku [shop.cy.js](https://github.com/PrzemyslawWlazly/EBiznes/blob/main/zestaw_6/frontend/cypress/e2e/shop.cy.js) poprzez zastosowanie zaawansowanego łańcuchowania metod weryfikujących (`.should()` oraz `.and()`), dzięki czemu cały zestaw zawiera łącznie ponad 50 asercji.




[Ebiznes_zest6_35.webm](https://github.com/user-attachments/assets/698d4de8-bc09-46db-b398-856e3f053326)


✅ **4.0** Stworzono zestaw testów jednostkowych (Unit Tests) dla komponentów frontendu w React przy użyciu bibliotek Jest oraz React Testing Library. Testy izolowanych komponentów oraz logiki biznesowej zawierają ponad 50 asercji i są umieszczone w pliku [AppUnit.test.js](https://github.com/PrzemyslawWlazly/EBiznes/blob/main/zestaw_6/frontend/src/AppUnit.test.js).

[Ebiznes_zest6_40.webm](https://github.com/user-attachments/assets/899dd9e7-1eeb-465e-89c4-b35a1181bb31)



✅ **4.5** Dodano zautomatyzowane testy API zaimplementowane w Cypressie, które pokrywają wszystkie endpointy aplikacji serwerowej Go (`GET /api/products` oraz `POST /api/payments`). Zgodnie z wymaganiami, każdy endpoint został pokryty scenariuszem pozytywnym oraz minimum jednym scenariuszem negatywnym (obsługa kodów błędów 404 i 405) w pliku [api.cy.js](https://github.com/PrzemyslawWlazly/EBiznes/blob/main/zestaw_6/frontend/cypress/e2e/api.cy.js).
- [Link do obrazu Frontend](https://hub.docker.com/r/przemyslawwlazly/zestaw-6-frontend)
- [Link do obrazu Backend](https://hub.docker.com/r/przemyslawwlazly/zestaw-6-backend)

- 
[EBiznes_zest6_45.webm](https://github.com/user-attachments/assets/48b90991-4073-42a4-a40e-16e49c4e330b)


❌ **5.0** Testy funkcjonalne nie zostały uruchomione na chmurowej platformie BrowserStack.

[Link do całego zadania 6](https://github.com/PrzemyslawWlazly/EBiznes/tree/main/zestaw_6)


-----------------------------------------
# Zadanie 7: Quality Assurance & SonarCloud

# Analiza SonarCloud dotyczy całego folderu EBiznes (bugs and code smells) - poprawki dotyczyły aplikacji: zadanie_6 (najnowszej wersji sklepu). Poprawiony zestaw_6 znajduje się w folderze zestaw_7

[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=PrzemyslawWlazly_EBiznes&metric=bugs)](https://sonarcloud.io/dashboard?id=PrzemyslawWlazly_EBiznes)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=PrzemyslawWlazly_EBiznes&metric=code_smells)](https://sonarcloud.io/dashboard?id=PrzemyslawWlazly_EBiznes)

✅ **3.0** Dodano linter `golangci-lint` do kodu aplikacji serwerowej. Narzędzie zostało zintegrowane z systemem kontroli wersji poprzez skrypt `pre-commit` (Git Hooks), który automatycznie skanuje i blokuje zapisywanie kodu niespełniającego standardów.

✅ **3.5** Wyeliminowano wszystkie błędy (Bugs) w kodzie na platformie SonarCloud, w tym krytyczne błędy składniowe JSX w plikach konfiguracyjnych frontendu w React.

✅ **4.0** Zrefaktoryzowano kod w celu usunięcia tzw. zapaszków (Code Smells). Poprawiono m.in. użycie przestarzałych metod w JavaScripcie, dodano walidację `PropTypes`, naprawiono pętle `.map()` z indeksami oraz poprawiono składnię wyrażeń regularnych w testach Cypressa.

✅ **4.5** Załatano wszystkie podatności i błędy bezpieczeństwa (Vulnerabilities). Wygenerowano brakujący plik `go.sum` (za pomocą `go mod tidy`), stabilizując drzewo zależności kryptograficznych na backendzie.

✅ **5.0** Osiągnięto wynik 0 bugów, 0 zapaszków i 0 podatności dla obu warstw aplikacji (serwerowej w Go i klienckiej w React) w analityce chmurowej SonarCloud. Zaktualizowano komentarze w kodzie.

[Link do całego zadania 7](https://github.com/PrzemyslawWlazly/EBiznes/tree/main/zestaw_7)


<img width="1611" height="897" alt="obraz" src="https://github.com/user-attachments/assets/255b6a40-bd54-4d28-be81-7907e6c35b74" />
<img width="1598" height="951" alt="obraz" src="https://github.com/user-attachments/assets/bb1e9017-026a-4223-a2a7-85cf4729580e" />
<img width="1598" height="951" alt="obraz" src="https://github.com/user-attachments/assets/a99f3298-6296-4416-a267-22e2c344a24a" />
<img width="1598" height="951" alt="obraz" src="https://github.com/user-attachments/assets/94c9a902-be4b-49ae-823c-e950c4bd39b8" />
<img width="1598" height="951" alt="obraz" src="https://github.com/user-attachments/assets/7915fd93-34ff-48f9-80df-2539d46011dd" />



-----------------------------------------
# Zadanie 8 Uwierzytelnianie i OAuth2

✅ **3.0** Zaimplementowano tradycyjny system logowania. Stworzono komponent [Login.js](https://github.com/PrzemyslawWlazly/EBiznes/blob/main/zestaw_8/frontend/src/components/Login.js) po stronie frontendu, który komunikuje się z dedykowanym endpointem `/api/login` zdefiniowanym w pliku głównym serwera [main.go](https://github.com/PrzemyslawWlazly/EBiznes/blob/main/zestaw_8/backend/main.go).

✅ **3.5** Zaimplementowano tradycyjny system rejestracji użytkowników. Dodano komponent [Register.js](https://github.com/PrzemyslawWlazly/EBiznes/blob/main/zestaw_8/frontend/src/components/Register.js), który przesyła dane do serwera, gdzie są one bezpiecznie szyfrowane i zapisywane w lokalnej bazie SQLite.


[EBiznes_zest_8_35.webm](https://github.com/user-attachments/assets/bf062fa6-70ec-436b-8c61-07490ace8442)




✅ **4.0** Wprowadzono możliwość logowania za pomocą konta **Google OAuth2**. Logika autoryzacji oraz wymiany tokenów została zaimplementowana bezpiecznie po stronie backendu w dedykowanym pliku [oauth.go](https://github.com/PrzemyslawWlazly/EBiznes/blob/main/zestaw_8/backend/handlers/oauth.go). Przycisk przekierowujący znajduje się w widoku [Login.js](https://github.com/PrzemyslawWlazly/EBiznes/blob/main/zestaw_8/frontend/src/components/Login.js).



[EBiznes_zestaw8_40.webm](https://github.com/user-attachments/assets/5b01872a-4598-45b8-850b-5f95e47467a5)

✅ **4.5** Wprowadzono dodatkową możliwość logowania za pomocą konta **GitHub OAuth2**. Konfiguracja oraz endpointy obsługujące wywołania zwrotne (callbacks) od GitHuba również zostały umieszczone w pliku [oauth.go](https://github.com/PrzemyslawWlazly/EBiznes/blob/main/zestaw_8/backend/handlers/oauth.go).

✅ **5.0** Spełniono restrykcyjny wymóg zapisywania danych logowania OAuth2 wyłącznie po stronie serwera. Frontend nie komunikuje się bezpośrednio z dostawcami tożsamości. Serwer Go (w pliku [oauth.go](https://github.com/PrzemyslawWlazly/EBiznes/blob/main/zestaw_8/backend/handlers/oauth.go)) samodzielnie odpytuje API Google/GitHuba o adres e-mail, zapisuje użytkownika do bazy danych, a następnie przekierowuje klienta do aplikacji React wraz z jednorazowym parametrem sesyjnym.

[EBiznes_zest8_45.webm](https://github.com/user-attachments/assets/56ec1de2-6152-415a-8eef-f32e25ff871a)




[Link do całego zadania 8](https://github.com/PrzemyslawWlazly/EBiznes/tree/main/zestaw_8)


-----------------------------------------
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




[Ebiznes_zestaw9_35.webm](https://github.com/user-attachments/assets/d6172482-13f0-463f-90b9-fe7c29b828b9)




✅ **4.0 Stworzyć listę 5 różnych otwarć oraz zamknięć rozmowy**
* [Listy `CONVERSATION_OPENINGS` i `CONVERSATION_CLOSINGS`: main.py](https://github.com/PrzemyslawWlazly/EBiznes/blob/main/zestaw_9/gpt-service/app/main.py)
* [Endpoint pokazujący otwarcia i zamknięcia: `/conversation-parts`](https://github.com/PrzemyslawWlazly/EBiznes/blob/main/zestaw_9/gpt-service/app/main.py)

✅ **4.5 Filtrowanie po zagadnieniach związanych ze sklepem do GPT**
* [Filtr tematyczny `SHOP_TOPIC_KEYWORDS`: main.py](https://github.com/PrzemyslawWlazly/EBiznes/blob/main/zestaw_9/gpt-service/app/main.py)
* [Funkcja sprawdzająca temat pytania `is_shop_related`: main.py](https://github.com/PrzemyslawWlazly/EBiznes/blob/main/zestaw_9/gpt-service/app/main.py)
* [Endpoint pokazujący słowa filtra: `/topic-filter`](https://github.com/PrzemyslawWlazly/EBiznes/blob/main/zestaw_9/gpt-service/app/main.py)
* [Szybkie odpowiedzi sklepowe z katalogu produktów: main.py](https://github.com/PrzemyslawWlazly/EBiznes/blob/main/zestaw_9/gpt-service/app/main.py)

[Ebiznes_zest9_45.webm](https://github.com/user-attachments/assets/d1fc5b4f-428d-4770-bea5-7b402d91881f)


❌ **5.0 Filtrowanie odpowiedzi po sentymencie**
* *(Nie zrealizowano)*

## Uruchomienie

Najpierw należy uruchomić lub przygotować lokalną Ollamę:

```bash
ollama pull qwen2.5:0.5b
ollama serve


-----------------------------------------



-----------------------------------------



-----------------------------------------



-----------------------------------------


-----------------------------------------

