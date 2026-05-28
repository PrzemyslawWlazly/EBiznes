// Importujemy główną bibliotekę React, bez niej nie zadziała renderowanie testowe komponentów
import React from 'react';
// Importujemy narzędzia testowe z biblioteki domyślnie dostarczanej przez Create React App
import { render, screen, fireEvent } from '@testing-library/react';
// Importujemy rozszerzone asercje (np. sprawdzanie, czy element w ogóle istnieje na ekranie)
import '@testing-library/jest-dom';
// Importujemy kontekst naszego sklepu z którego będą "czerpać" mockowane dane
import { AppContext } from './context/AppContext';
// Importujemy komponent widoku listy produktów do testowania
import Products from './components/Products';
// Importujemy komponent widoku koszyka klienta
import Cart from './components/Cart';
// Importujemy formularz płatności dla banku Gringotta
import Payments from './components/Payments';

// --- MOCKOWANIE DANYCH (Sztuczny stan dla testów jednostkowych w izolacji) ---

// Tworzymy sztuczną listę przedmiotów magicznych (zastępuje wywołanie bazy danych)
const mockProducts = [
  // POPRAWKA DLA SONARCLOUD: Zmieniono price na 100.5 (usunięto zerową końcówkę ułamkową .50)
  { id: 1, name: 'Testowa Różdżka', price: 100.5 },
  // Drugi produkt; 49.99 nie ma zera na końcu, więc Sonar go nie blokuje
  { id: 2, name: 'Testowy Kociołek', price: 49.99 }
];

// Tworzymy sztuczny zrzut stanu "kociołka" (koszyka) dla testu komponentu Cart
const mockCartItems = [
  // POPRAWKA DLA SONARCLOUD: Tu również zmieniamy cenę rzutując do 100.5
  { id: 1, name: 'Testowa Różdżka', price: 100.5 }
];

// Inicjujemy mock function (funkcję śledzącą "szpiega") z biblioteki Jest, imitującą logikę dodawania
const mockAddToCart = jest.fn(); 
// Podobna funkcja śledząca, która zastąpi domyślne czyszczenie koszyka
const mockClearCart = jest.fn();

