import React from 'react'; // Import podstawowej biblioteki React, wymagane do korzystania z elementów React
import ReactDOM from 'react-dom/client'; // Import biblioteki odpowiedzialnej za manipulację modelem DOM dla przeglądarek (React 18)
import App from './App'; // Importujemy główny węzeł naszej aplikacji z pliku App.js

const rootElement = document.getElementById('root'); // Pobieramy z pliku public/index.html element 'div' o identyfikatorze 'root'
const root = ReactDOM.createRoot(rootElement); // Wewnątrz pobranego diva tworzymy korzeń dla drzewa aplikacji React

root.render( // Uruchamiamy funkcję renderującą nasz kod na ekranie
  <React.StrictMode> // Aktywujemy ścisły tryb informujący o potencjalnych problemach i przestarzałych metodach
    <App /> // Osadzamy jako pierwszą warstwę naszą główną aplikację (zawiera Produkty i Płatności)
  </React.StrictMode> // Zamykamy tag ścisłego trybu
); // Koniec funkcji renderującej