package database // Deklaracja pakietu 'database', odpowiedzialnego za konfigurację połączenia z bazą danych

import ( // Rozpoczęcie bloku importów pakietów standardowych i zewnętrznych
	"log" // Import wbudowanego pakietu 'log' do logowania błędów i informacji do konsoli

	"gorm.io/driver/sqlite" // Import dedykowanego sterownika GORM do natywnej obsługi bazy SQLite
	"gorm.io/gorm" // Import głównego pakietu ORM - biblioteki GORM
) // Zakończenie bloku importów

var DB *gorm.DB // Zadeklarowanie globalnej zmiennej 'DB' jako wskaźnika na strukturę gorm.DB, która przechowa aktywną sesję bazy

func ConnectDB() { // Zdefiniowanie funkcji 'ConnectDB', która zainicjalizuje fizyczne połączenie z plikiem bazy SQLite
	var err error // Deklaracja lokalnej zmiennej 'err' typu error do przechwytywania ewentualnych błędów z GORM
	// Otwarcie połączenia do pliku "sklep.db" (zostanie utworzony, jeśli nie istnieje) z domyślną konfiguracją i przypisanie do globalnej zmiennej DB
	DB, err = gorm.Open(sqlite.Open("sklep.db"), &gorm.Config{}) 
	if err != nil { // Sprawdzenie, czy podczas próby połączenia (lub tworzenia pliku) wystąpił jakikolwiek błąd
		log.Fatal("Nie udało się połączyć z bazą danych:\n", err) // Jeśli jest błąd, wypisujemy go i bezwarunkowo zatrzymujemy działanie aplikacji za pomocą Fatal()
	} // Zakończenie bloku warunkowego if (obsługi błędu)
	
	log.Println("Pomyślnie połączono z bazą SQLite!") // Wypisanie informacji w konsoli o udanym i prawidłowym nawiązaniu połączenia z bazą danych
} // Zakończenie bloku funkcji ConnectDB
