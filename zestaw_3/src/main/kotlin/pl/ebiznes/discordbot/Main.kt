package pl.ebiznes.discordbot // Definiuje pakiet, w którym znajduje się nasz kod, co pozwala na zachowanie porządku i struktury w dużych projektach

import net.dv8tion.jda.api.JDABuilder // Importuje klasę budowniczego z frameworka JDA, która służy do poprawnej konfiguracji i uruchomienia bota
import net.dv8tion.jda.api.events.message.MessageReceivedEvent // Importuje klasę zdarzenia, które jest generowane za każdym razem, gdy na serwerze pojawi się nowa wiadomość
import net.dv8tion.jda.api.hooks.ListenerAdapter // Importuje klasę bazową, po której dziedziczymy, aby móc podsłuchiwać i reagować na wybrane zdarzenia Discorda
import net.dv8tion.jda.api.requests.GatewayIntent // Importuje klasę intencji, która służy do poinformowania Discorda, jakich dokładnie danych oczekuje nasz bot (np. treści wiadomości)

fun main() { // Deklaruje główną funkcję programu, która zostanie uruchomiona jako pierwsza po starcie aplikacji w kontenerze
    val token = System.getenv("DISCORD_TOKEN") // Próbuje pobrać tajny token bota ze zmiennych środowiskowych, co jest najbezpieczniejszą praktyką (nie wpisujemy hasła na sztywno w kodzie)
    
    if (token == null) { // Instrukcja warunkowa sprawdzająca, czy zmienna środowiskowa z tokenem nie istniała (zwróciła null)
        println("Błąd: Nie znaleziono zmiennej środowiskowej DISCORD_TOKEN.") // Wypisuje w konsoli czytelny komunikat błędu dla użytkownika uruchamiającego aplikację
        return // Zatrzymuje dalsze wykonywanie głównej funkcji, wyłączając program, ponieważ bot bez tokenu i tak nie mógłby działać
    } // Zamyka blok instrukcji warunkowej sprawdzającej token
    
    val botListener = BotListener() // Tworzy nową instancję (obiekt) naszej własnej klasy BotListener, która zawiera logikę obsługi komend użytkowników
    
    JDABuilder.createDefault(token) // Rozpoczyna proces budowania połączenia z Discordem używając pobranego wcześniej tajnego tokenu autoryzacyjnego
        .enableIntents(GatewayIntent.MESSAGE_CONTENT) // Włącza specjalną intencję (uprawnienie), która pozwala botowi na odczytywanie faktycznej treści tekstowej wysyłanych przez użytkowników wiadomości
        .addEventListeners(botListener) // Rejestruje nasz obiekt botListener jako aktywnego słuchacza, do którego framework JDA będzie wysyłał powiadomienia o nowych zdarzeniach (np. nowa wiadomość)
        .build() // Finalizuje konfigurację i faktycznie nawiązuje asynchroniczne połączenie websocketowe z serwerami Discorda
} // Zamyka główną funkcję programu

class BotListener : ListenerAdapter() { // Deklaruje naszą własną klasę BotListener, która dziedziczy po ListenerAdapter z frameworku JDA, pozwalając na nadpisywanie metod zdarzeń
    
    private val sklepData = mapOf( // Deklaruje i inicjalizuje prywatną, niemutowalną strukturę danych typu słownik (Map), która posłuży nam jako prosta "baza danych" sklepu
        "Elektronika" to listOf("Laptop Asus", "Smartfon Samsung", "Myszka Logitech"), // Tworzy klucz kategorii "Elektronika" i przypisuje mu listę trzech produktów sprzętowych
        "Ksiazki" to listOf("Wladca Pierscieni", "Wiedzmin", "Harry Potter"), // Tworzy klucz kategorii "Ksiazki" i przypisuje mu listę tytułów znanych książek
        "Zabawki" to listOf("Klocki LEGO", "Lalka Barbie", "Gra planszowa") // Tworzy klucz kategorii "Zabawki" i przypisuje mu listę trzech artykułów dla dzieci
    ) // Zamyka tworzenie mapy (słownika) danych sklepu
    
