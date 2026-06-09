import axios from 'axios'; // Importujemy bibliotekę axios, wymaganą w zadaniu do komunikacji HTTP z backendem.

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080'; // Ustalamy adres backendu z konfiguracji środowiska albo używamy lokalnego serwera Go.

const apiClient = axios.create({ // Tworzymy jedną wspólną instancję klienta HTTP, żeby nie powtarzać konfiguracji w komponentach.
  baseURL: API_BASE_URL, // Każde zapytanie będzie automatycznie poprzedzone adresem backendu.
  headers: { // Definiujemy domyślne nagłówki wysyłane do aplikacji serwerowej.
    'Content-Type': 'application/json', // Informujemy backend, że przesyłane dane mają format JSON.
  }, // Zamykamy obiekt nagłówków.
  timeout: 90000, // Dajemy darmowej instancji chmurowej czas na ponowne uruchomienie po okresie bezczynności.
}); // Kończymy konfigurację klienta axios.

export default apiClient; // Eksportujemy klienta, aby używać go w kontekście i komponentach.
