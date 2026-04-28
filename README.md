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





[zestaw5.webm](https://github.com/user-attachments/assets/147207fc-ac36-4cb1-b5bc-7f114b63bda8)


-----------------------



-----------------------------------------



-----------------------------------------



-----------------------------------------



-----------------------------------------



-----------------------------------------



-----------------------------------------



-----------------------------------------


-----------------------------------------

