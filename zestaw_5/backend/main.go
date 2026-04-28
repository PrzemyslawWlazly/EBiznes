package main // Deklarujemy, że ten plik jest głównym programem wykonywalnym, wymaganym w języku Go

import ( // Otwieramy blok służący do zaimportowania zewnętrznych pakietów
	"encoding/json" // Importujemy pakiet do serializacji struktur Go na format JSON i odwrotnie
	"fmt" // Importujemy pakiet do operacji wejścia/wyjścia, użyjemy go do logowania w konsoli
	"net/http" // Importujemy pakiet zapewniający funkcjonalności klienta i serwera HTTP
) // Zamykamy blok importów

type Product struct { // Tworzymy nową strukturę danych (odpowiednik obiektu) reprezentującą produkt
	ID    int     `json:"id"` // Pole przechowujące numer identyfikacyjny (int), podczas konwersji na JSON nazwij je "id"
	Name  string  `json:"name"` // Pole przechowujące tekstową nazwę, w formacie JSON nazwij je "name"
	Price float64 `json:"price"` // Pole przechowujące cenę (liczba zmiennoprzecinkowa), w JSON nazwij je "price"
} // Koniec definicji struktury Product

func enableCORS(w http.ResponseWriter) { // Definiujemy funkcję dodającą nagłówki CORS, aby frontend i backend na innych portach mogły ze sobą "rozmawiać"
	w.Header().Set("Access-Control-Allow-Origin", "*") // Pozwalamy każdemu źródłu (np. naszemu frontendowi na porcie 3000) na dostęp do serwera
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS") // Określamy dozwolone metody zapytań HTTP
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type") // Zezwalamy na przesyłanie niestandardowych nagłówków określających typ zawartości
} // Koniec funkcji pomocniczej enableCORS

func productsHandler(w http.ResponseWriter, r *http.Request) { // Funkcja obsługująca żądania skierowane pod adres /api/products
	enableCORS(w) // Wywołujemy naszą funkcję pomocniczą, by dołączyć nagłówki CORS do odpowiedzi
	
	if r.Method == "OPTIONS" { // Sprawdzamy, czy to zapytanie typu OPTIONS (przeglądarka wysyła je przed głównym żądaniem, by upewnić się o bezpieczeństwie)
		w.WriteHeader(http.StatusOK) // Jeśli tak, odpowiadamy kodem 200 OK
		return // Przerywamy dalsze wykonywanie funkcji dla zapytania OPTIONS
	} // Koniec bloku obsługi metody OPTIONS

	hpProducts := []Product{ // Deklarujemy i wypełniamy nową listę (slice w Go) zawierającą nasze magiczne przedmioty
		{ID: 1, Name: "Różdżka (Ostrokrzew i pióro feniksa, 11 cali)", Price: 150.00}, // Pierwszy produkt z atrybutami
		{ID: 2, Name: "Najnowszy model miotły: Błyskawica", Price: 1200.00}, // Drugi produkt (miotła)
		{ID: 3, Name: "Czekoladowa Żaba (zawiera kartę)", Price: 5.50}, // Trzeci produkt (żaba)
		{ID: 4, Name: "Kociołek cynowy (rozmiar standardowy)", Price: 45.00}, // Czwarty produkt (kociołek)
		{ID: 5, Name: "Peleryna Niewidka (kolekcja Insygniów Śmierci)", Price: 9999.99}, // Piąty produkt (peleryna)
	} // Zamykamy inicjalizację listy produktów

	w.Header().Set("Content-Type", "application/json") // Informujemy przeglądarkę, że w ciele odpowiedzi znajdą się dane w formacie JSON
	json.NewEncoder(w).Encode(hpProducts) // Konwertujemy naszą listę struktur 'hpProducts' na JSON i wpisujemy bezpośrednio do strumienia odpowiedzi (w)
} // Koniec funkcji obsługującej asortyment

func paymentsHandler(w http.ResponseWriter, r *http.Request) { // Funkcja obsługująca zapytania płatności pod adresem /api/payments
	enableCORS(w) // Doklejamy nagłówki CORS zwalniające blokady w przeglądarce

	if r.Method == "OPTIONS" { // Obsługa zapytania wstępnego OPTIONS, tak samo jak wyżej
		w.WriteHeader(http.StatusOK) // Zwracamy pozytywny status HTTP
		return // Wychodzimy z funkcji
	} // Koniec bloku OPTIONS

	if r.Method == "POST" { // Upewniamy się, że użytkownik faktycznie próbuje nam coś wysłać metodą POST
		w.WriteHeader(http.StatusOK) // Akceptujemy płatność i nadajemy odpowiedzi status 200 OK
		fmt.Fprintf(w, `{"status":"success"}`) // Zwracamy prosty JSON z informacją o powodzeniu operacji
	} else { // W przypadku gdyby ktoś wszedł na ten adres np. zwykłą przeglądarką (metoda GET)
		http.Error(w, "Metoda niedozwolona", http.StatusMethodNotAllowed) // Zwracamy błąd 405 Method Not Allowed
	} // Koniec instrukcji warunkowej dla metody POST
} // Koniec funkcji obsługującej płatności

func main() { // Główna funkcja programu, uruchamia się automatycznie jako pierwsza
	http.HandleFunc("/api/products", productsHandler) // Rejestrujemy funkcję 'productsHandler' dla trasy URL '/api/products'
	http.HandleFunc("/api/payments", paymentsHandler) // Rejestrujemy funkcję 'paymentsHandler' dla trasy URL '/api/payments'

	fmt.Println("Gringott otwarty: Serwer Go uruchomiony na porcie 8080...") // Wypisujemy w konsoli serwera informację o starcie, dla upewnienia się, że działa
	http.ListenAndServe(":8080", nil) // Uruchamiamy serwer nasłuchujący ciągle na porcie 8080, funkcja ta blokuje działanie programu i nie pozwala mu się wyłączyć
} // Koniec funkcji głównej