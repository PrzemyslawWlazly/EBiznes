package models // Deklaracja pakietu 'models' grupującego definicje struktur i logikę zapytań dla bazy danych

import ( // Rozpoczęcie bloku załączania bibliotek
	"gorm.io/gorm" // Import podstawowego pakietu GORM, który udostępnia typ obiektu *gorm.DB wymagany w scope'ach
) // Zamknięcie bloku importów

type Product struct { // Zdefiniowanie struktury Produktu mapującej dane z Go na wiersze w tabeli SQL
	ID         uint    `gorm:"primaryKey" json:"id"` // Klucz główny bazy (uint) i definicja klucza "id" w JSON
	Name       string  `json:"name"` // Tekstowa nazwa produktu zwracana w JSON jako "name"
	Price      float64 `json:"price"` // Zmiennoprzecinkowa cena produktu zwracana jako "price"
	CategoryID uint    `json:"category_id"` // Klucz obcy (Foreign Key) określający przynależność do danej kategorii
} // Koniec bloku struktury

// --- [5.0] DEFINICJE GORM SCOPES ---

func ExpensiveProducts(db *gorm.DB) *gorm.DB { // Scope nr 1: funkcja filtrująca przyjmująca obecny stan zapytania GORM i go modyfikująca
	return db.Where("price > ?", 2000) // Wstrzyknięcie do łańcucha zapytania warunku (WHERE): cena musi być wyższa niż 2000
} // Koniec bloku funkcji filtrującej drogie przedmioty

func CheapProducts(db *gorm.DB) *gorm.DB { // Scope nr 2: analogiczna funkcja filtrująca służąca do znajdowania tańszych alternatyw
	return db.Where("price <= ?", 2000) // Wstrzyknięcie warunku ograniczającego wyniki tylko do tych z ceną mniejszą lub równą 2000
} // Koniec bloku funkcji filtrującej tanie przedmioty
