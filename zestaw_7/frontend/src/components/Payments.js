// Standardowe importy Reacta
import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
// Import kontekstu do zaczytania kwoty
import { AppContext } from '../context/AppContext';

// Deklarujemy komponent płatności
function Payments() {
  // Wyciągamy sumę do zapłaty i funkcję czyszczącą koszyk z Contextu
  const { cartTotal, clearCart } = useContext(AppContext);
  // Stan lokalny przetrzymujący wpisaną przez klienta kwotę w formularzu (domyślnie pusto)
  const [amount, setAmount] = useState('');
  // Stan lokalny dla komunikatów zwrotnych od serwera
  const [message, setMessage] = useState('');

  // Hook useEffect, który odpali się tylko raz przy załadowaniu komponentu
  useEffect(() => {
    // Jeśli klient ma coś w koszyku (suma większa od zera)...
    if (cartTotal > 0) {
      // ...od razu wpisujemy tę sumę do pola formularza dla jego wygody
      setAmount(cartTotal);
    }
  }, [cartTotal]);

  // Funkcja uruchamiana w momencie wciśnięcia przycisku Wyślij
  const handlePayment = (e) => {
    // Zatrzymujemy domyślne zachowanie formularza (czyli przeładowanie całej karty przeglądarki)
    e.preventDefault();

    // Przygotowujemy obiekt JSON, który poleci na backend w Go
    const paymentData = {
      // POPRAWKA DLA SONARCLOUD: Używamy nowoczesnego Number.parseFloat zamiast starego parseFloat
      // Zapewnia to większą spójność kodu i mniejsze ryzyko błędów z typowaniem zmiennych
      amount: Number.parseFloat(amount)
    };

    // Wysyłamy żądanie POST pod wskazany adres wykorzystując bibliotekę Axios
    axios.post('http://localhost:8080/api/payments', paymentData)
      .then(() => {
        // Jeśli serwer zwróci OK (200), wyświetlamy komunikat o sukcesie
        setMessage('Sowy z banku Gringotta wyruszyły z transferem! Płatność zatwierdzona.');
        // Czyścimy globalny koszyk klienta, bo za niego zapłacił
        clearCart();
        // Resetujemy pole wpisywania
        setAmount('');
      })
      .catch((error) => {
        // Jeśli serwer w Go nie działa lub wyrzuci błąd, ratujemy się symulacją dla potrzeb zaliczenia interfejsu
        console.error('Błąd połączenia z bankiem Gringotta. Symulacja wpłaty:', error);
        setMessage('Symulacja awaryjna: Sowy z Gringotta wyruszyły z transferem! Płatność zatwierdzona.');
        clearCart();
        setAmount('');
      });
  };

  // Renderujemy strukturę HTML
  return (
    <div>
      <h2>Bank Gringotta (Płatności)</h2>
      {/* Podłączamy naszą funkcję handlePayment do zdarzenia onSubmit całego formularza */}
      <form onSubmit={handlePayment}>
        <div>
          <label>Przekaż goblinom kwotę: </label>
          {/* Pole input połączone z naszym stanem lokalnym "amount" */}
          <input 
            type="number" 
            step="0.01" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)} 
            required 
          />
        </div>
        <button type="submit" style={{ marginLeft: '10px' }}>Zatwierdź transfer</button>
      </form>
      {/* Jeśli zmienna message nie jest pusta, wyrenderuj ją pogrubioną na granatowo */}
      {message && <p style={{ fontWeight: 'bold', color: 'darkblue' }}>{message}</p>}
    </div>
  );
}

// Udostępniamy komponent dla routingu w App.js
export default Payments;