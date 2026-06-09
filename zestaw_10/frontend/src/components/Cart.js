import React, { useContext } from 'react'; // Importujemy React oraz useContext do odczytu wspólnego stanu koszyka.
import { Link } from 'react-router-dom'; // Importujemy Link, aby przejście do płatności odbywało się przez routing bez przeładowania strony.
import { AppContext } from '../context/AppContext'; // Importujemy kontekst aplikacji przechowujący koszyk.

const Cart = () => { // Definiujemy komponent Koszyk wymagany na ocenę 3.5.
  const { cartItems, cartTotal, removeFromCart } = useContext(AppContext); // Pobieramy produkty w koszyku, sumę oraz funkcję usuwania pozycji.

  return ( // Zwracamy osobny widok koszyka podłączony w App.js do ścieżki /cart.
    <section> {/* Używamy sekcji, ponieważ koszyk jest samodzielnym widokiem aplikacji. */}
      <h2>Koszyk</h2> {/* Wyświetlamy nagłówek widoku koszyka. */}

      {cartItems.length === 0 ? ( // Sprawdzamy, czy użytkownik nie dodał jeszcze żadnych produktów.
        <p>Koszyk jest pusty. Przejdź do produktów i dodaj wybrane pozycje.</p> // Pokazujemy komunikat dla pustego koszyka.
      ) : ( // Jeżeli koszyk ma elementy, renderujemy listę i podsumowanie.
        <div> {/* Grupujemy listę pozycji i podsumowanie koszyka. */}
          <ul> {/* Tworzymy listę produktów dodanych do koszyka. */}
            {cartItems.map((item, index) => ( // Iterujemy po pozycjach koszyka, ponieważ ten sam produkt może wystąpić kilka razy.
              <li key={`${item.id}-${index}`}> {/* Łączymy id produktu i indeks, aby klucz był unikalny także dla duplikatów. */}
                <span>{item.name}</span> {/* Wyświetlamy nazwę produktu znajdującego się w koszyku. */}
                {' - '} {/* Dodajemy separator między nazwą a ceną. */}
                <span>{item.price.toFixed(2)} PLN</span> {/* Wyświetlamy cenę pozycji koszyka. */}
                <button type="button" onClick={() => removeFromCart(index)} style={{ marginLeft: '10px' }}> {/* Dodajemy usuwanie pojedynczej pozycji bez mutowania tablicy stanu. */}
                  Usuń {/* Tekst przycisku opisuje usunięcie konkretnej pozycji. */}
                </button> {/* Zamykamy przycisk usuwania pozycji. */}
              </li>
            ))} {/* Kończymy mapowanie pozycji koszyka. */}
          </ul> {/* Zamykamy listę produktów w koszyku. */}

          <h3>Do zapłaty: {cartTotal.toFixed(2)} PLN</h3> {/* Pokazujemy sumę wyliczoną w AppContext na podstawie hooków Reacta. */}
          <Link to="/payments">Przejdź do płatności</Link> {/* Udostępniamy przejście do widoku płatności przez routing. */}
        </div>
      )} {/* Kończymy warunkowe renderowanie koszyka. */}
    </section>
  ); // Kończymy zwracanie JSX.
}; // Kończymy definicję komponentu Cart.

export default Cart; // Eksportujemy Koszyk, aby App.js mógł przypisać go do osobnej trasy.
