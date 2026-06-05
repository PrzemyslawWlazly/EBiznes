package pl.ebiznes.discordbot // Definiujemy pakiet aplikacji, aby uporzadkowac kod bota.

import io.ktor.client.HttpClient // Importujemy klienta HTTP z Ktor, aby bot mogl pytac gpt-service.
import io.ktor.client.call.body // Importujemy funkcje body do odczytu odpowiedzi jako obiektu Kotlin.
import io.ktor.client.engine.cio.CIO // Importujemy silnik CIO, ktory wykonuje zapytania HTTP.
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation // Importujemy plugin negocjacji tresci dla JSON.
import io.ktor.client.request.post // Importujemy metode POST klienta Ktor.
import io.ktor.client.request.setBody // Importujemy ustawianie ciala zapytania HTTP.
import io.ktor.http.ContentType // Importujemy typy Content-Type, np. application/json.
import io.ktor.http.contentType // Importujemy funkcje ustawiajaca Content-Type dla requestu Ktor.
import io.ktor.serialization.kotlinx.json.json // Importujemy integracje Ktor z kotlinx.serialization JSON.
import kotlinx.coroutines.CoroutineScope // Importujemy zakres coroutines, aby obslugiwac zapytania GPT asynchronicznie.
import kotlinx.coroutines.Dispatchers // Importujemy dispatchery, aby uruchamiac prace sieciowa poza watkiem Discorda.
import kotlinx.coroutines.launch // Importujemy launch, aby startowac zapytanie GPT bez blokowania listenera.
import kotlinx.serialization.Serializable // Importujemy adnotacje do serializacji klas request/response.
import kotlinx.serialization.json.Json // Importujemy konfiguracje parsera JSON.
import net.dv8tion.jda.api.JDABuilder // Importujemy builder JDA tworzacy polaczenie z Discordem.
import net.dv8tion.jda.api.events.message.MessageReceivedEvent // Importujemy event nowej wiadomosci Discord.
import net.dv8tion.jda.api.hooks.ListenerAdapter // Importujemy klase bazowa listenera JDA.
import net.dv8tion.jda.api.requests.GatewayIntent // Importujemy intencje wymagane do czytania tresci wiadomosci.

fun main() { // Funkcja main jest punktem startowym aplikacji bota.
    val token = System.getenv("DISCORD_TOKEN") // Pobieramy token Discorda ze zmiennej srodowiskowej.

    if (token == null) { // Sprawdzamy, czy token zostal przekazany przed uruchomieniem.
        println("Blad: Nie znaleziono zmiennej srodowiskowej DISCORD_TOKEN.") // Wypisujemy czytelny blad konfiguracji.
        return // Konczymy program, bo bez tokenu bot nie moze sie zalogowac.
    } // Konczymy walidacje tokenu.

    val gptServiceUrl = System.getenv("GPT_SERVICE_URL") ?: "http://localhost:8000" // Pobieramy adres serwisu GPT albo ustawiamy lokalny.

    JDABuilder.createDefault(token) // Tworzymy konfiguracje klienta Discord na podstawie tokenu.
        .enableIntents(GatewayIntent.MESSAGE_CONTENT) // Wlaczamy dostep do tresci wiadomosci uzytkownikow.
        .addEventListeners(BotListener(GptClient(gptServiceUrl))) // Dodajemy listener z klientem do gpt-service.
        .build() // Uruchamiamy polaczenie bota z Discordem.
} // Konczymy funkcje main.

class BotListener(private val gptClient: GptClient) : ListenerAdapter() { // Listener reaguje na wiadomosci z Discorda.
    private val botScope = CoroutineScope(Dispatchers.IO) // Tworzymy zakres coroutines do obslugi wolniejszych zapytan HTTP.

    private val sklepData = mapOf( // Prosta lokalna mapa kategorii i produktow dla starych komend bota.
        "Magia" to listOf( // Kategoria produktu pasujaca do sklepu z zestaw_5.
            "Rozdzka ostrokrzew i pioro feniksa, 11 cali", // Produkt 1 z przykladowego sklepu.
            "Najnowszy model miotly: Blyskawica", // Produkt 2 z przykladowego sklepu.
            "Czekoladowa Zaba z karta", // Produkt 3 z przykladowego sklepu.
            "Kociolek cynowy, rozmiar standardowy", // Produkt 4 z przykladowego sklepu.
            "Peleryna Niewidka, kolekcja Insygniow Smierci", // Produkt 5 z przykladowego sklepu.
        ), // Konczymy liste produktow kategorii Magia.
    ) // Konczymy mape danych sklepu.

