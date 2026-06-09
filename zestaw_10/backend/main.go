package main // Deklarujemy główny pakiet programu uruchamianego jako aplikacja serwerowa Go.

import ( // Otwieramy blok importów standardowej biblioteki Go.
	"encoding/json" // Importujemy obsługę kodowania i dekodowania danych JSON.
	"fmt"           // Importujemy funkcje do prostego wypisywania informacji w konsoli i odpowiedzi HTTP.
	"log"           // Importujemy logger, aby czytelnie zgłaszać błąd startu serwera.
	"net/http"      // Importujemy pakiet HTTP potrzebny do stworzenia backendu.
	"os"            // Importujemy obsługę zmiennych środowiskowych, aby odczytać port przydzielony przez chmurę.
) // Zamykamy blok importów.

type Product struct { // Definiujemy strukturę produktu zwracanego przez endpoint /api/products.
	ID    int     `json:"id"`    // Przechowujemy identyfikator produktu i mapujemy go na pole JSON "id".
	Name  string  `json:"name"`  // Przechowujemy nazwę produktu i mapujemy ją na pole JSON "name".
	Price float64 `json:"price"` // Przechowujemy cenę produktu i mapujemy ją na pole JSON "price".
} // Kończymy definicję struktury Product.

type PaymentItem struct { // Definiujemy strukturę pojedynczej pozycji przesyłanej w płatności.
	ID    int     `json:"id"`    // Przechowujemy identyfikator produktu z koszyka.
	Name  string  `json:"name"`  // Przechowujemy nazwę produktu z koszyka.
	Price float64 `json:"price"` // Przechowujemy cenę produktu z koszyka.
} // Kończymy definicję struktury PaymentItem.

type PaymentRequest struct { // Definiujemy strukturę żądania płatności przyjmowanego z frontendu.
	Amount float64       `json:"amount"` // Przechowujemy kwotę płatności wysłaną przez komponent Płatności.
	Items  []PaymentItem `json:"items"`  // Przechowujemy listę produktów opłacanych w ramach koszyka.
} // Kończymy definicję struktury PaymentRequest.

type PaymentResponse struct { // Definiujemy strukturę odpowiedzi zwracanej po poprawnej płatności.
	Status string  `json:"status"` // Przechowujemy status operacji, np. "success".
	Amount float64 `json:"amount"` // Odsyłamy zaakceptowaną kwotę, aby frontend dostał potwierdzenie danych.
} // Kończymy definicję struktury PaymentResponse.

func enableCORS(w http.ResponseWriter) { // Definiujemy funkcję ustawiającą nagłówki CORS dla komunikacji frontend-backend.
	w.Header().Set("Access-Control-Allow-Origin", "*")                   // Pozwalamy frontendowi z innego portu korzystać z API backendu.
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS") // Zezwalamy na metody potrzebne produktom, płatnościom i preflight CORS.
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")       // Zezwalamy na nagłówek Content-Type wymagany przy wysyłaniu JSON.
} // Kończymy funkcję konfigurującą CORS.

func writeJSON(w http.ResponseWriter, statusCode int, payload any) { // Definiujemy pomocniczą funkcję do spójnego zwracania JSON.
	w.Header().Set("Content-Type", "application/json") // Ustawiamy typ odpowiedzi na JSON.
	w.WriteHeader(statusCode)                          // Ustawiamy kod HTTP odpowiedzi przed zapisaniem treści.
	json.NewEncoder(w).Encode(payload)                 // Kodujemy przekazaną strukturę jako JSON i wysyłamy ją do klienta.
} // Kończymy funkcję writeJSON.

