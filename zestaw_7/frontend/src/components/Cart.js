// Importujemy React oraz hook useContext do nasłuchiwania globalnego stanu
import React, { useContext } from 'react';
// Importujemy Link z react-router-dom, by móc wrócić do sklepu bez przeładowania strony
import { Link } from 'react-router-dom';
// Importujemy instancję naszego kontekstu z danymi sklepowymi
import { AppContext } from '../context/AppContext';

// Deklarujemy główny komponent funkcyjny koszyka
function Cart() {
  // Wyciągamy z AppContext dwie zmienne: tablicę towarów w koszyku i obliczoną sumę
  const { cartItems, cartTotal } = useContext(AppContext);

  // Funkcja pomocnicza zaokrąglająca sumę do 2 miejsc po przecinku
  const formatPrice = (price) => Number(price).toFixed(2);

  // Sprawdzamy czy koszyk jest pusty
  if (cartItems.length === 0) {
    // Jeśli tak, zwracamy widok z informacją o braku towaru
    return (
      <div>
        <h2>Zawartość Twojego Kociołka</h2>
        <p>Kociołek jest pusty. Odwiedź asortyment!</p>
        <Link to="/">Powrót do sklepu</Link>
      </div>
    );
  }

  // Jeśli koszyk nie jest pusty, generujemy pełny widok kociołka
  return (
    <div>
      <h2>Zawartość Twojego Kociołka</h2>
      <ul>
        {/* Przelatujemy funkcją map przez całą zawartość koszyka */}
        {cartItems.map((item, index) => (
          
          /* POPRAWKA DLA SONARCLOUD: Zamiast samego indexu, używamy unikalnej kombinacji id i indexu dla atrybutu key */
          /* Pozwala to Reactowi na bezpieczne aktualizowanie listy w wirtualnym DOM */
          <li key={`${item.id}-${index}`}>
            {item.name} - {formatPrice(item.price)} PLN
          </li>
          
        ))}
      </ul>
      {/* Wyświetlamy ostateczną kwotę do zapłaty wyciągniętą z Context API */}
      <h3>Do zapłaty: {formatPrice(cartTotal)} PLN</h3>
      <Link to="/payments">Przejdź do kasy (Bank Gringotta)</Link>
    </div>
  );
}

// Eksportujemy komponent, by App.js mógł go zagnieździć w ścieżkach rutingu
export default Cart;