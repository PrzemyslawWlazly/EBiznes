package main // Deklaracja głównego pakietu programu startowego

import ( // Początek bloku włączania modułów z zewnątrz
	"zestaw4/database" // Podpięcie modułu inicjującego połączenie z bazą
	"zestaw4/handlers" // Podpięcie modułu z funkcjami kontrolerów dla naszych endpointów
	"zestaw4/models" // Podpięcie modułu z mapowaniem tabel

	"github.com/labstack/echo/v4" // Serce naszego serwera HTTP
	"github.com/labstack/echo/v4/middleware" // Wbudowane w Echo wtyczki ochronne
) // Koniec bloku definiowania importowanych paczek

func main() { // Główna funkcja wywoływana przy starcie aplikacji
	database.ConnectDB() // Nawiązanie i zalogowanie połączenia ze statycznym plikiem bazy sklep.db

	// AutoMigrate teraz obsługuje Produkt, Koszyk oraz Kategorię. GORM uaktualni tabelę products, dodając do niej kolumnę category_id
	database.DB.AutoMigrate(&models.Product{}, &models.Cart{}, &models.Category{}) 

	e := echo.New() // Powołanie do życia nowej, gołej instancji serwera Echo
	e.Use(middleware.Logger()) // Uruchomienie middleware'a logującego każde zapytanie HTTP do konsoli
	e.Use(middleware.Recover()) // Uruchomienie middleware'a zapobiegającego całkowitemu wyłączeniu serwera przy błędach typu panic

	e.POST("/categories", handlers.CreateCategory) // [4.5] Ścieżka przyjmująca POST służąca do rejestrowania nowych kategorii w bazie
	e.GET("/categories", handlers.GetCategories) // [4.5] Ścieżka przyjmująca GET do zwracania listy wszystkich kategorii z zagnieżdżonymi w nich produktami

	e.POST("/products", handlers.CreateProduct) // [3.0] Tworzenie produktu (możesz teraz w JSONie podać "category_id")
	e.GET("/products", handlers.GetProducts) // [3.0] Lista wszystkich dostępnych produktów
	e.GET("/products/:id", handlers.GetProduct) // [3.0] Zwracanie detali konkretnego produktu
	e.PUT("/products/:id", handlers.UpdateProduct) // [3.0] Nadpisywanie własności produktu
	e.DELETE("/products/:id", handlers.DeleteProduct) // [3.0] Trwałe kasowanie z bazy

	e.POST("/carts", handlers.CreateCart) // [4.0] Endpoint budujący w bazie nowy koszyk na zakupy
	e.GET("/carts/:id", handlers.GetCart) // [4.0] Endpoint inspekcji zawartości koszyka o podanym ID
	e.POST("/carts/:cartId/products/:productId", handlers.AddProductToCart) // [4.0] Punkt końcowy wiążący towar z koszykiem klienta

	e.Logger.Fatal(e.Start(":8080")) // Komenda odpalająca serwer sieciowy na 8080 z blokadą głównego wątku
} // Fizyczny koniec kodu wykonywalnego programu
