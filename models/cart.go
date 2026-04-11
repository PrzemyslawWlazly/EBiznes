package models // Deklaracja pakietu 'models', który grupuje wszystkie schematy bazy danych naszej aplikacji

type Cart struct { // Zdefiniowanie nowej struktury o nazwie 'Cart', która będzie reprezentować koszyk klienta w systemie
	ID       uint      `gorm:"primaryKey" json:"id"` // Unikalny identyfikator koszyka (typu uint), oznaczony jako klucz główny (primaryKey) dla bazy oraz "id" dla JSON
	Products []Product `gorm:"many2many:cart_products;" json:"products"` // Relacja wiele-do-wielu z modelem Product; GORM w tle sam stworzy tabelę łączącą 'cart_products'
} // Zamknięcie deklaracji struktury koszyka
