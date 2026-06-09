import { render, screen } from '@testing-library/react'; // Importujemy narzędzia do renderowania komponentu i wyszukiwania treści na ekranie.
import App from './App'; // Importujemy główny komponent aplikacji z routingiem, kontekstem i widokami.
import apiClient from './api/client'; // Importujemy klienta API, aby w teście podmienić odpowiedź backendu.

jest.mock('./api/client'); // Mockujemy klienta axios, żeby test nie zależał od realnie uruchomionego backendu.

jest.mock('react-router-dom', () => { // Mockujemy router w teście, bo środowisko Jest z react-scripts 5 słabo obsługuje aktualny pakiet routera.
  const React = require('react'); // Pobieramy React wewnątrz mocka, zgodnie z ograniczeniami fabryki jest.mock.

  return { // Zwracamy minimalny zestaw komponentów używanych przez App.js.
    BrowserRouter: ({ children }) => <div>{children}</div>, // Zastępujemy BrowserRouter prostym kontenerem na dzieci.
    Link: ({ children, to }) => <a href={to}>{children}</a>, // Zastępujemy Link zwykłym odnośnikiem wystarczającym dla testu renderowania.
    Route: ({ element }) => element, // Zwracamy element trasy, aby test mógł wyrenderować widok startowy.
    Routes: ({ children }) => React.Children.toArray(children)[0], // Renderujemy pierwszą trasę, czyli widok Produktów pod adresem "/".
  }; // Kończymy definicję mockowanych elementów routera.
}, { virtual: true }); // Kończymy mockowanie react-router-dom jako modułu wirtualnego dla resolvera Jesta.

test('renderuje widok produktów pobranych z backendu', async () => { // Definiujemy test sprawdzający startowy widok Produktów.
  apiClient.get.mockResolvedValueOnce({ // Ustawiamy udaną odpowiedź dla zapytania GET /api/products.
    data: [ // Przygotowujemy przykładową listę produktów zwróconą przez serwer.
      { id: 1, name: 'Produkt testowy', price: 10 }, // Dodajemy jeden produkt potrzebny do asercji.
    ], // Zamykamy tablicę przykładowych produktów.
  }); // Kończymy konfigurację mocka axios.

  render(<App />); // Renderujemy całą aplikację tak, jak zrobiłaby to przeglądarka.

  expect(await screen.findByText('Produkt testowy')).toBeInTheDocument(); // Czekamy na produkt z backendu i sprawdzamy, czy pojawił się w UI.
}); // Kończymy test widoku produktów.
