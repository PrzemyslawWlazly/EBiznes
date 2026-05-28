describe('Magiczny Sklep - Testy E2E z 50+ asercjami', () => {

  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });

  // --- SEKCJA 1: Nawigacja i Struktura Głównej Strony ---
  
  it('1. Powinien poprawnie załadować stronę główną i strukturę', () => {
    cy.url()
      .should('eq', 'http://localhost:3000/') // Asercja 1
      .and('not.contain', '/cart'); // Asercja 2

    cy.get('h2').first()
      .should('exist') // Asercja 3
      .and('be.visible') // Asercja 4
      .and('contain.text', 'Sklep Magiczny Esy i Floresy'); // Asercja 5
  });

  it('2. Powinien wyświetlać menu z dokładnie 3 poprawnymi linkami', () => {
    cy.get('nav ul').should('be.visible'); // Asercja 6
    cy.get('nav ul li').should('have.length', 3); // Asercja 7
    
    cy.get('nav ul li').eq(0).should('contain.text', 'Asortyment'); // Asercja 8
    cy.get('nav ul li').eq(1).should('contain.text', 'Twój Kociołek (Koszyk)'); // Asercja 9
    cy.get('nav ul li').eq(2).should('contain.text', 'Gringott (Płatności)'); // Asercja 10
  });

  it('3. Linki nawigacyjne powinny posiadać poprawne atrybuty href', () => {
    cy.get('nav ul li a').eq(0).should('have.attr', 'href', '/'); // Asercja 11
    cy.get('nav ul li a').eq(1).should('have.attr', 'href', '/cart'); // Asercja 12
    cy.get('nav ul li a').eq(2).should('have.attr', 'href', '/payments'); // Asercja 13
  });

  it('4. Powinien poprawnie renderować linię oddzielającą (hr)', () => {
    cy.get('hr')
      .should('exist') // Asercja 14
      .and('be.visible'); // Asercja 15
  });

  it('5. Powinien działać powrót do strony głównej z poziomu Koszyka', () => {
    cy.visit('http://localhost:3000/cart');
    cy.url().should('include', '/cart'); // Asercja 16
    
    cy.contains('Asortyment').click();
    cy.url().should('eq', 'http://localhost:3000/'); // Asercja 17
    cy.get('h2').contains('Dostępne Magiczne Przedmioty').should('be.visible'); // Asercja 18
  });

  // --- SEKCJA 2: Asortyment i Produkty ---

  it('6. Powinien wyświetlać nagłówek sekcji produktów', () => {
    cy.get('h2').contains('Dostępne Magiczne Przedmioty')
      .should('exist') // Asercja 19
      .and('be.visible') // Asercja 20
      .and('not.be.empty'); // Asercja 21
  });

  it('7. Lista produktów powinna być nieuporządkowana (ul) i zawierać elementy (li)', () => {
    cy.get('ul').last().should('exist'); // Asercja 22
    cy.get('ul').last().find('li').should('have.length.greaterThan', 2); // Asercja 23
  });

  it('8. Przyciski dodawania do koszyka powinny być klikalne', () => {
    cy.get('ul li button').first()
      .should('be.visible') // Asercja 24
      .and('not.be.disabled') // Asercja 25
      .and('have.css', 'margin-left', '10px'); // Asercja 26 (sprawdzenie stylu inline)
  });

  it('9. Produkty powinny posiadać cenę sformatowaną w PLN', () => {
    // Pobieramy tekst pierwszego elementu na liście asortymentu
    // POPRAWKA DLA SONARCLOUD: Używamy zwięzłej składni wyrażeń regularnych '\d' zamiast '[0-9]'
    // '\d+' oznacza jedną lub więcej cyfr, '\.\d{2}' upewnia się że są równe dwa miejsca po przecinku
    cy.get('ul li').first().invoke('text').should('match', /\d+\.\d{2} PLN/); 
  });

  it('10. Różdżka (Ostrokrzew i pióro feniksa) powinna być w ofercie i być pogrubiona', () => {
    cy.contains('strong', 'Różdżka (Ostrokrzew i pióro feniksa, 11 cali)')
      .should('exist') // Asercja 28
      .and('be.visible'); // Asercja 29
  });

  // --- SEKCJA 3: Koszyk i Wyliczenia ---

  it('11. Pusty koszyk powinien wyświetlać odpowiedni komunikat', () => {
    cy.visit('http://localhost:3000/cart');
    cy.contains('Kociołek jest pusty. Odwiedź asortyment!')
      .should('exist') // Asercja 30
      .and('be.visible'); // Asercja 31
  });

  it('12. Sekcja sumy nie powinna istnieć dla pustego koszyka', () => {
    cy.visit('http://localhost:3000/cart');
    cy.contains('Do zapłaty:').should('not.exist'); // Asercja 32
  });

  it('13. Dodanie produktu powinno dynamicznie ukryć komunikat o pustym koszyku', () => {
    cy.contains('Dodaj do kociołka').first().click();
    cy.contains('Twój Kociołek (Koszyk)').click();
    cy.contains('Kociołek jest pusty').should('not.exist'); // Asercja 33
  });

  it('14. Koszyk powinien wyświetlać dodany produkt w postaci listy', () => {
    cy.contains('Dodaj do kociołka').first().click();
    cy.visit('http://localhost:3000/cart');
    
    cy.get('ul').should('be.visible'); // Asercja 34
    cy.get('ul li').should('have.length', 1); // Asercja 35
  });

  it('15. Koszyk powinien poprawnie wyliczać i wyświetlać sumę z walutą', () => {
    cy.contains('Dodaj do kociołka').first().click(); // Pierwszy klik
    cy.contains('Dodaj do kociołka').first().click(); // Drugi klik (ten sam produkt)
    cy.visit('http://localhost:3000/cart');
    
    cy.get('h3').contains('Do zapłaty:')
      .should('be.visible') // Asercja 36
      .and('contain.text', 'PLN'); // Asercja 37
      
    cy.get('ul li').should('have.length', 2); // Asercja 38
  });

  // --- SEKCJA 4: Płatności i Formularze ---

  it('16. Formularz płatności powinien mieć poprawne atrybuty HTML5', () => {
    cy.visit('http://localhost:3000/payments');
    cy.get('form').should('exist'); // Asercja 39
    
    cy.get('input[type="number"]')
      .should('exist') // Asercja 40
      .and('have.attr', 'step', '0.01') // Asercja 41 (kroki ułamkowe)
      .and('have.attr', 'required'); // Asercja 42 (wymagane pole)
  });

  it('17. Przycisk wysyłania powinien być w formularzu i mieć typ submit', () => {
    cy.visit('http://localhost:3000/payments');
    cy.get('button')
      .should('contain.text', 'Zatwierdź transfer') // Asercja 43
      .and('have.attr', 'type', 'submit'); // Asercja 44
  });

  it('18. Zmiana kwoty z koszyka powinna automatycznie aktualizować input płatności', () => {
    cy.contains('Dodaj do kociołka').first().click(); 
    cy.visit('http://localhost:3000/payments');
    
    cy.get('input[type="number"]')
      .invoke('val') // Pobieramy aktualną wartość inputa
      .should('not.be.empty') // Asercja 45
      .and('not.eq', '0'); // Asercja 46
  });

  it('19. Input powinien poprawnie przyjmować wpisywane dane ręczne', () => {
    cy.visit('http://localhost:3000/payments');
    cy.get('input[type="number"]')
      .type('999.99')
      .should('have.value', '999.99'); // Asercja 47
  });

  it('20. Poprawne wysłanie formularza powinno wyświetlić sformatowany komunikat i wyczyścić input', () => {
    cy.visit('http://localhost:3000/payments');
    cy.get('input[type="number"]').type('50.00');
    cy.get('form').submit(); // Symulacja wysłania formularza
    
    // Sprawdzamy komunikat
    cy.get('p')
      .should('be.visible') // Asercja 48
      .and('have.css', 'font-weight', '700') // Asercja 49 (sprawdzenie pogrubienia)
      .and('have.css', 'color', 'rgb(0, 0, 139)'); // Asercja 50 (darkblue w formacie RGB)
      
    // Sprawdzamy, czy input wyczyścił się po wysłaniu
    cy.get('input[type="number"]').should('have.value', ''); // Asercja 51
  });

});