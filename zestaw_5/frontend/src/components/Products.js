// Importujemy React oraz hook useContext, by móc odczytać globalny stan.
import React, { useContext } from 'react'; 
// Importujemy uchwyt do naszego kontekstu.
import { AppContext } from '../context/AppContext'; 

// Definiujemy komponent wyświetlający asortyment.
const Products = () => {
  // To jest najważniejszy moment hooków w akcji!
  // Za pomocą destrukturyzacji obiektów (wąsy {}) "wyciągamy" z AppContext tylko te rzeczy,
  // które są nam potrzebne w tym widoku: tablicę produktów, status ładowania oraz funkcję dodawania.
  const { products, loading, addToCart } = useContext(AppContext);

  // Instrukcja warunkowa zabezpieczająca widok przed brakiem danych.
  // Jeśli useEffect w AppContext jeszcze nie skończył pracy, 'loading' jest true.
  // Przerywamy wtedy renderowanie strony i pokazujemy komunikat.
  if (loading) return <p>Magia w toku... Trwa ładowanie asortymentu...</p>;

  // Jeśli kod dotrze tutaj, to znaczy, że 'loading' jest false i mamy już dane.
  return (
    <div>
      {/* Tytuł podstrony */}
      <h2>Dostępne Magiczne Przedmioty</h2>
      
      {/* Otwieramy listę */}
      <ul>
        {/* Metoda .map() to pętla wewnątrz JSX. Dla każdego pojedynczego 'product' z tablicy 'products' 
            zostanie wygenerowany blok kodu poniżej. */}
        {products.map(product => (
          
          // Każdy element generowany przez pętlę w React MUSI mieć unikalny atrybut 'key'.
          // Pomaga to silnikowi Reacta w wydajnym aktualizowaniu tylko tych elementów, które uległy zmianie.
          <li key={product.id}>
            
            {/* Tag <strong> pogrubia czcionkę. Wstawiamy nazwę pobraną z obiektu. */}
            <strong>{product.name}</strong> 
            
            {/* Wstawiamy myślnik, cenę (sformatowaną przez .toFixed(2) zawsze do 2 miejsc po przecinku) i walutę. */}
            - {product.price.toFixed(2)} PLN 
            
            {/* Przycisk. Kiedy zostanie kliknięty (zdarzenie onClick), uruchomi anonimową funkcję strzałkową,
                która z kolei odpali naszą globalną funkcję addToCart i przekaże jej cały obiekt 'product'. 
                Atrybut style dodaje margines z lewej strony dla estetyki. */}
            <button onClick={() => addToCart(product)} style={{ marginLeft: '10px' }}>
              Dodaj do kociołka
            </button>
            
          </li>
        ))}
      </ul>
    </div>
  );
};

// Udostępniamy komponent dla routingu w App.js
export default Products;