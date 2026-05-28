package main // Deklarujemy, że ten plik jest głównym programem wykonywalnym, wymaganym w języku Go

import ( // Otwieramy blok służący do zaimportowania zewnętrznych pakietów
    "esy-floresy-backend/handlers" // <--- TUTAJ ZMIANA: używamy nazwy z go.mod
    "log"
    "net/http"

    "github.com/labstack/echo/v4"
    "github.com/labstack/echo/v4/middleware"
    "gorm.io/driver/sqlite"
    "gorm.io/gorm"
)

type Product struct { // Tworzymy nową strukturę danych (odpowiednik obiektu) reprezentującą produkt w sklepie
	ID    int     `json:"id"`    // Pole przechowujące numer identyfikacyjny (int), podczas konwersji na JSON nazwij je "id"
	Name  string  `json:"name"`  // Pole przechowujące tekstową nazwę, w formacie JSON nazwij je "name"
	Price float64 `json:"price"` // Pole przechowujące cenę (liczba zmiennoprzecinkowa), w JSON nazwij je "price"
} // Koniec definicji struktury Product

func productsHandler(c echo.Context) error { // Funkcja obsługująca asortyment, zmodyfikowana pod framework Echo (używa kontekstu)
	hpProducts := []Product{ // Deklarujemy i wypełniamy nową listę (slice w Go) zawierającą nasze przedmioty
		{ID: 1, Name: "Różdżka (Ostrokrzew i pióro feniksa, 11 cali)", Price: 150},      // Pierwszy produkt (bez niepotrzebnych zer ułamkowych)
		{ID: 2, Name: "Najnowszy model miotły: Błyskawica", Price: 1200},                // Drugi produkt (miotła)
		{ID: 3, Name: "Czekoladowa Żaba (zawiera kartę)", Price: 5.5},                   // Trzeci produkt (żaba)
		{ID: 4, Name: "Kociołek cynowy (rozmiar standardowy)", Price: 45},               // Czwarty produkt (kociołek)
		{ID: 5, Name: "Peleryna Niewidka (kolekcja Insygniów Śmierci)", Price: 9999.99}, // Piąty produkt (peleryna)
	} // Zamykamy inicjalizację listy produktów
	
	return c.JSON(http.StatusOK, hpProducts) // Framework Echo automatycznie tworzy JSON, ustawia nagłówki Content-Type i zwraca status 200 OK
} // Koniec funkcji obsługującej asortyment

func paymentsHandler(c echo.Context) error { // Zoptymalizowana funkcja płatności dla frameworka Echo
	return c.JSON(http.StatusOK, map[string]string{"status": "success"}) // Zwracamy błyskawiczny komunikat o sukcesie bez ręcznego formatowania ciągów znaków
} // Koniec funkcji obsługującej płatności

func main() { // Główna funkcja programu, uruchamia się automatycznie jako pierwsza
	e := echo.New() // Tworzymy nową, główną instancję routera Echo, która będzie zarządzać naszym serwerem

// Pancerna konfiguracja CORS
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"http://localhost:3000", "*"}, // Pozwalamy dokładnie na adres Reacta
		AllowMethods: []string{http.MethodGet, http.MethodPost, http.MethodPut, http.MethodDelete, http.MethodOptions},
		AllowHeaders: []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept, echo.HeaderAuthorization},
	}))

	db, err := gorm.Open(sqlite.Open("gringott.db"), &gorm.Config{}) // Inicjujemy połączenie z plikową bazą danych SQLite o nazwie gringott.db (stworzy plik, jeśli nie istnieje)
	if err != nil { // Wyłapujemy błąd na wypadek, gdyby system zablokował zapis na dysku
		log.Fatal("Krytyczny błąd: Nie udało się połączyć z bazą danych Gringotta!") // Funkcja Fatal natychmiastowo zabija serwer z widocznym komunikatem
	} // Zamykamy blok weryfikacji połączenia

	err = db.AutoMigrate(&handlers.User{}) // Uruchamiamy tryb auto-migracji: GORM stworzy tabelę z emailami i hasłami, analizując strukturę w pliku auth.go
	if err != nil { // Upewniamy się, czy tworzenie tabel powiodło się pomyślnie
		log.Fatal("Krytyczny błąd: Nie udało się wygenerować struktury tabel w bazie!") // Zatrzymujemy program w przypadku niepowodzenia sprzętowego
	} // Zamykamy blok weryfikacji migracji

	handlers.SetAuthDB(db) // Wywołujemy funkcję z pliku auth.go, by przekazać mu otwarte z powodzeniem połączenie do bazy danych

	e.GET("/api/products", productsHandler) // Definiujemy nową ścieżkę dla asortymentu (zabezpieczoną wyłącznie dla żądań pobierających GET)
	e.POST("/api/payments", paymentsHandler) // Definiujemy ścieżkę dla wpłat z koszyka (wymagająca żądania POST z danymi)
	e.POST("/api/register", handlers.Register) // Rejestrujemy nowy endpoint rejestracji, delegując pracę do naszego pakietu 'handlers'
	e.POST("/api/login", handlers.Login) // Rejestrujemy nowy endpoint logowania klienta do sklepu



	e.GET("/auth/google/login", handlers.GoogleLogin)
	e.GET("/auth/google/callback", handlers.GoogleCallback)
	e.GET("/auth/github/login", handlers.GithubLogin)
	e.GET("/auth/github/callback", handlers.GithubCallback)
	e.Logger.Fatal(e.Start(":8080")) // Odpalamy nasłuch serwera na głównym porcie 8080 i logujemy ewentualny błąd zderzenia portów (panic)
} // Koniec funkcji głównej, zamykającej całe serce aplikacji backendowej