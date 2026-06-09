import React from 'react'; // Importujemy podstawową bibliotekę React potrzebną do renderowania komponentów.
import ReactDOM from 'react-dom/client'; // Importujemy klienta DOM używanego przez React 18 i nowsze wersje.
import App from './App'; // Importujemy główny komponent aplikacji zawierający routing i provider kontekstu.

const rootElement = document.getElementById('root'); // Pobieramy element HTML, w którym React zamontuje aplikację.
const root = ReactDOM.createRoot(rootElement); // Tworzymy korzeń Reacta odpowiadający za renderowanie całego drzewa komponentów.

root.render( // Uruchamiamy funkcję renderującą nasz kod na ekranie
  <React.StrictMode> {/* Aktywujemy ścisły tryb pomagający wykrywać problemy w komponentach. */}
    <App /> {/* Renderujemy główną aplikację z widokami Produktów, Koszyka i Płatności. */}
  </React.StrictMode>
); // Koniec funkcji renderującej
