// Importujemy niezbędne narzędzia z biblioteki React:
// - createContext: funkcja do tworzenia globalnego schowka na dane.
// - useState: hook (hak) do tworzenia zmiennych stanowych, które po zmianie odświeżają widok.
// - useEffect: hook do wywoływania kodu w określonych momentach (np. po załadowaniu strony).
import React, { createContext, useState, useEffect } from 'react';

// Inicjujemy nasz globalny kontekst (schowek). Eksportujemy go, aby inne pliki mogły do niego "sięgać".
export const AppContext = createContext();

// Tworzymy komponent "Dostawcy" (Provider). Jego zadaniem jest otoczyć inne komponenty
// (reprezentowane przez argument 'children') i wstrzyknąć im dane ze stanu.
export const AppProvider = ({ children }) => {
  
  // ==========================================
  // DEKLARACJE STANÓW (STATE)
  // ==========================================
  
  // Stan przechowujący asortyment sklepu (tablica obiektów). Domyślnie pusta tablica [].
  // 'setProducts' to funkcja, za pomocą której będziemy ten stan aktualizować.
  const [products, setProducts] = useState([]); 
  
  // Stan przechowujący przedmioty dodane przez użytkownika do koszyka. Domyślnie pusta tablica.
  const [cartItems, setCartItems] = useState([]); 
  
  // Stan informujący o tym, czy aplikacja aktualnie ładuje dane z serwera. 
  // Domyślnie 'true', bo przy starcie aplikacji zaczynamy pobieranie.
  const [loading, setLoading] = useState(true); 

  // ==========================================
  // EFEKTY UBOCZNE (LIFECYCLE)
  // ==========================================

  // useEffect uruchomi się automatycznie tuż po tym, jak AppProvider zostanie wyrenderowany na ekranie.
  // Pusta tablica [] na końcu oznacza: "uruchom to tylko raz, przy starcie".
  useEffect(() => {
    // Rozpoczynamy zapytanie sieciowe (GET) do naszego serwera backendowego.
    fetch('http://localhost:8080/api/products')
      // Kiedy serwer odpowie, konwertujemy strumień danych na format JSON (czytelny dla JavaScriptu).
      .then(response => response.json())
      // Kiedy konwersja się uda, otrzymujemy gotowe dane (data).
      .then(data => {
        setProducts(data); // Zapisujemy pobrane produkty do naszego globalnego stanu.
        setLoading(false); // Wyłączamy ekran ładowania.
      })
      // Blok catch przechwytuje błędy. Jeśli serwer (np. w Javie/Kotlinie) nie działa, wejdziemy tutaj.
      .catch(error => {
        // Wypisujemy błąd w konsoli deweloperskiej (F12 w przeglądarce).
        console.error('Brak serwera. Ładuję asortyment z Ulicy Pokątnej:', error);
        
        // Z racji braku serwera, tworzymy statyczną tablicę (tzw. mocki) z magicznymi przedmiotami.
        // Każdy przedmiot musi mieć unikalne 'id', 'name' (nazwę) oraz 'price' (cenę).
        const hpProducts = [
          { id: 1, name: 'Różdżka (Ostrokrzew i pióro feniksa, 11 cali)', price: 150.00 },
          { id: 2, name: 'Najnowszy model miotły: Błyskawica', price: 1200.00 },
          { id: 3, name: 'Czekoladowa Żaba (zawiera kartę)', price: 5.50 },
          { id: 4, name: 'Kociołek cynowy (rozmiar standardowy)', price: 45.00 },
          { id: 5, name: 'Peleryna Niewidka (kolekcja Insygniów Śmierci)', price: 9999.99 }
        ];
        
        // Zastępujemy puste produkty naszymi magicznymi przedmiotami.
        setProducts(hpProducts); 
        // Nawet przy błędzie musimy wyłączyć ekran ładowania, aby pokazać zastępcze dane.
        setLoading(false); 
      });
  }, []); // <-- Ta pusta tablica to tzw. tablica zależności.

  // ==========================================
  // FUNKCJE POMOCNICZE W KONTEKŚCIE
  // ==========================================

  // Funkcja, która przyjmuje obiekt 'product' i dodaje go do koszyka.
  const addToCart = (product) => {
    // Używamy funkcji setCartItems z tzw. "callbackiem". 
    // 'prev' to aktualna zawartość koszyka. Tworzymy nową tablicę: 
    // ...prev (wypakuj stare elementy) oraz product (dodaj nowy na koniec).
    setCartItems((prev) => [...prev, product]);
  };

  // Funkcja całkowicie czyszcząca koszyk, przydatna np. po sfinalizowaniu zamówienia.
  const clearCart = () => {
    setCartItems([]); // Ustawia stan koszyka z powrotem na pustą tablicę.
  };

  // Zmienna obliczająca łączną kwotę do zapłaty. 
  // Używamy metody tablicowej .reduce(). Przechodzi ona przez każdy element w 'cartItems'.
  // 'sum' to akumulator (zaczyna od 0), do którego dodajemy 'item.price' każdego przedmiotu.
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price, 0);

  // ==========================================
  // ZWRACANIE PROVIDERA (JSX)
  // ==========================================

  // Właściwość 'value' to obiekt, do którego wrzucamy wszystko, co chcemy udostępnić w aplikacji.
  // Dzięki temu z każdego pliku będziemy mogli pobrać np. listę produktów czy funkcję addToCart.
  return (
    <AppContext.Provider value={{ products, cartItems, loading, addToCart, clearCart, cartTotal }}>
      {/* Tutaj wyrenderują się wszystkie komponenty (App, Products, Cart itd.) otoczone przez Providera */}
      {children}
    </AppContext.Provider>
  );
};