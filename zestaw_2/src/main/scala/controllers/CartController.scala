// Wskazanie pakietu
package controllers
// Zaimportowanie klas modeli
import models.{Database, CartItem}

// Tworzenie klasy CartController odpowiedzialnej za koszyk klienta
class CartController extends BaseController {

  // Zwracanie całej zawartości koszyka dla metody GET pod ścieżką /
  get("/") {
    // Wyprowadzenie danych z pamięci
    Database.cart.toList
  }

  // Odbieranie pojedynczego wpisu w koszyku na podstawie jego ID
  get("/:id") {
    // Przekształcenie ciągu znaków 'id' na zmienną Int
    val id = params("id").toInt
    // Zwracanie wyciągniętego elementu albo zwrócenie HTTP 404 - Not Found
    Database.cart.find(_.id == id).getOrElse(halt(404, "Item not found"))
  }

  // Akceptowanie POST z JSON zawierającym id, productId oraz quantity
  post("/") {
    // Wyciąganie wartości klasy CartItem
    val newItem = parsedBody.extract[CartItem]
    // Dopisanie wiersza do listy imitującej tablicę bazy danych
    Database.cart += newItem
    // Odsyłanie zrzuconego jako JSON obiektu
    newItem
  }

  // Nadpisywanie stanu elementu w koszyku w metodzie PUT (np. zmiana ilości)
  put("/:id") {
    // Zczytywanie i formatowanie parametru URL
    val id = params("id").toInt
    // Deserializacja danych z treści HTTP
    val updatedItem = parsedBody.extract[CartItem]
    // Uzyskanie numerycznego indeksu w kolekcji ListBuffer
    val index = Database.cart.indexWhere(_.id == id)
    // Logika aktualizacji jeśli produkt był dodany
    if (index >= 0) {
      // Edycja elementu znajdującego się w miejscu 'index' na liście
      Database.cart.update(index, updatedItem)
      // Zwrot obiektu
      updatedItem
    } else {
      // Odpowiedź błędu, jeśli nie nadpisujemy instniejącego id
      halt(404, "Item not found")
    }
  }

  // Czyszczenie / usuwanie konkretnego wiersza z koszyka metodą DELETE
  delete("/:id") {
    // Przypisanie przekazanego ID do zmiennej numerycznej
    val id = params("id").toInt
    // Odfiltrowanie i przypisanie nowych wartości do tablicy koszyka
    Database.cart --= Database.cart.filter(_.id == id)
    // Zwrot tekstu jako mapa (co po stronie parsera json staje się prawidłowym JSON objectem)
    Map("message" -> s"Cart item $id deleted")
  }
}
