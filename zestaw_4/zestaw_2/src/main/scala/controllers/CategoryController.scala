// Pakiet zawierający kontrolery
package controllers
// Import modeli z pakietu models
import models.{Database, Category}

// Kontroler Kategorii dziedziczący z BaseController (zawierającego JSON i CORS)
class CategoryController extends BaseController {
  
  // Endpoint GET zwracający listę wszystkich kategorii
  get("/") {
    // Przekształcenie mutowalnej listy na standardową listę w celu wysłania jako JSON
    Database.categories.toList
  }

  // Endpoint GET zwracający konkretną kategorię na podstawie przekazanego ID
  get("/:id") {
    // Wyciągnięcie zmiennej 'id' ze ścieżki requestu i konwersja do typu Int
    val id = params("id").toInt
    // Przeszukanie listy i zwrot elementu lub wysłanie kodu błędu 404
    Database.categories.find(_.id == id).getOrElse(halt(404, "Category not found"))
  }

  // Endpoint POST służący do dodania nowej kategorii na podstawie danych JSON z body
  post("/") {
    // Ekstrakcja obiektu Category z otrzymanego JSON-a
    val newCat = parsedBody.extract[Category]
    // Dopisywanie wyekstrahowanego obiektu do globalnej listy kategorii
    Database.categories += newCat
    // Wysłanie nowo dodanego obiektu z powrotem do klienta jako potwierdzenie
    newCat
  }

  // Endpoint PUT dla modyfikacji instniejącej kategorii o podanym ID
  put("/:id") {
    // Odczyt parametru ID z URL-a
    val id = params("id").toInt
    // Wyciągnięcie nowych danych z JSON-a do obiektu klasy Category
    val updatedCat = parsedBody.extract[Category]
    // Odnalezienie wiersza/indeksu do podmienienia na liście
    val index = Database.categories.indexWhere(_.id == id)
    // Warunkowe wykonanie aktualizacji, jeśli kategoria istnieje
    if (index >= 0) {
      // Wykonanie update'u na konkretnym indeksie listy
      Database.categories.update(index, updatedCat)
      // Odpowiedź z nowym stanem kategorii
      updatedCat
    } else {
      // Przerywanie zapytania statusem 404 w razie braku elementu
      halt(404, "Category not found")
    }
  }

  // Endpoint DELETE służący do kasowania elementu o wskazanym ID
  delete("/:id") {
    // Odczytywanie przypisanego parametru ID
    val id = params("id").toInt
    // Usuwanie elementów pasujących do warunku (gdzie id zgadza się z parametrem)
    Database.categories --= Database.categories.filter(_.id == id)
    // Zwrócenie małego słownika JSON w celu jasnego statusu zwrotnego
    Map("message" -> s"Category $id deleted")
  }
}
