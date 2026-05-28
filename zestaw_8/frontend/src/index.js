// Importujemy główną bibliotekę React, niezbędną do pracy z frameworkiem
import React from 'react';
// Importujemy moduł do manipulacji drzewem DOM (wersja dla React 18 i nowszych)
import ReactDOM from 'react-dom/client';
// Importujemy globalne style CSS dla całej naszej aplikacji
import './index.css';
// Importujemy główny komponent naszej aplikacji, który spina wszystkie widoki
import App from './App';
// Importujemy funkcję do mierzenia wydajności aplikacji u klienta
import reportWebVitals from './reportWebVitals';
// Importujemy dostawcę naszego globalnego stanu koszyka (Context API)
import { AppProvider } from './context/AppContext';

// Szukamy w głównym pliku HTML (public/index.html) elementu <div> o id "root" i tworzymy w nim korzeń
const root = ReactDOM.createRoot(document.getElementById('root'));

// Wywołujemy metodę render, aby narysować naszą aplikację w przeglądarce
root.render(
  // Znacznik React.StrictMode pomaga wykrywać potencjalne błędy i antywzorce podczas programowania
  <React.StrictMode>
    
    {/* POPRAWKA DLA SONARCLOUD: W JSX komentarze muszą być w nawiasach klamrowych */}
    {/* Oplatamy całą aplikację w AppProvider, by każdy komponent w głębi drzewa miał dostęp do stanu */}
    <AppProvider>
      
      {/* Renderujemy nasz główny komponent App, który ładuje routing (strony sklepu) */}
      <App />
      
    </AppProvider>
  </React.StrictMode>
);

// Wywołujemy funkcję telemetryczną (np. do zbierania danych o tym, jak szybko ładuje się sklep)
reportWebVitals();