func productsHandler(w http.ResponseWriter, r *http.Request) { // Definiujemy handler obsługujący endpoint produktów.
	enableCORS(w) // Dodajemy nagłówki CORS do każdej odpowiedzi tego endpointu.

	if r.Method == http.MethodOptions { // Obsługujemy zapytanie preflight wysyłane przez przeglądarkę.
		w.WriteHeader(http.StatusOK) // Zwracamy status OK bez treści, bo to tylko kontrola CORS.
		return                       // Kończymy obsługę zapytania OPTIONS.
	} // Zamykamy warunek dla metody OPTIONS.

	if r.Method != http.MethodGet { // Sprawdzamy, czy klient użył poprawnej metody GET.
		http.Error(w, "Metoda niedozwolona", http.StatusMethodNotAllowed) // Zwracamy błąd 405 dla niepoprawnej metody.
		return                                                            // Kończymy obsługę żądania po błędzie metody.
	} // Zamykamy walidację metody HTTP.

	products := []Product{ // Tworzymy listę produktów zwracaną przez aplikację serwerową.
		{ID: 1, Name: "Różdżka treningowa", Price: 150.00},            // Dodajemy pierwszy produkt z identyfikatorem, nazwą i ceną.
		{ID: 2, Name: "Miotła sportowa", Price: 1200.00},              // Dodajemy drugi produkt z identyfikatorem, nazwą i ceną.
		{ID: 3, Name: "Czekoladowa żaba kolekcjonerska", Price: 5.50}, // Dodajemy trzeci produkt z identyfikatorem, nazwą i ceną.
		{ID: 4, Name: "Kociołek cynowy standardowy", Price: 45.00},    // Dodajemy czwarty produkt z identyfikatorem, nazwą i ceną.
		{ID: 5, Name: "Peleryna pokazowa", Price: 999.99},             // Dodajemy piąty produkt z identyfikatorem, nazwą i ceną.
	} // Kończymy deklarację listy produktów.

	writeJSON(w, http.StatusOK, products) // Zwracamy produkty jako prawdziwą odpowiedź JSON z backendu.
} // Kończymy handler produktów.

func paymentsHandler(w http.ResponseWriter, r *http.Request) { // Definiujemy handler obsługujący endpoint płatności.
	enableCORS(w) // Dodajemy nagłówki CORS do każdej odpowiedzi tego endpointu.

	if r.Method == http.MethodOptions { // Obsługujemy zapytanie preflight wymagane przez CORS.
		w.WriteHeader(http.StatusOK) // Zwracamy status OK dla kontroli CORS.
		return                       // Kończymy obsługę zapytania OPTIONS.
	} // Zamykamy warunek dla OPTIONS.

	if r.Method != http.MethodPost { // Sprawdzamy, czy płatność została wysłana metodą POST.
		http.Error(w, "Metoda niedozwolona", http.StatusMethodNotAllowed) // Zwracamy błąd 405 dla metod innych niż POST.
		return                                                            // Kończymy obsługę niepoprawnego żądania.
	} // Zamykamy walidację metody POST.

	var payment PaymentRequest // Tworzymy zmienną, do której zdekodujemy JSON wysłany przez frontend.

	if err := json.NewDecoder(r.Body).Decode(&payment); err != nil { // Próbujemy odczytać ciało żądania jako strukturę PaymentRequest.
		http.Error(w, "Niepoprawny JSON płatności", http.StatusBadRequest) // Zwracamy błąd 400, gdy frontend wyśle niepoprawny JSON.
		return                                                             // Kończymy obsługę błędnego żądania.
	} // Zamykamy obsługę błędu dekodowania JSON.

	if payment.Amount <= 0 { // Sprawdzamy, czy kwota płatności jest dodatnia.
		http.Error(w, "Kwota płatności musi być większa od zera", http.StatusBadRequest) // Zwracamy błąd walidacji dla zerowej lub ujemnej kwoty.
		return                                                                           // Kończymy obsługę niepoprawnej płatności.
	} // Zamykamy walidację kwoty.

	fmt.Printf("Przyjęto płatność: %.2f PLN, liczba pozycji: %d\n", payment.Amount, len(payment.Items)) // Logujemy odebraną płatność po stronie serwera.

	response := PaymentResponse{Status: "success", Amount: payment.Amount} // Budujemy odpowiedź potwierdzającą przyjęcie płatności.
	writeJSON(w, http.StatusOK, response)                                  // Wysyłamy potwierdzenie płatności jako JSON.
} // Kończymy handler płatności.

func main() { // Definiujemy funkcję startową aplikacji serwerowej.
	http.HandleFunc("/api/products", productsHandler) // Rejestrujemy endpoint zwracający listę produktów.
	http.HandleFunc("/api/payments", paymentsHandler) // Rejestrujemy endpoint przyjmujący dane płatności.

	port := os.Getenv("PORT") // Pobieramy port przekazany przez platformę chmurową.
	if port == "" { // Sprawdzamy, czy aplikacja została uruchomiona bez zmiennej PORT, np. lokalnie.
		port = "8080" // Używamy lokalnego portu 8080 jako wartości domyślnej.
	} // Kończymy wybór portu.

	fmt.Printf("Serwer Go działa na porcie %s\n", port) // Wypisujemy port, na którym backend rozpoczął nasłuchiwanie.
	log.Fatal(http.ListenAndServe(":"+port, nil))       // Nasłuchujemy na wszystkich interfejsach na porcie lokalnym lub przydzielonym przez chmurę.
} // Kończymy funkcję main.
