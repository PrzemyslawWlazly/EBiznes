// Importujemy useState do zarządzania polami tekstowymi, useContext do odczytu danych 
// i useEffect do reagowania na zmiany w koszyku.
import React, { useState, useContext, useEffect } from 'react';
// Import kontekstu.
import { AppContext } from '../context/AppContext'; 

// Definiujemy komponent odpowiedzialny za formularz opłacania zakupów.
const Payments = () => {
  
  // Z globalnego schowka wyciągamy łączną sumę (cartTotal) oraz funkcję do opróżniania koszyka (clearCart).
  const { cartTotal, clearCart } = useContext(AppContext);
  
  // Definiujemy lokalny stan dla pola wprowadzania kwoty.
  // Jako domyślną wartość (initial state) podajemy to, co przyszło z koszyka (cartTotal).
  // Jeśli koszyk jest pusty (cartTotal to 0), wstawiamy pusty string (''), by pole było puste.
  const [amount, setAmount] = useState(cartTotal || ''); 
  
  // Lokalny stan do przechowywania wiadomości informacyjnej o sukcesie/porażce wysyłki formularza.
  const [statusMessage, setStatusMessage] = useState('');

  // Ten useEffect obserwuje naszą zmienną 'cartTotal'. 
  // Oznacza to, że jeśli jesteśmy w zakładce Płatności, a ktoś w innym oknie dodałby coś do koszyka 
  // (zmieniając tym samym sumę), ten useEffect to wychwyci i automatycznie zaktualizuje kwotę w inputcie.
  useEffect(() => {
    // Zabezpieczenie przed wpisywaniem wartości zerowych.
    if (cartTotal > 0) {
      setAmount(cartTotal); // Ustawiamy w polu tekstowym nową wyliczoną kwotę.
    }
  }, [cartTotal]); // Zmienna wpisana w nawiasy kwadratowe to obiekt obserwowany przez hook.

  // Zdarzenie (event handler) uruchamiane po kliknięciu przycisku 'Zatwierdź transfer' (submit).
  const handleSubmit = (event) => {
    // Zablokowanie domyślnej akcji przeglądarki, która normalnie odświeżyłaby nam brutalnie całą stronę
    // (gubiąc tym samym wszystkie stany i koszyk).
    event.preventDefault();
    
    // Tworzymy docelowy obiekt JSON z właściwością 'amount'. 
    // Przekształcamy to co wpisał użytkownik (string) na liczbę zmiennoprzecinkową za pomocą parseFloat().
    const paymentData = { amount: parseFloat(amount) };
    
    // Klasyczne żądanie sieciowe z użyciem JavaScriptowego Fetch API (Zadanie na 5.0 wprowadzi tu Axios).
    fetch('http://localhost:8080/api/payments', {
      method: 'POST', // Chcemy złożyć na serwerze nowe dane (wysłać), więc metoda to POST.
      headers: { 'Content-Type': 'application/json' }, // Mówimy backendowi, że wysyłamy format JSON.
      body: JSON.stringify(paymentData) // Konwersja naszego obiektu JS na ciąg znaków gotowy do podróży przez sieć.
    })
    // Obsługa pierwszej obietnicy (Promise) – dotyczy pomyślnego zestawienia połączenia HTTP.
    .then(response => {
      if (response.ok) { // Status HTTP od 200 do 299.
        setStatusMessage('Sowy z banku Gringotta potwierdziły płatność!'); // Poinformuj użytkownika.
        setAmount(''); // Wyczyść wpisaną kwotę.
        clearCart(); // Odpal funkcję z Contextu, która wyzeruje globalną tablicę w koszyku.
      } else { // Serwer odpowiedział błędem np. 400 Bad Request.
        setStatusMessage('Gringott odrzucił transakcję. Brak środków w skrytce.');
      }
    })
    // Obsługa błędu sieci (np. backend wyłączony, brak internetu lub port 8080 milczy).
    .catch(error => {
      // Wyświetlamy błąd z sieci zrzucony przez przeglądarkę dla celów debugowania.
      console.error('Błąd magii:', error);
      
      // Ponieważ aktualnie nie posiadamy włączonego backendu, formularz ZAWSZE wpadnie do tego bloku (catch).
      // Tworzymy więc symulację (tzw. happy path dla testów frontendu) – sztucznie udajemy, że płatność przeszła.
      setStatusMessage('Sowy z Gringotta wyleciały (symulacja płatności bez serwera zakończona sukcesem).');
      clearCart(); // Zerujemy koszyk (połączenie z AppContext).
      setAmount(''); // Czyścimy input.
    });
  };

  return (
    <div>
      {/* Tytuł podstrony płatności */}
      <h2>Bank Gringotta - Opłać zamówienie</h2>
      
      {/* Formularz. Podpinamy zdarzenie onSubmit pod naszą zadeklarowaną wyżej funkcję handleSubmit. */}
      <form onSubmit={handleSubmit}>
        <label>
          Przekaż goblinom kwotę (PLN):
          
          {/* Komponent kontrolowany. Jego wartość to zawsze stan 'amount'.
              Zdarzenie onChange wykrywa wciśnięcia klawiszy (e.target.value) i na bieżąco aktualizuje stan,
              co z kolei na nowo rysuje (renderuje) komponent pokazując na ekranie wpisaną literę/cyfrę. */}
          <input
            type="number" // Pole akceptuje numery i strzałki "góra/dół".
            step="0.01" // Pozwalamy na części ułamkowe (grosze).
            value={amount} // Wiązanie zmiennej stanowej z oknem przeglądarki.
            onChange={(e) => setAmount(e.target.value)} // Reakcja na zmianę zawartości.
            required // Atrybut HTML5 powstrzymujący wysłanie pustego formularza.
          />
        </label>
        
        {/* Przycisk typu 'submit' automatycznie odpala akcję onSubmit na formularzu, 
            wewnątrz którego się znajduje. */}
        <button type="submit" style={{ marginLeft: '10px' }}>
          Zatwierdź transfer
        </button>
      </form>

      {/* Skrócony IF (&&). Jeśli 'statusMessage' nie jest puste, wygeneruj akapit (tag <p>) z wiadomością. 
          Stosujemy stylizację inline, by tekst był pogrubiony i wyróżniał się kolorem. */}
      {statusMessage && (
        <p style={{ fontWeight: 'bold', color: 'darkblue' }}>
          {statusMessage}
        </p>
      )}
    </div>
  );
};

// Eksport do użytku w routingach.
export default Payments;