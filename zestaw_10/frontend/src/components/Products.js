import React, { useContext, useEffect } from 'react'; // Importujemy React oraz hooki do pobrania danych z AppContext i uruchomienia pobierania.
import { AppContext } from '../context/AppContext'; // Importujemy kontekst aplikacji z produktami i funkcją dodawania do koszyka.

const Products = () => { // Definiujemy komponent widoku Produktów wymagany na ocenę 3.0.
  const { products, productsLoading, productsError, loadProducts, addToCart } = useContext(AppContext); // Pobieramy stan produktów oraz funkcję pobierającą dane z backendu.

  useEffect(() => { // Uruchamiamy pobieranie produktów, gdy użytkownik wejdzie na widok Products.
    loadProducts(); // Wywołujemy funkcję, która pobiera listę produktów z aplikacji serwerowej przez axios.
  }, [loadProducts]); // Efekt zależy od stabilnej funkcji loadProducts udostępnionej przez context.

  if (productsLoading) { // Sprawdzamy, czy lista produktów nadal ładuje się z serwera.
    return <p>Trwa pobieranie produktów z aplikacji serwerowej...</p>; // Pokazujemy stan ładowania zamiast pustej listy.
  } // Kończymy obsługę stanu ładowania.

  if (productsError) { // Sprawdzamy, czy pobieranie produktów zakończyło się błędem.
    return <p role="alert">{productsError}</p>; // Pokazujemy błąd użytkownikowi i oznaczamy go semantycznie jako alert.
  } // Kończymy obsługę błędu.

  return ( // Zwracamy właściwy widok produktów po poprawnym pobraniu danych.
    <section> {/* Używamy sekcji, ponieważ jest to samodzielny widok asortymentu. */}
      <h2>Produkty</h2> {/* Wyświetlamy nagłówek komponentu Produkty. */}

      {products.length === 0 ? ( // Sprawdzamy, czy backend zwrócił pustą listę produktów.
        <p>Brak produktów do wyświetlenia.</p> // Pokazujemy czytelny komunikat dla pustej odpowiedzi serwera.
      ) : ( // Jeżeli produkty istnieją, przechodzimy do renderowania listy.
        <ul> {/* Tworzymy listę produktów pobranych z backendu. */}
          {products.map((product) => ( // Iterujemy po produktach i generujemy element listy dla każdego produktu.
            <li key={product.id}> {/* Używamy identyfikatora produktu jako stabilnego klucza Reacta. */}
              <strong>{product.name}</strong> {/* Wyświetlamy nazwę produktu. */}
              {' - '} {/* Dodajemy separator tekstowy między nazwą a ceną. */}
              <span>{product.price.toFixed(2)} PLN</span> {/* Wyświetlamy cenę produktu w formacie z dwoma miejscami po przecinku. */}
              <button type="button" onClick={() => addToCart(product)} style={{ marginLeft: '10px' }}> {/* Dodajemy przycisk, który zapisuje produkt w koszyku przez hooki i context. */}
                Dodaj do koszyka {/* Tekst przycisku jasno opisuje akcję użytkownika. */}
              </button> {/* Zamykamy przycisk dodawania produktu. */}
            </li>
          ))} {/* Kończymy mapowanie produktów. */}
        </ul>
      )} {/* Kończymy warunkowe renderowanie pustej albo pełnej listy. */}
    </section>
  ); // Kończymy zwracanie JSX.
}; // Kończymy definicję komponentu Products.

export default Products; // Eksportujemy komponent, aby routing w App.js mógł go użyć jako osobnego widoku.
