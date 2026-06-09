import React, { createContext, useCallback, useMemo, useState } from 'react'; // Importujemy React oraz hooki potrzebne do stanu, callbacków i memoizacji danych kontekstu.
import apiClient from '../api/client'; // Importujemy wspólnego klienta axios do komunikacji z aplikacją serwerową.

export const AppContext = createContext(null); // Tworzymy kontekst, który będzie wspólnym źródłem danych dla Produktów, Koszyka i Płatności.

export const AppProvider = ({ children }) => { // Definiujemy provider udostępniający stan aplikacji wszystkim widokom potomnym.
  const [products, setProducts] = useState([]); // Przechowujemy listę produktów pobraną z backendu.
  const [productsLoading, setProductsLoading] = useState(true); // Przechowujemy informację, czy trwa pobieranie produktów.
  const [productsError, setProductsError] = useState(''); // Przechowujemy komunikat błędu, gdy backend produktów nie odpowie poprawnie.
  const [cartItems, setCartItems] = useState([]); // Przechowujemy produkty dodane przez użytkownika do koszyka.

  const loadProducts = useCallback(async () => { // Definiujemy funkcję pobierającą produkty, którą uruchamia komponent Products.
    setProductsLoading(true); // Włączamy stan ładowania przed wysłaniem zapytania do backendu.
    setProductsError(''); // Czyścimy poprzedni błąd, aby nowa próba pobrania zaczynała się od czystego stanu.

    try { // Rozpoczynamy blok obsługi poprawnej odpowiedzi backendu.
      const response = await apiClient.get('/api/products'); // Pobieramy produkty z endpointu backendowego przy użyciu axios.
      setProducts(response.data); // Zapisujemy produkty zwrócone przez aplikację serwerową.
    } catch (error) { // Obsługujemy realny błąd połączenia lub odpowiedzi serwera.
      console.error('Nie udało się pobrać produktów z serwera:', error); // Logujemy szczegóły błędu dla debugowania.
      setProducts([]); // Czyścimy produkty, aby nie udawać danych z serwera lokalnymi mockami.
      setProductsError('Nie udało się pobrać produktów z aplikacji serwerowej. Sprawdź, czy backend działa na porcie 8080.'); // Pokazujemy użytkownikowi jasny komunikat błędu.
    } finally { // Ten blok wykona się zarówno po sukcesie, jak i po błędzie.
      setProductsLoading(false); // Wyłączamy stan ładowania po zakończeniu próby pobierania.
    } // Kończymy blok finally.
  }, []); // Funkcja używa tylko stabilnych setterów Reacta, więc nie potrzebuje dodatkowych zależności.

  const addToCart = useCallback((product) => { // Definiujemy stabilną funkcję dodającą produkt do koszyka.
    setCartItems((previousItems) => [...previousItems, product]); // Tworzymy nową tablicę, zachowując niezmienność stanu Reacta.
  }, []); // Funkcja korzysta tylko ze stabilnego setCartItems, więc nie wymaga dodatkowych zależności.

  const removeFromCart = useCallback((indexToRemove) => { // Definiujemy stabilną funkcję usuwającą jeden wpis z koszyka po jego indeksie.
    setCartItems((previousItems) => previousItems.filter((_, index) => index !== indexToRemove)); // Zostawiamy w koszyku wszystkie elementy poza klikniętym wpisem.
  }, []); // Funkcja korzysta tylko ze stabilnego setCartItems, więc pozostaje bez dodatkowych zależności.

  const clearCart = useCallback(() => { // Definiujemy stabilną funkcję czyszczącą koszyk po udanej płatności.
    setCartItems([]); // Ustawiamy koszyk na pustą tablicę.
  }, []); // Funkcja korzysta tylko ze stabilnego setCartItems, więc nie potrzebuje zależności.

  const cartTotal = cartItems.reduce((sum, item) => sum + item.price, 0); // Wyliczamy łączną wartość koszyka z cen produktów.

  const contextValue = useMemo(() => ({ // Memoizujemy obiekt kontekstu, aby ograniczyć niepotrzebne renderowania konsumentów.
    products, // Udostępniamy listę produktów komponentowi Produkty.
    productsLoading, // Udostępniamy informację o ładowaniu produktów.
    productsError, // Udostępniamy błąd pobierania produktów.
    loadProducts, // Udostępniamy funkcję pobierania produktów komponentowi Products.
    cartItems, // Udostępniamy zawartość koszyka komponentowi Koszyk.
    cartTotal, // Udostępniamy sumę koszyka komponentom Koszyk i Płatności.
    addToCart, // Udostępniamy funkcję dodawania produktu do koszyka.
    removeFromCart, // Udostępniamy funkcję usuwania produktu z koszyka.
    clearCart, // Udostępniamy funkcję czyszczenia koszyka po poprawnej płatności.
  }), [products, productsLoading, productsError, loadProducts, cartItems, cartTotal, addToCart, removeFromCart, clearCart]); // Odświeżamy obiekt tylko wtedy, gdy zmienią się jego dane lub funkcje.

  return ( // Zwracamy provider opakowujący całą aplikację.
    <AppContext.Provider value={contextValue}> {/* Przekazujemy przygotowane dane i funkcje do komponentów potomnych. */}
      {children} {/* Renderujemy widoki aplikacji mające dostęp do kontekstu. */}
    </AppContext.Provider>
  ); // Kończymy zwracanie JSX.
}; // Kończymy definicję AppProvider.
