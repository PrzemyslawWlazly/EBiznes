module esy-floresy-backend // Definiujemy unikalną nazwę dla głównego modułu naszej aplikacji serwerowej

go 1.25.0 // Określamy wymaganą, minimalną wersję kompilatora języka Go do uruchomienia tego kodu (1.20 to stabilny wybór)

require (
	github.com/labstack/echo/v4 v4.15.2
	golang.org/x/crypto v0.52.0
	golang.org/x/oauth2 v0.36.0
	gorm.io/driver/sqlite v1.6.0
	gorm.io/gorm v1.31.1
)

require (
	cloud.google.com/go/compute/metadata v0.3.0 // indirect
	github.com/jinzhu/inflection v1.0.0 // indirect
	github.com/jinzhu/now v1.1.5 // indirect
	github.com/labstack/gommon v0.5.0 // indirect
	github.com/mattn/go-colorable v0.1.14 // indirect
	github.com/mattn/go-isatty v0.0.22 // indirect
	github.com/mattn/go-sqlite3 v1.14.22 // indirect
	github.com/valyala/bytebufferpool v1.0.0 // indirect
	github.com/valyala/fasttemplate v1.2.2 // indirect
	golang.org/x/net v0.54.0 // indirect
	golang.org/x/sys v0.45.0 // indirect
	golang.org/x/text v0.37.0 // indirect
	golang.org/x/time v0.15.0 // indirect
)
