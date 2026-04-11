// Definicja pakietu, w którym znajdują się modele
package models
// Importowanie kolekcji mutowalnej, abyśmy mogli dodawać/usuwać elementy (CRUD)
import scala.collection.mutable.ListBuffer

// --- DEFINICJE KLAS ---
// Definicja klasy Produktu (wymóg z punktu 1) z polami id, name i price
case class Product(id: Int, name: String, price: Double)
// Definicja klasy Kategorii (wymóg z punktu 3) z polami id i name
case class Category(id: Int, name: String)
// Definicja klasy Koszyka (wymóg z punktu 3) - powiązanie produktu z ilością
case class CartItem(id: Int, productId: Int, quantity: Int)

// --- SYMULACJA BAZY DANYCH W PAMIĘCI ---
// Obiekt przechowujący globalne, mutowalne listy danych dla całej aplikacji
object Database {
  // Inicjalizacja listy produktów z przykładowymi danymi (punkt 2 - dane pobierane z listy)
  var products: ListBuffer[Product] = ListBuffer(Product(1, "Laptop", 3500.0), Product(2, "Myszka", 150.0))
  // Inicjalizacja listy kategorii z przykładowymi danymi (punkt 3)
  var categories: ListBuffer[Category] = ListBuffer(Category(1, "Elektronika"), Category(2, "Akcesoria"))
  // Inicjalizacja listy koszyka z przykładowymi danymi (punkt 3)
  var cart: ListBuffer[CartItem] = ListBuffer(CartItem(1, 1, 1))
}
