package handlers // Deklaracja pakietu 'handlers', grupującego logikę obsługi poszczególnych endpointów API

import ( // Rozpoczęcie bloku importowania wymaganych pakietów z zewnątrz i wewnątrz projektu
	"net/http" // Załączenie wbudowanego pakietu sieciowego, aby mieć dostęp do stałych statusów HTTP (np. http.StatusOK)
	"strconv" // Załączenie wbudowanego pakietu do konwersji danych, wykorzystywanego tu do zmiany stringów z parametrów URL na int
	"zestaw4/database" // Import naszego własnego pakietu odpowiedzialnego za instancję połączenia z bazą SQLite
	"zestaw4/models" // Import naszego własnego pakietu modeli, aby wiedzieć jak zbudowany jest Koszyk i Produkt

	"github.com/labstack/echo/v4" // Import głównego silnika frameworka Echo do obsługi interfejsu HTTP i routingu
) // Koniec bloku importów

func CreateCart(c echo.Context) error { // Definicja funkcji 'CreateCart', przypinanej do endpointu POST, służącej do wygenerowania nowego, pustego koszyka
	cart := new(models.Cart) // Zaalokowanie w pamięci miejsca na zupełnie nowy, czysty obiekt struktury Cart
	database.DB.Create(cart) // Przekazanie tego obiektu do silnika GORM, który wykonuje zapytanie INSERT, zapisując go w bazie i nadając mu unikalne ID
	return c.JSON(http.StatusCreated, cart) // Zwrócenie klientowi powiadomienia o sukcesie (kod 201) wraz z ładunkiem zawierającym ID nowego koszyka
} // Zamknięcie bloku funkcji generującej koszyk

func GetCart(c echo.Context) error { // Definicja funkcji 'GetCart' do sprawdzania zawartości konkretnego koszyka (endpoint GET)
	id, _ := strconv.Atoi(c.Param("id")) // Wyciągnięcie z podanego adresu URL identyfikatora koszyka i zamiana tego ciągu znaków na typ liczbowy
	
	var cart models.Cart // Utworzenie pojedynczej, pustej zmiennej typu Cart, która posłuży jako kontener na to, co wyciągniemy z bazy
	if err := database.DB.Preload("Products").First(&cart, id).Error; err != nil { // GORM wyszukuje koszyk po ID (.First), a dzięki .Preload("Products") automatycznie dociąga też z bazy pełne dane wszystkich produktów będących w tym koszyku
		return c.JSON(http.StatusNotFound, map[string]string{"message": "Cart not found"}) // Zabezpieczenie: jeśli GORM zgłosi błąd (np. takiego ID koszyka nie ma), aplikacja odpowiada błędem 404
	} // Koniec bloku if sprawdzającego czy w ogóle znaleziono koszyk
	
	return c.JSON(http.StatusOK, cart) // Jeżeli wszystko przeszło pomyślnie, odpowiadamy do przeglądarki statusem 200, wypluwając zawartość koszyka (wraz z wylistowanymi produktami w środku)
} // Zakończenie bloku funkcji odczytującej koszyk

func AddProductToCart(c echo.Context) error { // Definicja kontrolera 'AddProductToCart', który sklei ze sobą już istniejący koszyk i istniejący produkt
	cartID, _ := strconv.Atoi(c.Param("cartId")) // Wyssanie z adresu internetowego pierwszego parametru określającego identyfikator koszyka
	productID, _ := strconv.Atoi(c.Param("productId")) // Wyssanie z adresu internetowego drugiego parametru określającego identyfikator produktu, który chcemy dodać
	
	var cart models.Cart // Powołanie do życia pustego obiektu pod koszyk
	if err := database.DB.First(&cart, cartID).Error; err != nil { // Próba namierzenia w bazie danych rekordu koszyka na podstawie wczytanego numeru
		return c.JSON(http.StatusNotFound, map[string]string{"message": "Cart not found"}) // Odpowiedź błędem 404 Not Found, jeżeli klient podał fałszywy lub stary numer koszyka
	} // Koniec procedury weryfikującej istnienie koszyka
	
	var product models.Product // Powołanie do życia pustego obiektu reprezentującego pojedynczy produkt
	if err := database.DB.First(&product, productID).Error; err != nil { // Próba wyszukania w bazie fizycznego wiersza produktu, który chcemy dorzucić do koszyka
		return c.JSON(http.StatusNotFound, map[string]string{"message": "Product not found"}) // Odepchnięcie żądania błędem 404, jeśli żądanego asortymentu w ogóle nie ma w sklepie
	} // Koniec sprawdzania czy produkt istnieje

	database.DB.Model(&cart).Association("Products").Append(&product) // Kluczowy moment: używamy mechanizmu asocjacji GORM, nakazując bazie przypiąć (Append) pobrany produkt do sekcji "Products" pobranego koszyka
	
	return c.JSON(http.StatusOK, map[string]string{"message": "Product added to cart"}) // Pomyślne spięcie danych – odsyłamy informacyjną paczkę JSON z komunikatem zwrotnym o sukcesie i statusem 200
} // Koniec operacji integrowania przedmiotów do list zakupowych