    override fun onMessageReceived(event: MessageReceivedEvent) { // Metoda wywoluje sie po kazdej wiadomosci widocznej dla bota.
        if (event.author.isBot) return // Ignorujemy boty, aby uniknac petli odpowiedzi.

        val messageText = event.message.contentRaw.trim() // Pobieramy surowy tekst wiadomosci i usuwamy spacje z brzegow.
        val channel = event.channel // Pobieramy kanal, na ktory bot ma odpisac.

        when { // Rozpoznajemy komende na podstawie tresci wiadomosci.
            messageText == "!kategorie" -> { // Komenda zwracajaca dostepne kategorie.
                val categoriesList = sklepData.keys.joinToString(separator = ", ") // Laczymy nazwy kategorii przecinkami.
                channel.sendMessage("Dostepne kategorie to: $categoriesList").queue() // Wysylamy odpowiedz na Discord.
            } // Konczymy obsluge !kategorie.

            messageText.startsWith("!produkty") -> { // Komenda zwracajaca produkty z podanej kategorii.
                val requestedCategory = messageText.removePrefix("!produkty").trim() // Usuwamy nazwe komendy i zostawiamy kategorie.
                if (requestedCategory.isBlank()) { // Sprawdzamy, czy uzytkownik podal nazwe kategorii.
                    channel.sendMessage("Podaj nazwe kategorii. Uzycie: !produkty [nazwa_kategorii]").queue() // Podpowiadamy skladnie.
                    return // Konczymy obsluge tej wiadomosci.
                } // Konczymy walidacje argumentu kategorii.

                val productsList = sklepData[requestedCategory] // Pobieramy produkty z mapy po nazwie kategorii.
                if (productsList == null) { // Jesli kategoria nie istnieje, zwracamy blad uzytkownikowi.
                    channel.sendMessage("Kategoria **$requestedCategory** nie istnieje. Wpisz !kategorie.").queue() // Informujemy o braku kategorii.
                    return // Konczymy obsluge tej wiadomosci.
                } // Konczymy obsluge nieznanej kategorii.

                val formattedProducts = productsList.joinToString(separator = "\n- ") // Formatujemy produkty jako liste Markdown.
                channel.sendMessage("Produkty w kategorii **$requestedCategory**:\n- $formattedProducts").queue() // Wysylamy liste produktow.
            } // Konczymy obsluge !produkty.

            messageText.startsWith("!gpt") -> { // Nowa komenda przekazujaca pytanie do serwisu GPT.
                val userQuestion = messageText.removePrefix("!gpt").trim() // Usuwamy prefiks komendy i zostawiamy pytanie.
                if (userQuestion.isBlank()) { // Sprawdzamy, czy po !gpt jest jakas tresc.
                    channel.sendMessage("Podaj pytanie. Uzycie: !gpt [tresc pytania]").queue() // Podpowiadamy uzycie komendy.
                    return // Konczymy obsluge pustej komendy.
                } // Konczymy walidacje pytania.

                channel.sendTyping().queue() // Pokazujemy na Discordzie, ze bot przygotowuje odpowiedz.
                botScope.launch { // Uruchamiamy zapytanie GPT asynchronicznie, aby nie blokowac kolejnych wiadomosci.
                    val answer = gptClient.ask(userQuestion) // Wysylamy pytanie do Pythonowego gpt-service.
                    channel.sendMessage(answer.take(1900)).queue() // Wysylamy odpowiedz, pilnujac limitu dlugosci Discorda.
                } // Konczymy asynchroniczna obsluge pytania GPT.
            } // Konczymy obsluge !gpt.
        } // Konczymy wybor komendy.
    } // Konczymy metode obslugi wiadomosci.
} // Konczymy klase listenera.

class GptClient(private val baseUrl: String) { // Klient HTTP odpowiedzialny za laczenie z gpt-service.
    private val httpClient = HttpClient(CIO) { // Tworzymy klienta Ktor z silnikiem CIO.
        install(ContentNegotiation) { // Instalujemy plugin, aby Ktor umial serializowac JSON.
            json(Json { ignoreUnknownKeys = true }) // Ignorujemy dodatkowe pola w odpowiedzi backendu.
        } // Konczymy konfiguracje ContentNegotiation.
    } // Konczymy tworzenie klienta HTTP.

    suspend fun ask(message: String): String { // Funkcja wysyla pytanie do endpointu /chat i zwraca sam tekst odpowiedzi.
        return try { // Obslugujemy potencjalne bledy sieci lub serializacji.
            val response: ChatResponse = httpClient.post("$baseUrl/chat") { // Wysylamy POST do Pythonowego serwisu.
                contentType(ContentType.Application.Json) // Ustawiamy naglowek Content-Type na JSON.
                setBody(ChatRequest(message = message)) // Ustawiamy cialo requestu z pytaniem uzytkownika.
            }.body() // Parsujemy odpowiedz JSON do klasy ChatResponse.
            response.answer // Zwracamy tekst odpowiedzi modelu.
        } catch (exception: Exception) { // Jesli cos pojdzie nie tak, nie wywalamy bota.
            "Nie udalo sie polaczyc z serwisem GPT. Sprawdz GPT_SERVICE_URL oraz dzialanie gpt-service." // Zwracamy komunikat dla Discorda.
        } // Konczymy try/catch.
    } // Konczymy funkcje ask.
} // Konczymy klienta GPT.

@Serializable // Adnotacja pozwala zamieniac obiekt na JSON.
data class ChatRequest(val message: String) // Model requestu wysylanego do /chat.

@Serializable // Adnotacja pozwala odczytywac JSON odpowiedzi.
data class ChatResponse( // Model odpowiedzi zwracanej przez gpt-service.
    val provider: String, // Nazwa providera, np. openai albo ollama.
    val model: String, // Nazwa modelu, ktory wygenerowal odpowiedz.
    val answer: String, // Wlasciwa odpowiedz dla uzytkownika.
) // Konczymy model ChatResponse.