    override fun onMessageReceived(event: MessageReceivedEvent) { // Nadpisuje metodę z klasy bazowej, która jest wywoływana przez framework JDA za każdym razem, gdy na kanale pojawi się wiadomość
        
        if (event.author.isBot) return // Sprawdza, czy autorem odebranej wiadomości jest inny bot (lub on sam); jeśli tak, przerywa działanie funkcji, aby uniknąć nieskończonych pętli odpowiedzi
        
        val messageText = event.message.contentRaw // Pobiera surową, nieprzefiltrowaną treść tekstową z obiektu otrzymanej wiadomości i zapisuje ją w zmiennej
        
        val channel = event.channel // Pobiera z obiektu zdarzenia referencję do kanału (tekstowego na serwerze lub prywatnego), na którym została wysłana oryginalna wiadomość
        
        if (messageText == "!kategorie") { // Sprawdza, czy treść wiadomości wysłanej przez użytkownika to dokładnie komenda żądająca listy kategorii
            val categoriesList = sklepData.keys.joinToString(separator = ", ") // Wyciąga same klucze (nazwy kategorii) z naszej mapy danych i łączy je w jeden tekst, rozdzielając je przecinkami
            channel.sendMessage("Dostępne kategorie to: $categoriesList").queue() // Buduje wiadomość zwrotną z połączonym tekstem kategorii i dodaje ją do kolejki zadań frameworka JDA w celu natychmiastowego wysłania na kanał
            return // Kończy działanie metody, ponieważ komenda "!kategorie" została już obsłużona i nie ma potrzeby sprawdzania dalszych warunków
        } // Zamyka blok obsługujący komendę "!kategorie"
        
        if (messageText.startsWith("!produkty")) { // Sprawdza, czy wiadomość użytkownika zaczyna się od słowa kluczowego żądającego listy produktów (używamy startsWith, bo po komendzie będzie nazwa kategorii)
            val args = messageText.split(" ") // Dzieli treść wiadomości na listę mniejszych fragmentów (słów), używając spacji jako separatora
            
            if (args.size < 2) { // Sprawdza, czy użytkownik wpisał cokolwiek po słowie "!produkty" (czyli czy rozmiar listy wygenerowanej w poprzedniej linii jest mniejszy niż 2)
                channel.sendMessage("Podaj nazwę kategorii! Użycie: !produkty [nazwa_kategorii]").queue() // Wysyła do użytkownika komunikat z błędem oraz instrukcją poprawnego użycia komendy
                return // Kończy wykonywanie metody, gdyż użytkownik nie podał wymaganej kategorii
            } // Zamyka blok instrukcji sprawdzającej poprawność argumentów komendy
            
            val requestedCategory = args[1] // Pobiera drugi element z listy (o indeksie 1), który w zamyśle powinien stanowić nazwę wybranej przez użytkownika kategorii
            val productsList = sklepData[requestedCategory] // Próbuje pobrać z naszego głównego słownika listę produktów używając podanej nazwy kategorii jako klucza wyszukiwania
            
            if (productsList != null) { // Sprawdza, czy w naszym słowniku istniały jakiekolwiek dane pod wyszukiwaną kategorią (czy zmienna productsList nie jest nullem)
                val formattedProducts = productsList.joinToString(separator = "\n- ") // Łączy listę znalezionych produktów w jeden tekstowy blok, zaczynając każdy produkt od nowej linii i znaku myślnika
                channel.sendMessage("Produkty w kategorii **$requestedCategory**:\n- $formattedProducts").queue() // Wysyła do użytkownika na kanał sformatowaną graficznie (pogrubienie Markdownem) i czytelną listę dostępnych produktów
            } else { // W przeciwnym razie, jeśli nazwa kategorii wpisana przez użytkownika nie istnieje w słowniku sklepData
                channel.sendMessage("Niestety, kategoria **$requestedCategory** nie istnieje. Wpisz !kategorie, aby sprawdzić dostępne opcje.").queue() // Informuje użytkownika o wpisaniu błędnej kategorii i podpowiada mu prawidłową komendę sprawdzającą
            } // Zamyka blok if-else obsługujący logikę zwracania produktów
        } // Zamyka blok obsługujący komendę rozpoczynającą się od "!produkty"
    } // Zamyka definicję metody onMessageReceived obsługującej przychodzące wiadomości
} // Zamyka definicję klasy BotListener