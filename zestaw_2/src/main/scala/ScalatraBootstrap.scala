// --- IMPORTY ---
// Importujemy główny pakiet frameworka Scalatra, który zawiera niezbędne klasy (np. LifeCycle).
import org.scalatra._

// Importujemy interfejs ServletContext ze standardu javax. 
// ServletContext to obiekt reprezentujący środowisko naszej aplikacji na serwerze (Jetty).
// Pozwala on na konfigurację globalnych parametrów serwera.
import javax.servlet.ServletContext 

// Importujemy nasze własne kontrolery, które stworzyliśmy w folderze "controllers".
// Bez tego plik Bootstrap nie wiedziałby o ich istnieniu.
import controllers.{ProductController, CategoryController, CartController}

// --- GŁÓWNA KLASA KONFIGURACYJNA ---
// Klasa ScalatraBootstrap dziedziczy po "LifeCycle". 
// Dzięki temu framework Scalatra wie, że jest to plik startowy i wywoła go automatycznie 
// w momencie uruchamiania serwera aplikacji.
class ScalatraBootstrap extends LifeCycle {
  
  // Nadpisujemy (override) metodę "init", która wykonuje się dokładnie jeden raz przy starcie.
  // W parametrze "context" serwer przekazuje nam dostęp do swojej konfiguracji.
  override def init(context: ServletContext): Unit = {
    
    // --- KONFIGURACJA CORS (Realizacja Punktu 5 z zadania) ---
    // Poniższa linijka to nasza POPRAWKA. 
    // Używamy natywnej metody Javy "setInitParameter", która przyjmuje dwa argumenty: (klucz, wartość).
    // Klucz: "org.scalatra.cors.allowedOrigins" (wewnętrzna nazwa ustawienia w Scalatrze).
    // Wartość: "http://localhost:3000,http://example.com" (lista dozwolonych adresów).
    // Dzięki temu przeglądarka pozwoli aplikacjom z tych dwóch adresów na odpytywanie naszego API.
    context.setInitParameter("org.scalatra.cors.allowedOrigins", "http://localhost:3000,http://example.com")
    
    // --- REJESTRACJA KONTROLERÓW (ROUTING) ---
    // Metoda "mount" podpina (montuje) konkretny kontroler pod określony adres URL.
    // Gwiazdka (*) na końcu oznacza tzw. "wildcard" - czyli wszystko, co następuje po tym adresie 
    // (np. "/products/1", "/products/update") zostanie przekazane do wnętrza danego kontrolera.

    // 1. Podpinamy ProductController pod ścieżkę bazową "/products/*"
    context.mount(new ProductController, "/products/*")
    
    // 2. Podpinamy CategoryController pod ścieżkę bazową "/categories/*"
    context.mount(new CategoryController, "/categories/*")
    
    // 3. Podpinamy CartController pod ścieżkę bazową "/cart/*"
    context.mount(new CartController, "/cart/*")
    
    // Koniec metody init. Po jej wykonaniu serwer jest gotowy do przyjmowania żądań HTTP.
  }
}