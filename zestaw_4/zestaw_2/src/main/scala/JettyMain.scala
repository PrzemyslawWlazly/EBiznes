// Definicja klasy serwera HTTP z biblioteki Jetty, która będzie obsługiwać połączenia sieciowe.
import org.eclipse.jetty.server.Server
// Import klasy WebAppContext, która tworzy środowisko dla aplikacji internetowej wewnątrz Jetty.
import org.eclipse.jetty.webapp.WebAppContext
// Import ScalatraListener - to jest "most", który łączy serwer Jetty z plikiem ScalatraBootstrap.
import org.scalatra.servlet.ScalatraListener 

// Definicja głównego obiektu startowego aplikacji w języku Scala.
object JettyMain {
  // Główna metoda main, która jest punktem wejścia (entry point) uruchamianym przez Docker i SBT.
  def main(args: Array[String]): Unit = {
    // Przypisanie numeru portu 8080 do zmiennej, na którym serwer będzie nasłuchiwał żądań.
    val port = 8080
    // Utworzenie nowej instancji serwera Jetty przypisanej do wybranego portu.
    val server = new Server(port)
    // Utworzenie obiektu kontekstu aplikacji, który zarządza zasobami i kontrolerami.
    val context = new WebAppContext()
    
    // Ustawienie ścieżki do plików statycznych (nawet jeśli ich nie używamy, Jetty tego wymaga).
    context.setResourceBase("src/main/webapp")
    // Ustawienie głównej ścieżki URL aplikacji na "/" (root).
    context.setContextPath("/")
    
    // KLUCZOWE: Dodanie Listenera, który przy starcie serwera automatycznie wywoła plik ScalatraBootstrap.
    context.addEventListener(new ScalatraListener)
    
    // Powiązanie skonfigurowanego kontekstu z instancją serwera Jetty.
    server.setHandler(context)

    // Wydanie polecenia uruchomienia serwera i rozpoczęcia nasłuchiwania na porcie 8080.
    server.start()
    // Instrukcja nakazująca głównemu wątkowi czekanie, aby aplikacja nie wyłączyła się zaraz po starcie.
    server.join()
  }
}