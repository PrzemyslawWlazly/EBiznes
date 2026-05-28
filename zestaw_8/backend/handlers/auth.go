package handlers

import (
	"net/http"
	"github.com/labstack/echo/v4"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

// User to model naszej tabeli użytkowników w bazie danych SQLite
type User struct {
	ID       uint   `json:"id" gorm:"primaryKey"`
	Email    string `json:"email" gorm:"unique;not null"` // Email musi być unikalny
	Password string `json:"-"`                            // Znak "-" oznacza, że hasło nigdy nie zostanie odesłane w odpowiedzi JSON do przeglądarki!
}

// Globalna zmienna do obsługi bazy danych w tym pliku (zostanie wstrzyknięta z main.go)
var db *gorm.DB

// SetAuthDB pozwala podpiąć bazę danych z głównego pliku aplikacji
func SetAuthDB(database *gorm.DB) {
	db = database
}

// Endpoint do REJESTRACJI (3.5)
func Register(c echo.Context) error {
	// Tworzymy strukturę tymczasową do odbioru danych z formularza Reacta
	var input struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := c.Bind(&input); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Błędne dane wejściowe"})
	}

	// Szyfrujemy hasło algorytmem bcrypt
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Błąd szyfrowania hasła"})
	}

	// Tworzymy nowego użytkownika
	user := User{
		Email:    input.Email,
		Password: string(hashedPassword),
	}

	// Zapisujemy użytkownika do bazy danych
	if result := db.Create(&user); result.Error != nil {
		return c.JSON(http.StatusConflict, map[string]string{"error": "Taki email już istnieje w bazie!"})
	}

	return c.JSON(http.StatusOK, map[string]string{"message": "Rejestracja zakończona sukcesem"})
}

// Endpoint do LOGOWANIA (3.0)
func Login(c echo.Context) error {
	var input struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := c.Bind(&input); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Błędne dane wejściowe"})
	}

	// Szukamy użytkownika w bazie na podstawie adresu email
	var user User
	if result := db.Where("email = ?", input.Email).First(&user); result.Error != nil {
		return c.JSON(http.StatusUnauthorized, map[string]string{"error": "Nieprawidłowy email lub hasło"})
	}

	// Porównujemy hasło wpisane w formularzu z zaszyfrowanym hashem z bazy danych
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password)); err != nil {
		return c.JSON(http.StatusUnauthorized, map[string]string{"error": "Nieprawidłowy email lub hasło"})
	}

	// Na tym etapie później (przy punkcie 5.0) wygenerujemy token sesji/JWT. 
	// Na razie zwracamy po prostu sukces logowania i dane użytkownika.
	return c.JSON(http.StatusOK, map[string]interface{}{
		"message": "Zalogowano pomyślnie!",
		"user_id": user.ID,
		"email":   user.Email,
	})
}