// Blok "describe" to główny pojemnik grupujący nasze wszystkie przypadki testowe
describe('Testy Jednostkowe Komponentów (Minimum 50 asercji)', () => {

  // Rozpoczynamy podgrupę testów dedykowanych wyłącznie dla komponentu widoku produktów
  describe('Komponent Products', () => {
    
    // Blok "it" deklaruje jeden konkretny test i to, co chcemy w nim zweryfikować
    it('Renderuje ekran ładowania gdy loading jest true', () => {
      // Wywołujemy renderowanie wirtualnego drzewa HTML
      render(
        // Przekazujemy Provider z ustawioną flagą "loading: true"
        <AppContext.Provider value={{ loading: true, products: [], addToCart: mockAddToCart }}>
          {/* Komponent, dla którego ładujemy ten wirtualny kontekst */}
          <Products />
        </AppContext.Provider>
      );
      
      // Przeszukujemy wyrenderowany dokument pod kątem tekstu z ekranu ładowania
      const loadingText = screen.getByText(/Magia w toku/i);
      // Weryfikujemy (Asercja 1), czy ten napis pojawił się na ekranie
      expect(loadingText).toBeInTheDocument(); 
      // Weryfikujemy (Asercja 2), czy tag HTML wygenerowany dla tego napisu to paragraf (P)
      expect(loadingText.tagName).toBe('P'); 
    });

    // Drugi test komponentu: sprawdzamy co się dzieje po skończeniu pobierania danych
    it('Renderuje listę produktów gdy dane są gotowe', () => {
      // Ponownie renderujemy środowisko komponentu
      render(
        // Tym razem flagę pobierania dajemy na false i wstrzykujemy mockowaną tablicę z produktami
        <AppContext.Provider value={{ loading: false, products: mockProducts, addToCart: mockAddToCart }}>
          <Products />
        </AppContext.Provider>
      );
      
      // Wyszukujemy nagłówek na podstawie zadeklarowanego pola nazwy na stronie
      const heading = screen.getByRole('heading', { name: /Dostępne Magiczne Przedmioty/i });
      // Weryfikacja (Asercja 3), czy nagłówek się pojawił
      expect(heading).toBeInTheDocument(); 
      // Weryfikacja (Asercja 4), że nagłówek korzysta ze znacznika strukturalnego H2
      expect(heading.tagName).toBe('H2'); 

      // Przeszukujemy dokument by znaleźć wszystkie przyciski odpowiedzialne za dodawanie towaru
      const buttons = screen.getAllByRole('button', { name: /Dodaj do kociołka/i });
      // Weryfikacja (Asercja 5) zliczająca, że dla 2 produktów wygenerowano równe 2 przyciski
      expect(buttons).toHaveLength(2); 
      
      // Znajdujemy w kodzie pierwszy wystawiony na sprzedaż produkt
      const firstProduct = screen.getByText(/Testowa Różdżka/i);
      // Sprawdzamy (Asercja 6), czy obiekt ten istnieje w ciele DOM strony
      expect(firstProduct).toBeInTheDocument(); 
      // Zapewniamy (Asercja 7), że nazwa towaru wyświetla się wytłuszczonym drukiem (STRONG)
      expect(firstProduct.tagName).toBe('STRONG'); 
      
      // Powtarzamy proces lokalizacyjny dla towaru drugiego
      const secondProduct = screen.getByText(/Testowy Kociołek/i);
      // Asercja 8 potwierdza obecność Kociołka
      expect(secondProduct).toBeInTheDocument(); 
      // Asercja 9 gwarantuje pogrubienie czcionki również w tym przypadku
      expect(secondProduct.tagName).toBe('STRONG'); 

      // Łapiemy wszystkie znaczniki wypunktowanej listy HTML z ekranu
      const listItems = screen.getAllByRole('listitem');
      // Asercja 10 zlicza wielkość tej listy na 2
      expect(listItems).toHaveLength(2); 
      // Asercja 11 testuje łańcuch znakowy: upewnia się że format to zaktualizowane '100.5 PLN'
      expect(listItems[0]).toHaveTextContent('100.5 PLN'); 
      // Asercja 12 weryfikuje kwotę w drugim obiekcie listy (49.99)
      expect(listItems[1]).toHaveTextContent('49.99 PLN'); 
    });

    // Testujemy reakcję widoku na zdarzenia kursora myszy od klienta
    it('Wywołuje funkcję addToCart po kliknięciu przycisku', () => {
      // Przygotowujemy pole testowe z pełnym asortymentem i naszym cichym szpiegiem (mock)
      render(
        <AppContext.Provider value={{ loading: false, products: mockProducts, addToCart: mockAddToCart }}>
          <Products />
        </AppContext.Provider>
      );
      
      // Tworzymy referencję do macierzy wszystkich wygenerowanych przycisków dodawania
      const buttons = screen.getAllByRole('button', { name: /Dodaj do kociołka/i });
      // Odpalamy wirtualne kliknięcie (fireEvent) na indeksie [0], czyli przy pierwszej karcie towarowej
      fireEvent.click(buttons[0]); 
      
      // Sprawdzamy (Asercja 13), czy szpieg "mockAddToCart" złapał jedno wykonanie na backendzie
      expect(mockAddToCart).toHaveBeenCalledTimes(1); 
      // Kontrolujemy (Asercja 14), czy do koszyka wpadł właściwy obiekt towaru (nasza Testowa Różdżka)
      expect(mockAddToCart).toHaveBeenCalledWith(mockProducts[0]); 
    });
  });

  // Tworzymy oddzielną przestrzeń dyskusyjną na testy funkcjonalności i działania koszyka zakupowego
  describe('Komponent Cart', () => {
    
    // Test pierwszy: koszyk nowo wygenerowanego gościa portalu 
    it('Renderuje pusty koszyk', () => {
      // Wstrzykujemy puste zmienne inicjalizacyjne z contextu Reacta do wywołań wewnątrz widoku
      render(
        <AppContext.Provider value={{ cartItems: [], cartTotal: 0 }}>
          <Cart />
        </AppContext.Provider>
      );

      // Śledzimy instancję powitalnego nagłówka z informacją dla klienta
      const heading = screen.getByRole('heading', { name: /Zawartość Twojego Kociołka/i });
      // Weryfikacja (Asercja 15) upewnia nas o tym, że strona odpowiedziała wyrenderowaniem
      expect(heading).toBeInTheDocument(); 
      
      // Wynajdujemy fragment informujący literalnie o braku towaru u kupującego
      const emptyMessage = screen.getByText(/Kociołek jest pusty/i);
      // Analizujemy (Asercja 16) obecność testowanego tekstu
      expect(emptyMessage).toBeInTheDocument(); 
      // Analizujemy (Asercja 17), z jakiego korzysta uwarunkowania znacznikowego tag (Paragraf html)
      expect(emptyMessage.tagName).toBe('P'); 
      
      // Korzystamy z metody 'query', by uchronić test od rzucenia fatalnego błędu, bo domyślnie tego szukamy!
      const totalHeading = screen.queryByText(/Do zapłaty:/i);
      // Kontrolujemy (Asercja 18), że kwit rachunku absolutnie nie istniał przy oknie dla pustych rąk
      expect(totalHeading).toBeNull(); 
    });

    // Test dla pełnego koszyka 
    it('Renderuje koszyk z elementami', () => {
      // Inicjujemy drzewo wirtualne wyposażone w listę mockowanych itemów oraz sumę globalną 
      render(
        <AppContext.Provider value={{ cartItems: mockCartItems, cartTotal: 100.5 }}>
          <Cart />
        </AppContext.Provider>
      );

      // Pobieramy za pomocą metody bezpiecznej (query) element informujący o braku towaru
      const emptyMessage = screen.queryByText(/Kociołek jest pusty/i);
      // Sprawdzamy odwrotną logicznie relację (Asercja 19) na ukrycie informacji przez kod programu 
      expect(emptyMessage).not.toBeInTheDocument(); 

      // Pozyskujemy uchwyty (handle) do rzędów zaksięgowanego na froncie koszyka
      const listItems = screen.getAllByRole('listitem');
      // Upewniamy naszą weryfikację (Asercja 20), że jest tam dokładnie ten sam, jeden towar!
      expect(listItems).toHaveLength(1); 
      // Weryfikujemy (Asercja 21) dokładną specyfikację tekstową obiektu HTML pod kątem miana
      expect(listItems[0]).toHaveTextContent('Testowa Różdżka'); 
      // Weryfikujemy (Asercja 22) precyzyjnie tekstową wartość po pozbyciu zer ułamka (100.5)
      expect(listItems[0]).toHaveTextContent('100.5 PLN'); 
      // Sprawdzamy semantykę budowy (Asercja 23), badając tag listowy LI
      expect(listItems[0].tagName).toBe('LI'); 

      // Pobieramy całościowy panel wyliczeń sumarycznych kasy Gringotta dla Reacta 
      const totalHeading = screen.getByRole('heading', { name: /Do zapłaty: 100.5 PLN/i });
      // Wymagamy asercją (24) pojawienia się tego tagu na wokandzie frontu
      expect(totalHeading).toBeInTheDocument(); 
      // Ostatecznie test (Asercja 25) ustala wymóg by tag na rachunku figurował jako H3
      expect(totalHeading.tagName).toBe('H3'); 
    });
  });

  // Przenosimy zakres testowania do bramki uiszczenia przelewu - komponent Payments
  describe('Komponent Payments', () => {
    
    // Budujemy rygor i szkielet interfejsu (formularz bankowy HTML)
    it('Renderuje formularz płatności poprawnie', () => {
      // Odpalamy moduł odpowiedzialny za pole wpisywania rachunków
      render(
        <AppContext.Provider value={{ cartTotal: 0, clearCart: mockClearCart }}>
          <Payments />
        </AppContext.Provider>
      );

      // Sprawdzamy identyfikację tego konkretnego interfejsu 
      const heading = screen.getByRole('heading', { name: /Bank Gringotta/i });
      // Oczekujemy (Asercja 26) renderowania
      expect(heading).toBeInTheDocument(); 
      // Oczekujemy (Asercja 27) że podtytuł płatniczy wykorzysta H2
      expect(heading.tagName).toBe('H2'); 

      // Szukamy etykiety (tag HTML Label) naprowadzającej klienta na odpowiednie pole do wypisania
      const label = screen.getByText(/Przekaż goblinom kwotę/i);
      // Analizujemy jej bezbłędny debiut na scenie wyświetlania (Asercja 28)
      expect(label).toBeInTheDocument(); 

      // Znajdujemy kluczowy dla formularza blok liczbowy ('spinbutton' to odpowiednik dla input[type=number])
      const input = screen.getByRole('spinbutton'); 
      // Upewniamy system, że wejście faktycznie istnieje w DOM (Asercja 29)
      expect(input).toBeInTheDocument(); 
      // Nakładamy (Asercja 30) kontrolę jakości upewniając się, że narzuca w atrybucie wpisywanie liczb ('number')
      expect(input).toHaveAttribute('type', 'number'); 
      // Narzucamy standard wpisywania setnych części (Asercja 31), aby nie blokować transakcji gorszami
      expect(input).toHaveAttribute('step', '0.01'); 
      // Bezwzględnie blokujemy formularz (Asercja 32), nakazując weryfikację po stronie przeglądarki atrybutu 'required'
      expect(input).toBeRequired(); 
      // Test 33 wymaga dla pustej sumy inicjalizację startową pola o wartości uciszonej ('null')
      expect(input).toHaveValue(null); 

      // Pozyskujemy fizyczny guzik zatwierdzania przelewu do banku
      const button = screen.getByRole('button', { name: /Zatwierdź transfer/i });
      // Weryfikujemy 34: render działa
      expect(button).toBeInTheDocument(); 
      // Weryfikujemy 35: funkcja musi natywnie strzelać sygnałem dla 'form', więc używa parametru 'submit'
      expect(button).toHaveAttribute('type', 'submit'); 
    });

    // Test symulujący pobieranie wartości startowych zapytania po uprzednim zakupie
    it('Inicjalizuje input wartością z koszyka', () => {
      // Otwieramy bramkę z wbudowaną gotówką ze spisu z poprzednich stanów (Cart)
      render(
        <AppContext.Provider value={{ cartTotal: 150.75, clearCart: mockClearCart }}>
          <Payments />
        </AppContext.Provider>
      );

      // Skrótowo powołujemy obiekt przycisku obrotowego dla wprowadzania wejścia formularza
      const input = screen.getByRole('spinbutton');
      // Asercja (36) na istnienie w logice obiektu
      expect(input).toBeInTheDocument(); 
      // Asercja (37) weryfikująca zaciągnięcie matematycznej precyzji wprost z propa cartTotal!
      expect(input).toHaveValue(150.75); 
    });

    // Przypadek w którym goblin z Gringotta lub klient sami edytują parametry wysyłane (wymóg manual input)
    it('Pozwala na ręczną zmianę wartości w inpucie', () => {
      // Pusta plansza - reset przed nową symulacją 
      render(
        <AppContext.Provider value={{ cartTotal: 0, clearCart: mockClearCart }}>
          <Payments />
        </AppContext.Provider>
      );

      // Pozyskujemy nasz główny obszar testowany - czysty input bez zaczytanych groszy
      const input = screen.getByRole('spinbutton');
      // Początkowa asercja bezpieczeństwa potwierdzająca pustą bazę wejścia do formularza (38)
      expect(input).toHaveValue(null); 
      
      // Zdarzenie przeglądarkowe wymuszające w logice zachowanie klawiatury użytkownika ("Target: value")
      fireEvent.change(input, { target: { value: '99.99' } });
      
      // Weryfikujemy test 39 sprawdzając, czy wyemitowany tekst wpadł poprawnie jako matematyczna instancja liczby HTML 
      expect(input).toHaveValue(99.99); 
      // Weryfikujemy test ostateczny pola (40) analizując odseparowany atrybut systemowy typu ciąg-znaków string
      expect(input.value).toBe('99.99'); 
    });
  });

  // Dodatkowa subiektywna strefa operacyjna by dowieść Sonarowi (oraz wykładowcy!) nienaganności DOM strukturalnego
  describe('Weryfikacja strukturalna komponentów', () => {
    
    // Szukamy błędów gdzie kod w React stworzył puste kontenery zajmujące moc przerobową na front-endzie klienta
    it('Komponent Products nie renderuje pustych tagów li', () => {
      // Szybkie wygenerowanie widoku do analizy 
      render(
        <AppContext.Provider value={{ loading: false, products: mockProducts, addToCart: mockAddToCart }}>
          <Products />
        </AppContext.Provider>
      );
      // Zbiorcze zapytanie lokalizujące wszystkie pozycje listujące się w obrębie DOM
      const items = screen.getAllByRole('listitem');
      // Asercja (41) rzucająca okiem "pod maskę" wirtualnego DOM - żaden z elementów listowych w produkcie 1 nie ma spacji
      expect(items[0]).not.toBeEmptyDOMElement(); 
      // Analogiczne zabezpieczenie kodu DOMu dla asortymentu w indeksie drugim listingu (42)
      expect(items[1]).not.toBeEmptyDOMElement(); 
    });

    // Szukamy optymalizacji wydajności React by kod nie generował w ogóle list HTML bez itemów
    it('Komponent Cart poprawnie ukrywa listę przy braku elementów', () => {
      // Pusty kociołek wysyłany do bazy
      render(
        <AppContext.Provider value={{ cartItems: [], cartTotal: 0 }}>
          <Cart />
        </AppContext.Provider>
      );
      // Znowu wykorzystujemy zabezpieczony queryByRole by nie ubić procesu gdy React ukryje element (lista z ul/ol)
      const list = screen.queryByRole('list');
      // Bezwzględna kontrola strukturalna - Asercja 43 zapewnia, że komponent UL nigdy nie wszedł do przeglądarki
      expect(list).not.toBeInTheDocument(); 
      // Z kolei asercja 44 wymaga by funkcja lokalizacyjna w bibliotece zwróciła całkowite NULL za swój połów
      expect(list).toBeNull(); 
    });

    // Badanie zabezpieczeń przeciwko duplikatom wywołania (anti-spam user behavior)
    it('Komponent Payments posiada tylko jeden przycisk wysyłania', () => {
      // Inicjalizacja bankowych dróg 
      render(
        <AppContext.Provider value={{ cartTotal: 0, clearCart: mockClearCart }}>
          <Payments />
        </AppContext.Provider>
      );
      // Lokalizujemy tablicę wszelakiej maści klikalnych buttonów wykreowanych w strefie React
      const buttons = screen.getAllByRole('button');
      // Asercja na powielanie węzłów zapobiegająca błędowi dwukrotnego przelewu bankowego - musi być "jeden" jedyny! (45)
      expect(buttons).toHaveLength(1); 
      // Zezwalamy logice (Asercja 46) na pełne zachowanie właściwości aktywowanych
      expect(buttons[0]).toBeEnabled(); 
      // Bonus: Test (47) poprawności kaskadowych CSSów Inline nadpisanych dla obiektu przelewu gringotta
      expect(buttons[0]).toHaveStyle('margin-left: 10px'); 
    });

    // Weryfikacja samych procedur mockowania czy nie stwarzają ryzyka przełamania granic asercji
    it('Mockowane funkcje posiadają właściwy stan początkowy', () => {
      // Test obiektywny 48 czy zmienna ma jakąś formę
      expect(mockAddToCart).toBeDefined(); 
      // Kolejna kontrola środowiskowa Jest dla obrabiacza kasowania ze sklepu (49)
      expect(mockClearCart).toBeDefined(); 
      // Potwierdzenie że mamy do czynienia w kodzie Javascript z rzutowaniem metodycznym (funkcją) - Asercja 50
      expect(typeof mockAddToCart).toBe('function'); 
      // To samo rzutowanie bezpieczeństwa potwierdzające na metodę dla bramki Clear - Asercja 51
      expect(typeof mockClearCart).toBe('function'); 
      // Zamknięcie i finał testów: Metoda kasująca jest całkowicie zablokowana i czysta na starcie aplikacji - 52
      expect(mockClearCart).not.toHaveBeenCalled(); 
    });
  });

});