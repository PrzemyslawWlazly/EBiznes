// Plik: frontend/cypress/e2e/api.cy.js

describe('Magiczny Sklep - Testy API', () => {

  // ==========================================
  // ENDPOINT 1: /api/products
  // ==========================================
  context('Endpoint: GET /api/products', () => {
    
    it('Scenariusz Pozytywny: Powinien zwrócić listę produktów i status 200 OK', () => {
      // Wykonujemy zapytanie sieciowe do naszego serwera Go
      cy.request('GET', 'http://localhost:8080/api/products').then((response) => {
        expect(response.status).to.eq(200); // Weryfikacja statusu HTTP
        expect(response.headers['content-type']).to.include('application/json'); // Weryfikacja nagłówka
        
        // Weryfikacja struktury danych (czy dostajemy tablicę z produktami)
        expect(response.body).to.be.an('array');
        expect(response.body.length).to.be.greaterThan(0);
        
        // Weryfikacja przykładowego obiektu
        expect(response.body[0]).to.have.property('id');
        expect(response.body[0]).to.have.property('name');
        expect(response.body[0]).to.have.property('price');
      });
    });

    it('Scenariusz Negatywny: Powinien zwrócić błąd 404 dla nieistniejącego zasobu/ścieżki', () => {
      // Próba odpytania nieistniejącego adresu (np. błędnie wpisane ID)
      cy.request({
        method: 'GET',
        url: 'http://localhost:8080/api/products/999',
        failOnStatusCode: false // Ważne: mówimy Cypressowi, aby nie przerywał testu na czerwono, gdy dostanie błąd 4xx
      }).then((response) => {
        expect(response.status).to.eq(404); // Weryfikujemy, że serwer poprawnie obsługuje brakujące strony
      });
    });
  });

  // ==========================================
  // ENDPOINT 2: /api/payments
  // ==========================================
  context('Endpoint: POST /api/payments', () => {
    
    it('Scenariusz Pozytywny: Powinien zaakceptować płatność i zwrócić status 200 OK', () => {
      cy.request({
        method: 'POST',
        url: 'http://localhost:8080/api/payments',
        body: {
          amount: 150.50
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
        // Serwer Go został zaprogramowany tak, by w odpowiedzi zwrócić JSON: {"status":"success"}
        expect(response.body).to.include('success'); 
      });
    });

    it('Scenariusz Negatywny: Powinien odrzucić błędną metodę (GET) i zwrócić błąd 405', () => {
      // Próba wejścia na adres płatności złą metodą (GET zamiast POST)
      cy.request({
        method: 'GET',
        url: 'http://localhost:8080/api/payments',
        failOnStatusCode: false // Zabezpieczenie przed przerwaniem testu
      }).then((response) => {
        expect(response.status).to.eq(405); // Weryfikujemy, że nasz backend w Go łapie złą metodę (Method Not Allowed)
        expect(response.body).to.include('Metoda niedozwolona'); // Sprawdzamy treść błędu z Go
      });
    });
  });

});