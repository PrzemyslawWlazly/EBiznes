// Główny blok grupujący nasze testy API dla sklepu
describe('Magiczny Sklep - Testy API', () => {

  // Podgrupa testów dla pierwszego endpointu pobierającego towary
  context('Endpoint: GET /api/products', () => {
    
    // Test pozytywny sprawdzający czy serwer Go w ogóle żyje
    it('Scenariusz Pozytywny: Powinien zwrócić listę produktów i status 200 OK', () => {
      // Wykonujemy żądanie HTTP typu GET
      cy.request('GET', 'http://localhost:8080/api/products').then((response) => {
        // Upewniamy się, że status odpowiedzi to 200
        expect(response.status).to.eq(200); 
        // Weryfikujemy nagłówek JSON
        expect(response.headers['content-type']).to.include('application/json'); 
        
        // Sprawdzamy czy ciało odpowiedzi jest tablicą i czy nie jest puste
        expect(response.body).to.be.an('array');
        expect(response.body.length).to.be.greaterThan(0);
        
        // Sprawdzamy czy pierwszy produkt ma wszystkie wymagane pola z bazy danych
        expect(response.body[0]).to.have.property('id');
        expect(response.body[0]).to.have.property('name');
        expect(response.body[0]).to.have.property('price');
      });
    });

    // Test negatywny sprawdzający poprawną obsługę błędów przez serwer Go
    it('Scenariusz Negatywny: Powinien zwrócić błąd 404 dla nieistniejącego zasobu/ścieżki', () => {
      // Wysyłamy żądanie na zmyślony adres
      cy.request({
        method: 'GET',
        url: 'http://localhost:8080/api/products/999',
        // Wyłączamy automatyczne przerywanie testu przez Cypressa w przypadku błędów 4xx
        failOnStatusCode: false 
      }).then((response) => {
        // Oczekujemy, że serwer poprawnie wyłapie zły adres i rzuci statusem 404
        expect(response.status).to.eq(404); 
      });
    });
  });

  // Podgrupa testów dla drugiego endpointu obsługującego wpłaty do Gringotta
  context('Endpoint: POST /api/payments', () => {
    
    // Test pozytywny symulujący poprawną wysyłkę formularza
    it('Scenariusz Pozytywny: Powinien zaakceptować płatność i zwrócić status 200 OK', () => {
      // Budujemy żądanie typu POST
      cy.request({
        method: 'POST',
        url: 'http://localhost:8080/api/payments',
        // Przekazujemy ciało zapytania w formacie JSON
        body: {
          // POPRAWKA DLA SONARCLOUD: Zmieniamy z 150.50 na 150.5 (usunięto zerowy ułamek)
          amount: 150.5 
        }
      }).then((response) => {
        // Sprawdzamy poprawność kodu statusu
        expect(response.status).to.eq(200);
        // Oczekujemy, że serwer Go zwróci komunikat o sukcesie
        expect(response.body).to.include('success'); 
      });
    });

    // Test negatywny sprawdzający routing serwera Go
    it('Scenariusz Negatywny: Powinien odrzucić błędną metodę (GET) i zwrócić błąd 405', () => {
      // Próbujemy wejść na adres POST za pomocą metody GET
      cy.request({
        method: 'GET',
        url: 'http://localhost:8080/api/payments',
        failOnStatusCode: false 
      }).then((response) => {
        // Oczekujemy, że router Echo wyłapie błąd i rzuci statusem 405 Method Not Allowed
        expect(response.status).to.eq(405); 
        // Weryfikujemy treść błędu
        expect(response.body).to.include('Metoda niedozwolona'); 
      });
    });
  });

});