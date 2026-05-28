package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/labstack/echo/v4"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/github"
	"golang.org/x/oauth2/google"
)

// Stały ciąg znaków zabezpieczający przed atakami CSRF
const oauthStateString = "magiczny-sekret-zabezpieczajacy-sesje"

// ----------------------------------------
// KONFIGURACJA GOOGLE
// ----------------------------------------
var googleOauthConfig = &oauth2.Config{
	RedirectURL:  "http://localhost:8080/auth/google/callback", 
	ClientID:     "xxxxx",        // <--- GOOGLE ID
	ClientSecret: "xxxxx",    // <--- GOOGLE SECRET
	Scopes:       []string{"https://www.googleapis.com/auth/userinfo.email"},
	Endpoint:     google.Endpoint,
}

func GoogleLogin(c echo.Context) error {
	url := googleOauthConfig.AuthCodeURL(oauthStateString)
	return c.Redirect(http.StatusTemporaryRedirect, url)
}

func GoogleCallback(c echo.Context) error {
	state := c.QueryParam("state")
	if state != oauthStateString {
		return c.String(http.StatusUnauthorized, "Błędny stan sesji (CSRF)")
	}
	code := c.QueryParam("code")
	token, err := googleOauthConfig.Exchange(context.Background(), code)
	if err != nil {
		return c.String(http.StatusInternalServerError, "Błąd pobierania tokena: "+err.Error())
	}
	response, err := http.Get("https://www.googleapis.com/oauth2/v2/userinfo?access_token=" + token.AccessToken)
	if err != nil {
		return c.String(http.StatusInternalServerError, "Błąd pobierania danych z Google")
	}
	defer response.Body.Close()

	var userInfo struct {
		Email string `json:"email"`
	}
	json.NewDecoder(response.Body).Decode(&userInfo)

	// Zapis do bazy (Punkt 5.0)
	var user User
	if result := db.Where("email = ?", userInfo.Email).First(&user); result.Error != nil {
		user = User{Email: userInfo.Email}
		db.Create(&user)
	}

	redirectURL := fmt.Sprintf("http://localhost:3000/login?oauth_email=%s", userInfo.Email)
	return c.Redirect(http.StatusTemporaryRedirect, redirectURL)
}

// ----------------------------------------
// KONFIGURACJA GITHUB
// ----------------------------------------
var githubOauthConfig = &oauth2.Config{
	RedirectURL:  "http://localhost:8080/auth/github/callback", 
	ClientID:     "xxxxx",        // <--- GITHUB ID
	ClientSecret: "xxxxx",    // <--- GITHUB SECRET
	Scopes:       []string{"user:email"},
	Endpoint:     github.Endpoint,
}

func GithubLogin(c echo.Context) error {
	url := githubOauthConfig.AuthCodeURL(oauthStateString)
	return c.Redirect(http.StatusTemporaryRedirect, url)
}

func GithubCallback(c echo.Context) error {
	state := c.QueryParam("state")
	if state != oauthStateString {
		return c.String(http.StatusUnauthorized, "Błędny stan sesji (CSRF)")
	}
	code := c.QueryParam("code")
	token, err := githubOauthConfig.Exchange(context.Background(), code)
	if err != nil {
		return c.String(http.StatusInternalServerError, "Błąd pobierania tokena: "+err.Error())
	}

	// Odpytywanie GitHuba o adresy e-mail użytkownika
	req, err := http.NewRequest("GET", "https://api.github.com/user/emails", nil)
	if err != nil {
		return c.String(http.StatusInternalServerError, "Błąd tworzenia zapytania")
	}
	req.Header.Set("Authorization", "Bearer "+token.AccessToken)

	client := &http.Client{}
	response, err := client.Do(req)
	if err != nil {
		return c.String(http.StatusInternalServerError, "Błąd pobierania danych z GitHub")
	}
	defer response.Body.Close()

	// GitHub odsyła tablicę maili (bo można mieć ich podpiętych kilka)
	var emails []struct {
		Email   string `json:"email"`
		Primary bool   `json:"primary"`
	}
	json.NewDecoder(response.Body).Decode(&emails)

	// Szukamy głównego adresu e-mail
	var primaryEmail string
	for _, e := range emails {
		if e.Primary {
			primaryEmail = e.Email
			break
		}
	}
	if primaryEmail == "" && len(emails) > 0 {
		primaryEmail = emails[0].Email
	}

	// Zapis do bazy (Punkt 5.0)
	var user User
	if result := db.Where("email = ?", primaryEmail).First(&user); result.Error != nil {
		user = User{Email: primaryEmail}
		db.Create(&user)
	}

	redirectURL := fmt.Sprintf("http://localhost:3000/login?oauth_email=%s", primaryEmail)
	return c.Redirect(http.StatusTemporaryRedirect, redirectURL)
}