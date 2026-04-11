package handlers // Deklaracja pakietu 'handlers', który przetwarza żądania HTTP od klientów

import ( // Rozpoczęcie sekcji importów
	"net/http" // Wbudowany pakiet HTTP używany do dostępu do stałych kodów statusów
	"zestaw4/database" // Nasz lokalny pakiet udostępniający aktywne połączenie z bazą danych (zmienna DB)
	"zestaw4/models" // Nasz lokalny pakiet zawierający struktury Category i Product

	"github.com/labstack/echo/v4" // Zewnętrzny framework Echo obsługujący zapytania sieciowe
) // Zamknięcie sekcji importów

func CreateCategory(c echo.Context) error { // Funkcja przypisana pod POST, służąca do dodawania nowej kategorii do systemu
	category := new(models.Category) // Alokacja pamięci dla nowej, pustej instrukcji Kategorii
	if err := c.Bind(category); err != nil { // Próba wczytania przysłanego przez użytkownika JSON-a bezpośrednio do zmiennej category
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request"}) // Zwrócenie błędu 400 jeśli JSON z nazwą kategorii był niepoprawny
	} // Koniec bloku sprawdzającego błędy w requeście

	database.DB.Create(category) // GORM generuje i wykonuje polecenie INSERT INTO categories zapisując nową kategorię na dysku
	return c.JSON(http.StatusCreated, category) // Zwrócenie do klienta statusu 201 (Created) oraz potwierdzenia w postaci utworzonego obiektu
} // Zamknięcie procedury tworzenia kategorii

func GetCategories(c echo.Context) error { // Funkcja podłączana pod GET, zwracająca wszystkie kategorie wraz z ich zawartością
	var categories []models.Category // Zadeklarowanie pustego wektora (slice'a), do którego pobierzemy dane z bazy
	
	// GORM wykonuje SELECT na kategoriach, a dzięki funkcji .Preload("Products") automatycznie dociąga wszystkie produkty przypisane do każdej z nich
	database.DB.Preload("Products").Find(&categories) 
	
	return c.JSON(http.StatusOK, categories) // Odpowiedź statusem 200 OK i wylistowanie pełnego drzewa kategorii w formacie JSON
} // Zakończenie funkcji pobierającej kategorie
