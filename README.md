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

# Projekt E-biznes - Zestaw 2 (Scalatra)

[Link do głównego folderu zadania 2](https://github.com/PrzemyslawWlazly/EBiznes/tree/main/zestaw_2)

## Realizacja zadań

Należy stworzyć aplikację na frameworku Play lub Scalatra. Projekt zrealizowano przy użyciu frameworka **Scalatra**.

✅ **3.0 Należy stworzyć kontroler do Produktów** [link do obrazu na Docker Hub](https://hub.docker.com/r/przemyslawwlazly/scalatra-app) | [kod rozwiązania: ProductController.scala](https://github.com/PrzemyslawWlazly/EBiznes/blob/main/zestaw_2/src/main/scala/controllers/ProductController.scala)

✅ **3.5 Do kontrolera należy stworzyć endpointy zgodnie z CRUD - dane pobierane z listy** [link do obrazu na Docker Hub](https://hub.docker.com/r/przemyslawwlazly/scalatra-app) | [kod rozwiązania: ProductController.scala](https://github.com/PrzemyslawWlazly/EBiznes/blob/main/zestaw_2/src/main/scala/controllers/ProductController.scala), [Models.scala](https://github.com/PrzemyslawWlazly/EBiznes/blob/main/zestaw_2/src/main/scala/models/Models.scala)

✅ **4.0 Należy stworzyć kontrolery do Kategorii oraz Koszyka + endpointy zgodnie z CRUD** [link do obrazu na Docker Hub](https://hub.docker.com/r/przemyslawwlazly/scalatra-app) | [kod rozwiązania: CategoryController.scala](https://github.com/PrzemyslawWlazly/EBiznes/blob/main/zestaw_2/src/main/scala/controllers/CategoryController.scala), [CartController.scala](https://github.com/PrzemyslawWlazly/EBiznes/blob/main/zestaw_2/src/main/scala/controllers/CartController.scala)

❌ **4.5 Należy aplikację uruchomić na dockerze (stworzyć obraz) oraz dodać skrypt uruchamiający aplikację via ngrok** *(skrypty utworzone - problem środowiskowy z ngrok)*
[kod rozwiązania: Dockerfile](https://github.com/PrzemyslawWlazly/EBiznes/blob/main/zestaw_2/Dockerfile), [ngrok_start.sh](https://github.com/PrzemyslawWlazly/EBiznes/blob/main/zestaw_2/ngrok_start.sh)

✅ **5.0 Należy dodać konfigurację CORS dla dwóch hostów dla metod CRUD** [link do obrazu na Docker Hub](https://hub.docker.com/r/przemyslawwlazly/scalatra-app) | [kod rozwiązania: ScalatraBootstrap.scala](https://github.com/PrzemyslawWlazly/EBiznes/blob/main/zestaw_2/src/main/scala/ScalatraBootstrap.scala), [BaseController](https://github.com/PrzemyslawWlazly/EBiznes/blob/main/zestaw_2/src/main/scala/controllers/ProductController.scala)


-----------------------------------------
