// Plik build.sbt to serce każdego projektu opartego na SBT (Scala Build Tool).
// To tutaj definiujemy metadane projektu oraz wszystkie zewnętrzne biblioteki (zależności), 
// które SBT musi pobrać z internetu (z repozytoriów Maven), aby nasz kod zadziałał.

// --- 1. METADANE PROJEKTU ---
// name określa nazwę naszego projektu. Będzie ona widoczna np. podczas budowania paczki.
name := "Zestaw2Scalatra"

// version to po prostu numer wersji naszej aplikacji. Zaczynamy od standardowego 0.1.0.
version := "0.1.0"

// scalaVersion to dokładna wersja kompilatora języka Scala, którego używamy. 
// Musi być zgodna z wersjami pobieranych bibliotek. Używamy stabilnej wersji 2.13.12.
scalaVersion := "2.13.12"

// --- 2. ZMIENNE POMOCNICZE ---
// Definiujemy stałą wartość (val) przechowującą numer wersji frameworka Scalatra.
// Zmieniliśmy wersję na 2.8.4 – jest to sprawdzona wersja, która nie generuje 
// problemów z rozwiązywaniem zależności (Dependency Resolution) w SBT.
val ScalatraVersion = "2.8.4"

// --- 3. ZALEŻNOŚCI (BIBLIOTEKI) ---
// libraryDependencies to lista zewnętrznych paczek. Operator ++= dodaje poniższy zbiór (Seq) 
// bibliotek do konfiguracji naszego projektu.
libraryDependencies ++= Seq(
  // Główny silnik frameworka Scalatra. 
  // Podwójne %% oznacza, że SBT automatycznie dobierze paczkę zgodną z naszą wersją Scali (2.13).
  "org.scalatra" %% "scalatra" % ScalatraVersion,
  
  // Moduł Scalatry pozwalający na łatwą pracę z formatem JSON (odbieranie i wysyłanie danych).
  "org.scalatra" %% "scalatra-json" % ScalatraVersion,
  
  // json4s to popularna biblioteka w Scali do operacji na plikach i danych JSON. 
  // Wersja "jackson" oznacza, że korzysta pod spodem z bardzo wydajnego, javowego parsera Jackson.
  "org.json4s" %% "json4s-jackson" % "4.0.6",
  
  // Wbudowany serwer HTTP (Jetty). Pozwala uruchomić aplikację bez potrzeby instalowania zewnętrznych serwerów.
  // Używamy wersji 9.4.x, ponieważ w 100% pasuje do starszego, stabilnego standardu javax.
  "org.eclipse.jetty" % "jetty-webapp" % "9.4.53.v20231009",
  
  // API serwletów - absolutny fundament aplikacji webowych na maszynie JVM.
  // Ponieważ zeszliśmy do Scalatry 2.8.x, używamy historycznego i pewnego pakietu "javax.servlet", 
  // zamiast nowszego "jakarta.servlet", którego szukałeś w poprzedniej wersji.
  "javax.servlet" % "javax.servlet-api" % "3.1.0"
)

// --- 4. KONFIGURACJA URUCHAMIANIA ---
// Ta linijka mówi narzędziu SBT, która klasa w naszym projekcie zawiera metodę "main" (punkt wejścia).
// Zastosowanie ukośników to nowoczesna składnia SBT, która usuwa błędy i ostrzeżenia w konsoli.
// Gdy w pliku Dockerfile wywołujemy "sbt run", SBT uruchomi bezpośrednio klasę "JettyMain".
Compile / run / mainClass := Some("JettyMain")