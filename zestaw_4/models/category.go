package models // Deklaracja pakietu 'models' przechowującego schematy tabel dla naszej bazy danych

type Category struct { // Zdefiniowanie nowej struktury 'Category', z której GORM zbuduje tabelę kategorii
	ID       uint      `gorm:"primaryKey" json:"id"` // Klucz główny w bazie danych (uint) oraz mapowanie na pole "id" w formacie JSON
	Name     string    `json:"name"` // Pole przechowujące nazwę kategorii w formie tekstowej
	Products []Product `json:"products"` // Relacja Jeden-do-Wielu: GORM wie, że kategoria ma listę (slice) wielu przypisanych Produktów
} // Zakończenie definicji struktury kategorii
