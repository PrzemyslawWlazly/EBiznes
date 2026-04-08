// Pakiet zawierający kontrolery naszej aplikacji
package controllers
// Import głównej funkcjonalności Scalatra
import org.scalatra._
// Import wsparcia dla formatu JSON w Scalatra
import org.scalatra.json._
// Import konfiguracji domyślnych formatów json4s
import org.json4s.DefaultFormats
// Import modułu CORS ze Scalatry (realizacja Punktu 5)
import org.scalatra.CorsSupport
// Import naszych modeli danych oraz "bazy danych"
import models.{Database, Product}

// Abstrakcyjna klasa bazowa integrująca JSON i CORS (Punkt 5) dla wszystkich kontrolerów
abstract class BaseController extends ScalatraServlet with JacksonJsonSupport with CorsSupport {
  // Zdefiniowanie domyślnych formatów parsowania JSON (wymagane przez json4s)
  protected implicit lazy val jsonFormats: DefaultFormats.type = DefaultFormats
  
  // Zezwolenie na żądania OPTIONS dla wszystkich ścieżek (wymagane dla tzw. pre-flight requests w CORS)
  options("/*") {
    // Zwraca nagłówek pozwalający na akcję z różnych domen dla metod CRUD
    response.setHeader("Access-Control-Allow-Headers", request.getHeader("Access-Control-Request-Headers"))
  }
  
  // Kod wykonywany przed każdym żądaniem
  before() {
    // Ustawienie typu zwracanej zawartości na JSON
    contentType = formats("json")
  }
}

// Kontroler Produktów (Realizacja Punktu 1) dziedziczący konfigurację z BaseController
class ProductController extends BaseController {

  // GET: Pobieranie wszystkich produktów (Punkt 2 - show all)
  get("/") {
    // Zwrócenie całej listy produktów z obiektu Database jako JSON
    Database.products.toList
  }

  // GET: Pobieranie produktu po ID (Punkt 2 - show by id)
  get("/:id") {
    // Pobranie parametru id ze ścieżki (URL) i konwersja do liczby całkowitej (Int)
    val id = params("id").toInt
    // Wyszukanie produktu na liście za pomocą metody find
    Database.products.find(_.id == id) match {
      // Jeśli produkt został znaleziony, zwracamy go
      case Some(product) => product
      // Jeśli produktu nie ma na liście, zwracamy błąd 404 (Not Found)
      case None => halt(404, "Product not found")
    }
  }

  // POST: Dodawanie nowego produktu (Punkt 2 - add)
  post("/") {
    // Sparsowanie ciała żądania JSON na obiekt klasy Product
    val newProduct = parsedBody.extract[Product]
    // Dodanie nowego produktu do mutowalnej listy (Database.products)
    Database.products += newProduct
    // Zwrócenie dodanego produktu jako potwierdzenie
    newProduct
  }

  // PUT: Aktualizacja produktu po ID (Punkt 2 - update)
  put("/:id") {
    // Pobranie i rzutowanie parametru ID ze ścieżki
    val id = params("id").toInt
    // Sparsowanie zaktualizowanych danych produktu z ciała żądania
    val updatedProduct = parsedBody.extract[Product]
    // Znalezienie indeksu produktu, który chcemy zaktualizować (po ID)
    val index = Database.products.indexWhere(_.id == id)
    // Sprawdzenie, czy element został znaleziony w liście (indeks >= 0)
    if (index >= 0) {
      // Zastąpienie starego produktu nowym w zadanym miejscu na liście
      Database.products.update(index, updatedProduct)
      // Zwrócenie zaktualizowanego produktu
      updatedProduct
    } else {
      // Zwrócenie błędu 404, jeśli produktu z takim ID nie było
      halt(404, "Product not found")
    }
  }

  // DELETE: Usuwanie produktu po ID (Punkt 2 - delete)
  delete("/:id") {
    // Odczytanie ID do usunięcia z adresu URL
    val id = params("id").toInt
    // Usunięcie z listy w pamięci wszystkich produktów pasujących do tego ID (powinien być 1)
    Database.products --= Database.products.filter(_.id == id)
    // Zwrócenie komunikatu potwierdzającego usunięcie elementu w formacie JSON
    Map("message" -> s"Product $id deleted")
  }
}
