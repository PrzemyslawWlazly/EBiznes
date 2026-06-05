const productsElement = document.querySelector("#products"); // Pobieramy liste produktow z dokumentu HTML.
const messagesElement = document.querySelector("#messages"); // Pobieramy kontener, w ktorym beda wiadomosci czatu.
const form = document.querySelector("#chat-form"); // Pobieramy formularz wysylania pytania.
const input = document.querySelector("#message-input"); // Pobieramy pole tekstowe z pytaniem uzytkownika.

function addMessage(role, text) { // Funkcja dodaje nowa wiadomosc do okna czatu.
  const item = document.createElement("article"); // Tworzymy element HTML reprezentujacy jedna wiadomosc.
  item.className = `message ${role}`; // Nadajemy klase okreslajaca, czy pisze uzytkownik czy asystent.
  item.textContent = text; // Wstawiamy tresc jako tekst, aby uniknac wstrzykiwania HTML.
  messagesElement.appendChild(item); // Dodajemy wiadomosc na koniec listy.
  messagesElement.scrollTop = messagesElement.scrollHeight; // Przewijamy czat do najnowszej wiadomosci.
} // Konczymy funkcje dodawania wiadomosci.

async function loadProducts() { // Funkcja pobiera produkty z backendu FastAPI.
  const response = await fetch("/products"); // Wysylamy zapytanie GET do endpointu /products.
  const products = await response.json(); // Parsujemy odpowiedz JSON na tablice produktow.
  productsElement.replaceChildren( // Podmieniamy zawartosc listy produktow na dane z API.
    ...products.map((product) => { // Dla kazdego produktu tworzymy element listy.
      const item = document.createElement("li"); // Tworzymy pojedynczy element <li>.
      item.innerHTML = `<span>${product.name}</span><strong>${product.price.toFixed(2)} PLN</strong>`; // Wyswietlamy nazwe i cene.
      return item; // Zwracamy gotowy element listy.
    }), // Konczymy mapowanie produktow.
  ); // Konczymy podmiane dzieci listy.
} // Konczymy funkcje pobierania produktow.

form.addEventListener("submit", async (event) => { // Reagujemy na wyslanie formularza czatu.
  event.preventDefault(); // Blokujemy standardowe przeladowanie strony przez formularz.
  const message = input.value.trim(); // Pobieramy tresc pytania i usuwamy biale znaki z brzegow.
  if (!message) return; // Jesli pytanie jest puste, nie wysylamy requestu.

  addMessage("user", message); // Dodajemy wiadomosc uzytkownika do okna czatu.
  input.value = ""; // Czyscimy pole tekstowe po wyslaniu.
  input.disabled = true; // Blokujemy pole na czas oczekiwania na backend.
  form.querySelector("button").disabled = true; // Blokujemy przycisk, aby uniknac podwojnego wyslania.

  try { // Proba komunikacji z serwisem GPT moze zakonczyc sie bledem.
    const response = await fetch("/chat", { // Wysylamy pytanie do endpointu /chat.
      method: "POST", // Uzywamy POST, bo przekazujemy dane w ciele zapytania.
      headers: { "Content-Type": "application/json" }, // Informujemy backend, ze wysylamy JSON.
      body: JSON.stringify({ message }), // Zamieniamy wiadomosc na JSON wymagany przez API.
    }); // Konczymy konfiguracje fetch.

    if (!response.ok) { // Sprawdzamy, czy backend zwrocil blad HTTP.
      const text = await response.text(); // Pobieramy tekst bledu z odpowiedzi.
      let detail = text; // Domyslnie pokazujemy surowy tekst bledu.
      try { // Proba parsowania moze sie nie udac, jesli backend zwrocil zwykly tekst.
        detail = JSON.parse(text).detail || text; // Jesli backend zwrocil JSON FastAPI, wyciagamy pole detail.
      } catch (parseError) { // Jesli odpowiedz nie jest JSON-em, zostawiamy surowy tekst.
        detail = text; // Zachowujemy oryginalny komunikat bledu.
      } // Konczymy probe parsowania bledu.
      throw new Error(detail); // Rzucamy blad, aby obsluzyc go w catch.
    } // Konczymy sprawdzanie statusu HTTP.

    const data = await response.json(); // Parsujemy poprawna odpowiedz JSON.
    addMessage("assistant", data.answer); // Dodajemy odpowiedz asystenta do czatu.
  } catch (error) { // Obslugujemy blad sieci, GPT, Ollamy albo OpenAI.
    addMessage("assistant", `Nie udalo sie pobrac odpowiedzi z serwisu GPT. Szczegoly: ${error.message}`); // Pokazujemy konkretny powod bledu.
  } finally { // Ten blok wykona sie niezaleznie od sukcesu lub bledu.
    input.disabled = false; // Odblokowujemy pole tekstowe.
    form.querySelector("button").disabled = false; // Odblokowujemy przycisk wysylania.
    input.focus(); // Przywracamy fokus, aby mozna bylo od razu pisac kolejne pytanie.
  } // Konczymy finally.
}); // Konczymy obsluge formularza.

loadProducts().catch(() => { // Uruchamiamy pobieranie produktow i obslugujemy ewentualny blad.
  productsElement.innerHTML = "<li>Nie udalo sie zaladowac produktow.</li>"; // Pokazujemy komunikat bledu listy.
}); // Konczymy obsluge bledu ladowania produktow.
