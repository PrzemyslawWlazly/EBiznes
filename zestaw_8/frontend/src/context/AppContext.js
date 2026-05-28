// Importujemy główną bibliotekę React oraz niezbędne hooki:
// - createContext: do tworzenia globalnego stanu
// - useState: do zarządzania stanem zmiennych w komponencie
// - useEffect: do wywoływania efektów ubocznych (np. pobierania danych przy starcie)
// - useMemo: do zapamiętywania (memoizacji) wartości i optymalizacji wydajności (wymóg SonarCloud)
import React, { createContext, useState, useEffect, useMemo } from 'react';

// Importujemy bibliotekę PropTypes do walidacji typów przekazywanych właściwości (propsów)
// Jest to wymóg platformy SonarCloud dla bezpiecznego i przewidywalnego kodu
import PropTypes from 'prop-types';

// Importujemy Axios do wykonywania zapytań HTTP do naszego serwera w Go
import axios from 'axios';

// Inicjalizujemy globalny kontekst aplikacji (puste "pudełko" na nasze dane)
export const AppContext = createContext();

// Główny komponent dostawcy (Provider), który będzie oplatał całą naszą aplikację
// Przyjmuje on "children", czyli wszystkie inne komponenty, które znajdą się w jego wnętrzu
export const AppProvider = ({ children }) => {
  // Stan lokalny przechowujący listę wszystkich dostępnych produktów w sklepie
  const [products, setProducts] = useState([]);
  // Stan lokalny przechowujący produkty aktualnie dodane do koszyka klienta
  const [cartItems, setCartItems] = useState([]);
  // Stan lokalny (flaga) informujący o tym, czy dane są w trakcie pobierania z serwera
  const [loading, setLoading] = useState(true);

  // Hook useEffect uruchomi ten kod dokładnie jeden raz po zamontowaniu komponentu w przeglądarce
  useEffect(() => {
    // Próbujemy pobrać asortyment z naszego serwera backendowego w języku Go
    axios.get('http://localhost:8080/api/products')
      .then(response => {
        // Jeśli się udało, zapisujemy pobrane dane do stanu "products"
        setProducts(response.data);
        // Wyłączamy ekran ładowania
        setLoading(false);
      })
      .catch(error => {
        // W przypadku błędu (np. gdy serwer Go jest wyłączony), wypisujemy błąd w konsoli
        console.error('Brak serwera Gringotta. Ładuję asortyment awaryjny:', error);

        // Tworzymy awaryjną bazę towarów symulującą odpowiedź z serwera
        // POPRAWKA DLA SONARCLOUD: Ceny nie posiadają zbędnych zer na końcu (np. 150 zamiast 150.00)
        const hpProducts = [
          { id: 1, name: 'Różdżka (Ostrokrzew i pióro feniksa, 11 cali)', price: 150 },
          { id: 2, name: 'Najnowszy model miotły: Błyskawica', price: 1200 },
          { id: 3, name: 'Czekoladowa Żaba (zawiera kartę)', price: 5.5 },
          { id: 4, name: 'Kociołek cynowy (rozmiar standardowy)', price: 45 },
          { id: 5, name: 'Peleryna Niewidka (kolekcja Insygniów Śmierci)', price: 9999.99 }
        ];

        // Wrzucamy awaryjne towary do stanu aplikacji
        setProducts(hpProducts);
        // Wyłączamy ekran ładowania, aby użytkownik mógł zobaczyć sklep
        setLoading(false);
      });
  }, []); // Pusta tablica zależności oznacza "uruchom tylko przy starcie aplikacji"

  // Funkcja odpowiedzialna za dodawanie wybranego przedmiotu do koszyka
  const addToCart = (product) => {
    // Używamy funkcji rozszerzającej (spread operator), by dodać nowy przedmiot do poprzedniego stanu
    setCartItems((prev) => [...prev, product]);
  };

  // Funkcja czyszcząca całą zawartość koszyka (np. po pomyślnej płatności w banku Gringotta)
  const clearCart = () => {
    // Ustawiamy stan koszyka z powrotem na pustą tablicę
    setCartItems([]);
  };

  // Wyliczamy całkowitą kwotę do zapłaty (iterujemy po koszyku i sumujemy ceny)
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price, 0);

  // POPRAWKA DLA SONARCLOUD: Optymalizacja wydajności (Maintainability).
  // Tworzymy zapamiętany (zmemoizowany) obiekt zawierający wszystkie funkcje i stany.
  // Dzięki hookowi useMemo, React nie będzie tworzył tego obiektu od nowa przy każdym odświeżeniu ekranu,
  // chyba że zmieni się któraś z wartości wymienionych w tablicy zależności poniżej.
  const contextValue = useMemo(() => ({
    products,     // Lista produktów do wyświetlenia w sklepie
    cartItems,    // Elementy dodane do koszyka
    loading,      // Flaga ekranu ładowania
    addToCart,    // Referencja do funkcji dodającej do koszyka
    clearCart,    // Referencja do funkcji czyszczącej koszyk
    cartTotal     // Obliczona, sumaryczna kwota do zapłaty
  }), [products, cartItems, loading, cartTotal]); // Tablica zależności (kiedy odświeżyć obiekt)

  // Zwracamy komponent Provider, przekazując mu nasz zoptymalizowany obiekt z danymi
  // Wszystkie komponenty "children" zyskają dzięki temu dostęp do stanu sklepu
  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// POPRAWKA DLA SONARCLOUD: Dodana walidacja typów właściwości.
// Gwarantujemy, że komponent AppProvider zawsze otrzyma poprawny element Reactowy jako "children".
AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
};