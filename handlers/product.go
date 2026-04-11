package handlers // Deklaracja pakietu 'handlers', który przetwarza logikę wejścia-wyjścia zapytań HTTP

import ( // Otwarcie listy importowanych paczek lokalnych i zewnętrznych
	"net/http" // Wbudowany pakiet sieciowy dostarczający m.in. stałe dla kodów odpowiedzi (jak 200 czy 404)
	"strconv" // Wbudowany pakiet do konwersji typów (tu: wyciąganie identyfikatorów cyfrowych ze stringów URL)
	"zestaw4/database" // Nasz pakiet dostarczający żywą instancję połączenia z bazą SQLite pod zmienną DB
	"zestaw4/models" // Nasz pakiet dostarczający struktury bazy (np. Product) oraz nasze nowe GORM Scope'y

	"github.com/labstack/echo/v4" // Framework webowy obsługujący cały ruch i udostępniający kontekst żądania
) // Zakończenie sekcji ładującej zależności

func CreateProduct(c echo.Context) error { // Kontroler obsługujący zapytania POST tworzące nowy obiekt produktu
	p := new(models.Product) // Utworzenie w pamięci RAM pustego, czystego obiektu typu Product
	if err := c.Bind(p); err != nil { // Próba zmapowania body JSON-a na obiekt 'p', od razu połączona ze sprawdzeniem błędów
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request"}) // Zwrot komunikatu 400 jeśli struktura przesłanego JSON-a była nieprawidłowa
	} // Zamknięcie bloku obronnego
	
	database.DB.Create(p) // Przekazanie wypełnionego modelu GORM-owi, który wykonuje trwały zapis w bazie
	return c.JSON(http.StatusCreated, p) // Zwrócenie pozytywnego wyniku 201 i świeżo zapisanego obiektu (z nowym ID)
} // Zamknięcie kontrolera tworzenia

// --- [5.0] ZMODYFIKOWANA FUNKCJA GetProducts ---
func GetProducts(c echo.Context) error { // Kontroler GET zwracający listę produktów, poszerzony teraz o obsługę scope'ów
	var products []models.Product // Zadeklarowanie pustego wektora (listy) przeznaczonego na wyniki z bazy
	
	query := database.DB // Utworzenie lokalnej kopii "wskazówki" do bazy, abyśmy mogli doklejać do niej kolejne instrukcje bez psucia głównego połączenia
	
	filter := c.QueryParam("filter") // Pobranie z adresu URL tzw. Query Parameter o nazwie "filter" (np. /products?filter=wartosc)
	
	if filter == "expensive" { // Warunek sprawdzający, czy użytkownik zażądał produktów drogich
		query = query.Scopes(models.ExpensiveProducts) // Jeśli tak: doklejamy do naszego zapytania GORM Scope stworzony w pliku models!
	} else if filter == "cheap" { // Alternatywny warunek sprawdzający, czy użytkownik szuka okazji
		query = query.Scopes(models.CheapProducts) // Doklejenie Scope'a obcinającego wyniki do tanich towarów
	} // Zamknięcie bloku decyzyjnego IF

	query.Find(&products) // Ostateczna egzekucja ulepionego wyżej zapytania: znalezienie wyników i zrzucenie ich do wektora 'products'
	return c.JSON(http.StatusOK, products) // Wysłanie zebranych danych klientowi w formacie JSON ze statusem 200
} // Zakończenie kontrolera pobierającego listę produktów

func GetProduct(c echo.Context) error { // Funkcja GET namierzająca i wydobywająca jeden konkretny element sklepu
	id, _ := strconv.Atoi(c.Param("id")) // Wydobycie wycinka z adresu URL nazwanego "id" i przerobienie go z napisu na liczbę całkowitą
	
	var p models.Product // Pusty kontener na wyciągany zaraz rekord
	result := database.DB.First(&p, id) // GORM szuka pierwszego pasującego klucza i zgłasza wynik całej operacji do zmiennej result
	
	if result.Error != nil { // Bezpiecznik sprawdzający, czy baza nie wyrzuciła błędu braku danych (rekord nie istnieje)
		return c.JSON(http.StatusNotFound, map[string]string{"message": "Product not found"}) // Zwrócenie kulturalnego błędu 404 w przypadku braku produktu
	} // Zamknięcie warunku
	
	return c.JSON(http.StatusOK, p) // Sukces! Oddajemy przeglądarce pełny odczyt przedmiotu
} // Zamknięcie handlera dla pojedynczego asortymentu

func UpdateProduct(c echo.Context) error { // Funkcja dla zapytań PUT nadpisująca właściwości towaru
	id, _ := strconv.Atoi(c.Param("id")) // Identyfikacja ID obiektu, w który wycelował klient sieciowy
	
	var p models.Product // Przygotowanie zmiennej do wczytania starego stanu
	if err := database.DB.First(&p, id).Error; err != nil { // Próba znalezienia ofiary do aktualizacji - if chroni przed modyfikacją ducha
		return c.JSON(http.StatusNotFound, map[string]string{"message": "Product not found"}) // Produkt zniknął lub nie istniał - błąd 404
	} // Koniec bloku sprawdzającego

	if err := c.Bind(&p); err != nil { // Sprytny zabieg Echo: nowo nadesłany JSON samoczynnie nadpisuje pola we wczytanym przed momentem obiekcie
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request"}) // Zły format to błąd 400
	} // Koniec walidacji JSON-a

	database.DB.Save(&p) // GORM widzi, że obiekt ma ID, więc zamiast wstawiać nowy (INSERT), użyje polecenia aktualizacji wiersza (UPDATE)
	return c.JSON(http.StatusOK, p) // Zwrócenie stanu produktu po udanym procesie edycji
} // Domknięcie funkcji modyfikującej

func DeleteProduct(c echo.Context) error { // Funkcja DELETE realizująca bezpowrotne wymazanie danych z nośnika
	id, _ := strconv.Atoi(c.Param("id")) // Wciągnięcie z routing'u zadeklarowanego do śmierci numerycznego identyfikatora
	
	result := database.DB.Delete(&models.Product{}, id) // Egzekucja w GORM - generuje zapytanie DELETE FROM products WHERE id=?
	
	if result.RowsAffected == 0 { // Weryfikacja czy zapytanie usunęło cokolwiek (czy rekord wcześniej fizycznie tam był)
		return c.JSON(http.StatusNotFound, map[string]string{"message": "Product not found"}) // Odpowiedź 404 - nie ma tu nic takiego do skasowania
	} // Koniec bloku kontrolującego rezultat kasowania
	
	return c.NoContent(http.StatusNoContent) // Zwrócenie wymownej ciszy: statusu 204 oznaczającego udane wykonanie rozkazu bez potrzeby odsyłania ciała
} // Ostatnia linia handlera niszczącego zasoby
