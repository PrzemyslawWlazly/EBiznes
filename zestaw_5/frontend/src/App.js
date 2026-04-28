// Importujemy bazę Reacta.
import React from 'react';
// Importujemy komponenty odpowiadające za "wirtualne" podstrony.
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
// Importujemy naszego globalnego Dostawcę Kontekstu.
import { AppProvider } from './context/AppContext'; 
// Importujemy poszczególne widoki (komponenty).
import Products from './components/Products';
import Payments from './components/Payments';
import Cart from './components/Cart';

// Definicja głównego komponentu aplikacji za pomocą funkcji strzałkowej.
const App = () => {
  return (
    // Zastępujemy stary CartProvider nowym AppProviderem.
    // Teraz CAŁA aplikacja umieszczona wewnątrz ma dostęp do magicznego asortymentu i koszyka.
    <AppProvider> 
      
      {/* Uruchamiamy system śledzenia adresów URL w przeglądarce */}
      <Router>
        {/* Główny kontener otulający widok strony */}
        <div>
          {/* Tag semantyczny <nav> sugeruje przeglądarce, że tu znajduje się nawigacja */}
          <nav>
            {/* Tytuł naszej magicznej księgarni i sklepu */}
            <h2>Sklep Magiczny Esy i Floresy</h2> 
            
            {/* Lista nieuporządkowana dla elementów menu */}
            <ul>
              {/* Komponent Link z react-router-dom działa jak standardowy tag <a> (hiperłącze), 
                  ale nie przeładowuje całej strony, tylko dynamicznie podmienia komponenty. */}
              <li><Link to="/">Asortyment</Link></li>
              <li><Link to="/cart">Twój Kociołek (Koszyk)</Link></li>
              <li><Link to="/payments">Gringott (Płatności)</Link></li>
            </ul>
          </nav>

          {/* Pozioma linia horyzontalna (horizontal rule) dla estetyki */}
          <hr />

          {/* Sekcja Routes działa jak "zwrotnica" - w zależności od adresu w przeglądarce 
              ładuje tylko jeden, pasujący komponent. */}
          <Routes>
            {/* Adres domyślny ('/'), np. http://localhost:3000/ -> ładuje komponent Products */}
            <Route path="/" element={<Products />} />
            
            {/* Adres podstrony koszyka ('/cart') -> ładuje komponent Cart */}
            <Route path="/cart" element={<Cart />} />
            
            {/* Adres podstrony płatności ('/payments') -> ładuje komponent Payments */}
            <Route path="/payments" element={<Payments />} />
          </Routes>
          
        </div>
      </Router>
      
    </AppProvider>
  );
};

// Eksportujemy App, by plik index.js mógł go wstrzyknąć do pliku HTML przeglądarki.
export default App;