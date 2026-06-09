import React, { useContext, useEffect, useState } from 'react'; // Importujemy React oraz hooki do formularza, efektów i danych z kontekstu.
import apiClient from '../api/client'; // Importujemy klienta axios do wysyłania płatności do backendu.
import { AppContext } from '../context/AppContext'; // Importujemy kontekst z sumą koszyka i funkcją czyszczenia koszyka.

const Payments = () => { // Definiujemy komponent Płatności wymagany na ocenę 3.0.
  const { cartItems, cartTotal, clearCart } = useContext(AppContext); // Pobieramy koszyk, sumę i czyszczenie koszyka z React Context.
  const [amount, setAmount] = useState(cartTotal > 0 ? cartTotal.toFixed(2) : ''); // Przechowujemy kontrolowaną wartość pola kwoty.
  const [statusMessage, setStatusMessage] = useState(''); // Przechowujemy komunikat sukcesu lub błędu dla użytkownika.
  const [isSubmitting, setIsSubmitting] = useState(false); // Przechowujemy informację, czy formularz jest aktualnie wysyłany.

  useEffect(() => { // Reagujemy na zmianę sumy koszyka.
    setAmount(cartTotal > 0 ? cartTotal.toFixed(2) : ''); // Ustawiamy pole kwoty na aktualną sumę albo czyścimy je dla pustego koszyka.
  }, [cartTotal]); // Efekt uruchamia się tylko wtedy, gdy zmieni się suma koszyka.

  const handleSubmit = async (event) => { // Definiujemy asynchroniczną obsługę wysyłki formularza płatności.
    event.preventDefault(); // Blokujemy domyślne przeładowanie strony przez formularz HTML.

    const numericAmount = Number(amount); // Zamieniamy tekst z inputa na liczbę.

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) { // Walidujemy, czy kwota jest poprawną dodatnią liczbą.
      setStatusMessage('Podaj poprawną kwotę płatności większą od zera.'); // Pokazujemy błąd walidacji użytkownikowi.
      return; // Przerywamy wysyłkę do serwera dla niepoprawnych danych.
    } // Kończymy walidację kwoty.

    const paymentData = { // Budujemy dane płatności wysyłane do aplikacji serwerowej.
      amount: numericAmount, // Przekazujemy kwotę płatności jako liczbę.
      items: cartItems.map((item) => ({ id: item.id, name: item.name, price: item.price })), // Przekazujemy uproszczoną listę produktów z koszyka.
    }; // Kończymy obiekt danych płatności.

    setIsSubmitting(true); // Blokujemy ponowne kliknięcie przycisku na czas wysyłki.
    setStatusMessage(''); // Czyścimy poprzedni komunikat przed nową próbą płatności.

    try { // Rozpoczynamy blok poprawnej komunikacji z backendem.
      await apiClient.post('/api/payments', paymentData); // Wysyłamy dane płatności do serwera przez axios.
      setStatusMessage('Płatność została poprawnie wysłana do aplikacji serwerowej.'); // Informujemy użytkownika o realnym sukcesie odpowiedzi backendu.
      clearCart(); // Czyścimy koszyk dopiero po udanej odpowiedzi serwera.
      setAmount(''); // Czyścimy pole kwoty po poprawnie zakończonej płatności.
    } catch (error) { // Obsługujemy błąd sieci albo odpowiedź błędną z backendu.
      console.error('Nie udało się wysłać płatności do serwera:', error); // Logujemy szczegóły błędu dla debugowania.
      setStatusMessage('Nie udało się wysłać płatności do aplikacji serwerowej. Spróbuj ponownie po uruchomieniu backendu.'); // Pokazujemy użytkownikowi prawdziwy błąd bez symulowania sukcesu.
    } finally { // Ten blok wykona się niezależnie od wyniku zapytania.
      setIsSubmitting(false); // Odblokowujemy formularz po zakończeniu próby wysyłki.
    } // Kończymy blok finally.
  }; // Kończymy obsługę wysyłki formularza.

  return ( // Zwracamy osobny widok płatności podłączony w App.js do ścieżki /payments.
    <section> {/* Używamy sekcji, ponieważ płatności są samodzielnym widokiem aplikacji. */}
      <h2>Płatności</h2> {/* Wyświetlamy nagłówek komponentu Płatności. */}
      <p>Kwota z koszyka: {cartTotal.toFixed(2)} PLN</p> {/* Pokazujemy sumę koszyka przekazaną przez React hooks i Context API. */}

      <form onSubmit={handleSubmit}> {/* Podpinamy formularz pod funkcję wysyłającą dane płatności do backendu. */}
        <label htmlFor="payment-amount">Kwota płatności (PLN):</label> {/* Łączymy etykietę z polem formularza dla dostępności. */}
        <input // Rozpoczynamy kontrolowane pole formularza dla kwoty płatności.
          id="payment-amount" // Nadajemy identyfikator powiązany z etykietą.
          type="number" // Ograniczamy typ pola do wartości liczbowych.
          min="0.01" // Wymuszamy kwotę większą od zera na poziomie HTML.
          step="0.01" // Pozwalamy wpisywać grosze z dokładnością do dwóch miejsc po przecinku.
          value={amount} // Wiążemy wartość pola ze stanem komponentu.
          onChange={(event) => setAmount(event.target.value)} // Aktualizujemy stan po każdej zmianie pola.
          required // Wymagamy podania kwoty przed wysłaniem formularza.
        /> {/* Zamykamy pole kwoty. */}
        <button type="submit" disabled={isSubmitting} style={{ marginLeft: '10px' }}> {/* Dodajemy przycisk wysyłki i blokujemy go podczas zapytania. */}
          {isSubmitting ? 'Wysyłanie...' : 'Zapłać'} {/* Pokazujemy inny tekst w trakcie wysyłania formularza. */}
        </button> {/* Zamykamy przycisk wysłania płatności. */}
      </form> {/* Zamykamy formularz płatności. */}

      {statusMessage && ( // Sprawdzamy, czy istnieje komunikat do pokazania użytkownikowi.
        <p role="status" style={{ fontWeight: 'bold' }}> {/* Renderujemy komunikat jako status dostępny dla czytników ekranu. */}
          {statusMessage} {/* Wyświetlamy tekst aktualnego statusu płatności. */}
        </p>
      )} {/* Kończymy warunkowe renderowanie komunikatu. */}
    </section>
  ); // Kończymy zwracanie JSX.
}; // Kończymy definicję komponentu Payments.

export default Payments; // Eksportujemy komponent, aby routing mógł użyć go jako widoku /payments.
