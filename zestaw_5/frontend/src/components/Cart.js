// Ponownie pobieramy niezbędne hooki z Reacta.
import React, { useContext } from 'react';
// Importujemy nasz punkt połączenia z globalnym magazynem.
import { AppContext } from '../context/AppContext';

// Definiujemy komponent Koszyka (Kociołka).
const Cart = () => {
  // Wyciągamy zawartość koszyka (cartItems) oraz obliczoną wcześniej w kontekście 
  // łączną kwotę zamówienia (cartTotal).
  const { cartItems, cartTotal } = useContext(AppContext);

  return (
    <div>
      {/* Nagłówek sekcji koszyka */}
      <h2>Zawartość Twojego Kociołka</h2>
      
      {/* Składnia trójargumentowa (ternary operator) to taki "skrócony IF" do używania wewnątrz JSX.
          Pytamy: Czy długość tablicy cartItems wynosi dokładnie 0? */}
      {cartItems.length === 0 ? (
        
        // Jeśli odpowiedź to TAK (koszyk jest pusty), wyrenderuj ten paragraf:
        <p>Kociołek jest pusty. Odwiedź asortyment!</p>
        
      ) : (
        
        // Jeśli odpowiedź to NIE (są elementy w koszyku), wyrenderuj ten cały blok (div):
        <div>
          <ul>
            {/* Przechodzimy pętlą przez koszyk. 
                Ponieważ ten sam produkt mógł zostać dodany dwa razy, nie możemy użyć jego ID jako klucza.
                Zamiast tego używamy 'index', czyli kolejnego numeru iteracji pętli (0, 1, 2...). */}
            {cartItems.map((item, index) => (
              <li key={index}>
                {/* Pokazujemy nazwę przedmiotu znajdującego się w koszyku oraz jego sformatowaną cenę. */}
                {item.name} - {item.price.toFixed(2)} PLN
              </li>
            ))}
          </ul>
          
          {/* Tag nagłówka niższego stopnia wyświetlający globalnie policzoną sumę. */}
          <h3>Do zapłaty: {cartTotal.toFixed(2)} PLN</h3>
        </div>
        
      )}
    </div>
  );
};

// Zezwalamy na import tego pliku z zewnątrz.
export default Cart;