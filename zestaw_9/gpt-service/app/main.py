import asyncio  # Importujemy asyncio, aby ograniczyc rownolegle zapytania do lokalnej Ollamy.
import os  # Importujemy modul os, aby odczytywac zmienne srodowiskowe aplikacji.
import random  # Importujemy random, aby losowac rozne otwarcia i zamkniecia rozmowy.
from pathlib import Path  # Importujemy Path, aby bezpiecznie budowac sciezki do plikow statycznych.
from typing import Literal  # Importujemy Literal, aby ograniczyc dozwolone nazwy providerow AI.

import httpx  # Importujemy httpx, czyli asynchronicznego klienta HTTP do OpenAI i Ollamy.
from fastapi import FastAPI, HTTPException  # Importujemy FastAPI oraz wyjatki HTTP zwracane klientowi.
from fastapi.middleware.cors import CORSMiddleware  # Importujemy middleware CORS dla zapytan z frontendu.
from fastapi.staticfiles import StaticFiles  # Importujemy obsluge statycznych plikow HTML/CSS/JS.
from pydantic import BaseModel, Field  # Importujemy modele walidacji danych wejsciowych i wyjsciowych.


Provider = Literal["openai", "ollama", "local"]  # Definiujemy typ providera: OpenAI, Ollama albo lokalna odpowiedz sklepowa.


class ChatRequest(BaseModel):  # Model opisuje dane, ktore frontend lub bot wysyla do endpointu /chat.
    message: str = Field(min_length=1, max_length=4000)  # Wiadomosc musi istniec i miec rozsadny limit dlugosci.
    provider: Provider | None = None  # Opcjonalnie pozwalamy wymusic OpenAI albo Ollama dla konkretnego zapytania.
    model: str | None = None  # Opcjonalnie pozwalamy wskazac konkretny model AI.


class ChatResponse(BaseModel):  # Model opisuje odpowiedz zwracana do frontendu lub bota Discord.
    provider: Provider  # Zwracamy informacje, czy odpowiedzial OpenAI czy Ollama.
    model: str  # Zwracamy nazwe modelu, ktory wygenerowal odpowiedz.
    opening: str  # Zwracamy wylosowane otwarcie rozmowy dla punktu 4.0.
    answer: str  # Zwracamy wlasciwa tresc odpowiedzi dla uzytkownika.
    closing: str  # Zwracamy wylosowane zamkniecie rozmowy dla punktu 4.0.
    topic_allowed: bool  # Informujemy, czy pytanie przeszlo filtr tematyczny sklepu dla punktu 4.5.


class Product(BaseModel):  # Model produktu uzywany przez endpoint /products i prompt sklepu.
    id: int  # Identyfikator produktu z przykladowego sklepu.
    name: str  # Nazwa produktu wyswietlana we frontendzie i przekazywana do GPT.
    price: float  # Cena produktu w PLN.


app = FastAPI(  # Tworzymy glowna aplikacje FastAPI.
    title="Zestaw 9 GPT Service",  # Ustawiamy tytul widoczny np. w dokumentacji /docs.
    description="Osobny serwis backendowy do laczenia aplikacji z GPT lub lokalnym modelem Ollama.",  # Opis API.
    version="0.1.0",  # Wersja aplikacji pomocna przy dokumentacji i rozwoju projektu.
)  # Konczymy konfiguracje instancji FastAPI.

app.add_middleware(  # Dodajemy middleware, aby przegladarka mogla laczyc sie z API.
    CORSMiddleware,  # Wskazujemy typ middleware odpowiedzialny za CORS.
    allow_origins=os.getenv("CORS_ORIGINS", "*").split(","),  # Pobieramy dozwolone domeny albo pozwalamy wszystkim.
    allow_credentials=False,  # Nie uzywamy ciasteczek ani sesji, wiec wylaczamy credentials.
    allow_methods=["*"],  # Pozwalamy na wszystkie metody HTTP potrzebne frontendowi.
    allow_headers=["*"],  # Pozwalamy na naglowki, w tym Content-Type: application/json.
)  # Konczymy konfiguracje CORS.


OLLAMA_REQUEST_LOCK = asyncio.Lock()  # Tworzymy globalna blokade, aby lokalna Ollama dostawala jedno pytanie naraz.


SHOP_PRODUCTS = [  # Lista produktow wzieta koncepcyjnie z lepszego sklepu z zestaw_5.
    Product(id=1, name="Rozdzka ostrokrzew i pioro feniksa, 11 cali", price=150.00),  # Pierwszy produkt.
    Product(id=2, name="Najnowszy model miotly: Blyskawica", price=1200.00),  # Drugi produkt.
    Product(id=3, name="Czekoladowa Zaba z karta", price=5.50),  # Trzeci produkt.
    Product(id=4, name="Kociolek cynowy, rozmiar standardowy", price=45.00),  # Czwarty produkt.
    Product(id=5, name="Peleryna Niewidka, kolekcja Insygniow Smierci", price=9999.99),  # Piaty produkt.
]  # Konczymy liste produktow dostepnych dla frontendu i GPT.


PRODUCT_ALIASES = {  # Slownik aliasow pomaga rozpoznac produkt po fragmencie pytania uzytkownika.
    "rozdzka": SHOP_PRODUCTS[0],  # Alias bez polskich znakow dla rozdzki.
    "różdżka": SHOP_PRODUCTS[0],  # Alias z polskimi znakami dla rozdzki.
    "miotla": SHOP_PRODUCTS[1],  # Alias bez polskiego znaku dla miotly.
    "miotła": SHOP_PRODUCTS[1],  # Alias z polskim znakiem dla miotly.
    "blyskawica": SHOP_PRODUCTS[1],  # Alias bez polskiego znaku dla konkretnej miotly.
    "błyskawica": SHOP_PRODUCTS[1],  # Alias z polskim znakiem dla konkretnej miotly.
    "czekoladowa": SHOP_PRODUCTS[2],  # Alias po pierwszym slowie nazwy czekoladowej zaby.
    "zaba": SHOP_PRODUCTS[2],  # Alias bez polskiego znaku dla zaby.
    "żaba": SHOP_PRODUCTS[2],  # Alias z polskim znakiem dla zaby.
    "kociolek": SHOP_PRODUCTS[3],  # Alias bez polskiego znaku dla kociolka.
    "kociołek": SHOP_PRODUCTS[3],  # Alias z polskim znakiem dla kociolka.
    "peleryna": SHOP_PRODUCTS[4],  # Alias po pierwszym slowie nazwy peleryny.
    "niewidka": SHOP_PRODUCTS[4],  # Alias po drugim slowie nazwy peleryny.
}  # Konczymy slownik aliasow produktow.


CONVERSATION_OPENINGS = [  # Lista 5 roznych otwarc rozmowy wymagana w punkcie 4.0.
    "Dzień dobry, już sprawdzam to w naszym sklepie.",  # Otwarcie numer 1.
    "Cześć, chętnie pomogę z tym pytaniem.",  # Otwarcie numer 2.
    "Jasne, zerknijmy na dostępny asortyment.",  # Otwarcie numer 3.
    "Witaj w asystencie sklepu, oto co mogę podpowiedzieć.",  # Otwarcie numer 4.
    "Już pomagam i odpowiadam na podstawie danych sklepu.",  # Otwarcie numer 5.
]  # Konczymy liste otwarc rozmowy.


CONVERSATION_CLOSINGS = [  # Lista 5 roznych zamkniec rozmowy wymagana w punkcie 4.0.
    "Czy mogę pomóc w wyborze czegoś jeszcze?",  # Zamkniecie numer 1.
    "Daj znać, jeśli chcesz porównać produkty.",  # Zamkniecie numer 2.
    "W razie potrzeby mogę też doradzić prezent.",  # Zamkniecie numer 3.
    "Chętnie odpowiem na kolejne pytanie o sklep.",  # Zamkniecie numer 4.
    "Możesz zapytać mnie też o cenę albo zastosowanie produktu.",  # Zamkniecie numer 5.
]  # Konczymy liste zamkniec rozmowy.


SHOP_TOPIC_KEYWORDS = {  # Zestaw slow kluczowych okreslajacych, czy pytanie dotyczy sklepu dla punktu 4.5.
    "sklep",  # Slowo ogolne dotyczace sklepu.
    "produkt",  # Slowo ogolne dotyczace produktu.
    "produkty",  # Liczba mnoga slowa produkt.
    "asortyment",  # Slowo dotyczace oferty sklepu.
    "oferta",  # Slowo dotyczace oferty sklepu.
    "cena",  # Slowo dotyczace ceny produktu.
    "koszt",  # Slowo dotyczace kosztu produktu.
    "kupic",  # Slowo dotyczace zakupu bez polskich znakow.
    "kupić",  # Slowo dotyczace zakupu z polskim znakiem.
    "dostepna",  # Slowo dotyczace dostepnosci bez polskich znakow.
    "dostępna",  # Slowo dotyczace dostepnosci z polskim znakiem.
    "dostepny",  # Slowo dotyczace dostepnosci produktu w rodzaju meskim.
    "dostępny",  # Slowo dotyczace dostepnosci produktu w rodzaju meskim z polskim znakiem.
    "prezent",  # Slowo dotyczace doradzania produktu na prezent.
    "polecasz",  # Slowo czesto uzywane przy pytaniu o rekomendacje produktu.
    "porownaj",  # Slowo dotyczace porownania produktow bez polskich znakow.
    "porównaj",  # Slowo dotyczace porownania produktow z polskim znakiem.
    "rozdzka",  # Nazwa produktu bez polskich znakow.
    "różdżka",  # Nazwa produktu z polskimi znakami.
    "miotla",  # Nazwa produktu bez polskich znakow.
    "miotła",  # Nazwa produktu z polskim znakiem.
    "blyskawica",  # Nazwa konkretnego produktu bez polskich znakow.
    "błyskawica",  # Nazwa konkretnego produktu z polskim znakiem.
    "czekoladowa",  # Czesc nazwy produktu.
    "zaba",  # Czesc nazwy produktu bez polskiego znaku.
    "żaba",  # Czesc nazwy produktu z polskim znakiem.
    "kociolek",  # Nazwa produktu bez polskiego znaku.
    "kociołek",  # Nazwa produktu z polskim znakiem.
    "peleryna",  # Nazwa produktu.
    "niewidka",  # Czesc nazwy produktu.
}  # Konczymy zestaw slow kluczowych filtra sklepowego.


SYSTEM_PROMPT = (  # Prompt systemowy ustawia role asystenta przed pytaniem uzytkownika.
    "Jestes pomocnym asystentem sklepu internetowego. "  # Wyjasniamy modelowi, ze ma odpowiadac jako asystent sklepu.
    "Odpowiadaj zwiezle, po polsku i w sposob przyjazny dla klienta. "  # Okreslamy styl odpowiedzi.
    "Odpowiadaj tylko na pytania zwiazane ze sklepem, produktami, cenami i asortymentem. "  # Wzmacniamy filtr tematyczny takze w prompcie.
    "Nie dodawaj powitania ani pozegnania, bo serwis backendowy doda je osobno. "  # Zapobiegamy podwojnym otwarciom i zamknieciom.
    "Jesli pytanie dotyczy asortymentu, korzystaj z tej listy produktow: "  # Dodajemy kontekst sklepu.
    + "; ".join(f"{product.name} ({product.price:.2f} PLN)" for product in SHOP_PRODUCTS)  # Dopisujemy produkty.
)  # Konczymy budowanie promptu systemowego.


def is_shop_related(message: str) -> bool:  # Funkcja sprawdza, czy pytanie dotyczy sklepu i moze trafic do GPT.
    normalized_message = message.lower()  # Zamieniamy tekst na male litery, aby latwiej szukac slow kluczowych.
    return any(keyword in normalized_message for keyword in SHOP_TOPIC_KEYWORDS)  # Zwracamy True, gdy znaleziono slowo sklepowe.


def build_chat_response(provider: Provider, model: str, raw_answer: str, topic_allowed: bool = True) -> ChatResponse:  # Funkcja sklada finalna odpowiedz z otwarciem i zamknieciem.
    opening = random.choice(CONVERSATION_OPENINGS)  # Losujemy jedno z pieciu otwarc rozmowy.
    closing = random.choice(CONVERSATION_CLOSINGS)  # Losujemy jedno z pieciu zamkniec rozmowy.
    answer = f"{opening}\n\n{raw_answer.strip()}\n\n{closing}"  # Laczymy otwarcie, odpowiedz modelu i zamkniecie w jeden tekst.
    return ChatResponse(provider=provider, model=model, opening=opening, answer=answer, closing=closing, topic_allowed=topic_allowed)  # Zwracamy odpowiedz z polami pomocniczymi.


def build_rejected_topic_response(provider: Provider, model: str) -> ChatResponse:  # Funkcja buduje odpowiedz dla pytan spoza tematyki sklepu.
    raw_answer = (  # Przygotowujemy tresc bez pytania GPT, aby filtr byl szybki i deterministyczny.
        "Mogę odpowiadać tylko na pytania związane ze sklepem, produktami, cenami, "
        "dostępnością i doborem asortymentu. Zadaj proszę pytanie dotyczące naszego sklepu."
    )  # Konczymy komunikat odrzucenia pytania.
    return build_chat_response(provider=provider, model=model, raw_answer=raw_answer, topic_allowed=False)  # Zwracamy odpowiedz z flaga odrzucenia.


def build_local_shop_answer(message: str) -> str | None:  # Funkcja probuje szybko odpowiedziec z danych sklepu bez czekania na wolna Ollame.
    normalized_message = message.lower()  # Zamieniamy pytanie na male litery, aby latwiej szukac produktu.
    wants_catalog = any(word in normalized_message for word in ["asortyment", "oferta", "produkty", "lista"])  # Sprawdzamy pytanie o liste produktow.
    if wants_catalog:  # Jesli uzytkownik pyta o caly asortyment, odpowiadamy lista produktow.
        product_lines = [f"- {product.name}: {product.price:.2f} PLN" for product in SHOP_PRODUCTS]  # Budujemy linie z nazwa i cena.
        return "Dostępny asortyment sklepu:\n" + "\n".join(product_lines)  # Zwracamy gotowa liste produktow.

    for alias, product in PRODUCT_ALIASES.items():  # Przechodzimy po aliasach, aby znalezc produkt w pytaniu.
        if alias in normalized_message:  # Jesli alias znajduje sie w tresci pytania, mamy pasujacy produkt.
            return f"{product.name} jest dostępny w sklepie i kosztuje {product.price:.2f} PLN."  # Zwracamy szybka odpowiedz sklepowa.

    return None  # Jesli nie rozpoznalismy prostego pytania, pozwalamy przejsc do Ollamy.


def choose_provider(requested_provider: Provider | None) -> Provider:  # Funkcja wybiera silnik AI dla zapytania.
    if requested_provider:  # Jesli klient jawnie podal provider, uzywamy tej wartosci.
        return requested_provider  # Zwracamy provider z zapytania.
    if os.getenv("OPENAI_API_KEY"):  # Jesli istnieje klucz OpenAI, domyslnie uzywamy OpenAI.
        return "openai"  # Zwracamy provider OpenAI.
    return "ollama"  # Bez klucza OpenAI przechodzimy na lokalna Ollame.


def choose_model(provider: Provider, requested_model: str | None) -> str:  # Funkcja wybiera model jeszcze przed ewentualnym filtrem tematycznym.
    if requested_model:  # Jesli klient podal konkretny model, szanujemy ten wybor.
        return requested_model  # Zwracamy model z requestu.
    if provider == "openai":  # Dla OpenAI uzywamy zmiennej OPENAI_MODEL albo wartosci domyslnej.
        return os.getenv("OPENAI_MODEL", "gpt-4o-mini")  # Zwracamy model OpenAI.
    return os.getenv("OLLAMA_MODEL", "qwen2.5:0.5b")  # Dla Ollamy zwracamy bardzo maly model pokazowy.


@app.get("/health")  # Endpoint kontrolny do sprawdzania, czy serwis dziala.
def health() -> dict[str, str]:  # Funkcja zwraca prosty slownik statusu.
    return {"status": "ok"}  # Zwracamy odpowiedz pozytywna.


@app.get("/products", response_model=list[Product])  # Endpoint udostepnia produkty dla frontendu.
def products() -> list[Product]:  # Funkcja zwraca liste modeli Product.
    return SHOP_PRODUCTS  # Oddajemy statyczna liste produktow.


@app.get("/conversation-parts")  # Endpoint pokazuje jawnie listy otwarc i zamkniec dla punktu 4.0.
def conversation_parts() -> dict[str, list[str]]:  # Funkcja zwraca slownik z dwiema listami tekstow.
    return {"openings": CONVERSATION_OPENINGS, "closings": CONVERSATION_CLOSINGS}  # Zwracamy wszystkie warianty rozmowy.


@app.get("/topic-filter")  # Endpoint pokazuje slowa kluczowe filtra tematycznego dla punktu 4.5.
def topic_filter() -> dict[str, list[str]]:  # Funkcja zwraca liste slow kluczowych akceptowanych przez filtr.
    return {"allowed_keywords": sorted(SHOP_TOPIC_KEYWORDS)}  # Sortujemy slowa, aby odpowiedz byla stabilna i czytelna.


@app.post("/chat", response_model=ChatResponse)  # Glowny endpoint do rozmowy z GPT/Ollama.
async def chat(request: ChatRequest) -> ChatResponse:  # Funkcja odbiera zwalidowane pytanie uzytkownika.
    provider = choose_provider(request.provider)  # Wybieramy provider na podstawie requestu i zmiennych srodowiskowych.
    model = choose_model(provider=provider, requested_model=request.model)  # Ustalamy model przed filtrem, aby odpowiedz odrzucona tez miala model.

    if not is_shop_related(request.message):  # Jesli pytanie nie dotyczy sklepu, nie wysylamy go do GPT.
        return build_rejected_topic_response(provider=provider, model=model)  # Zwracamy kontrolowana odpowiedz filtra 4.5.

    local_answer = build_local_shop_answer(request.message)  # Sprawdzamy, czy da sie odpowiedziec natychmiast z danych sklepu.
    if local_answer:  # Jesli lokalna odpowiedz istnieje, nie czekamy na wolny model.
        return build_chat_response(provider="local", model="shop-catalog", raw_answer=local_answer)  # Zwracamy szybka odpowiedz z katalogu sklepu.

    if provider == "openai":  # Jesli providerem jest OpenAI, kierujemy zapytanie do OpenAI.
        return await ask_openai(request)  # Czekamy na odpowiedz OpenAI i zwracamy ja klientowi.
    return await ask_ollama(request)  # W przeciwnym razie kierujemy zapytanie do Ollamy.


async def ask_openai(request: ChatRequest) -> ChatResponse:  # Funkcja wysyla zapytanie do API OpenAI.
    api_key = os.getenv("OPENAI_API_KEY")  # Pobieramy klucz API ze zmiennych srodowiskowych.
    if not api_key:  # Jesli nie ma klucza, nie mozemy skorzystac z OpenAI.
        raise HTTPException(  # Zwracamy czytelny blad HTTP.
            status_code=503,  # Kod 503 oznacza, ze usluga zalezna jest niedostepna.
            detail="Brak zmiennej srodowiskowej OPENAI_API_KEY dla providera openai.",  # Tresc bledu.
        )  # Konczymy tworzenie wyjatku.

    model = request.model or os.getenv("OPENAI_MODEL", "gpt-4o-mini")  # Wybieramy model z requestu/env albo domyslny.
    payload = {  # Budujemy JSON zgodny z endpointem chat completions.
        "model": model,  # Przekazujemy nazwe modelu.
        "messages": [  # Lista wiadomosci tworzaca kontekst rozmowy.
            {"role": "system", "content": SYSTEM_PROMPT},  # Wiadomosc systemowa z instrukcjami sklepu.
            {"role": "user", "content": request.message},  # Wiadomosc uzytkownika z frontendu lub Discorda.
        ],  # Konczymy liste wiadomosci.
        "temperature": 0.4,  # Ustawiamy umiarkowana kreatywnosc odpowiedzi.
    }  # Konczymy payload dla OpenAI.

    async with httpx.AsyncClient(timeout=60) as client:  # Tworzymy klienta HTTP z limitem czasu.
        response = await client.post(  # Wysylamy asynchroniczne zapytanie POST.
            "https://api.openai.com/v1/chat/completions",  # Oficjalny endpoint OpenAI.
            headers={  # Naglowki wymagane przez API.
                "Authorization": f"Bearer {api_key}",  # Autoryzacja kluczem API.
                "Content-Type": "application/json",  # Informujemy, ze wysylamy JSON.
            },  # Konczymy naglowki.
            json=payload,  # Przekazujemy przygotowany payload.
        )  # Konczymy zapytanie POST.

    if response.status_code >= 400:  # Jesli OpenAI zwrocilo blad, przekazujemy go dalej.
        raise HTTPException(status_code=response.status_code, detail=response.text)  # Zwracamy blad klientowi.

    data = response.json()  # Parsujemy odpowiedz JSON z OpenAI.
    raw_answer = data["choices"][0]["message"]["content"].strip()  # Wyciagamy tekst odpowiedzi modelu bez otwarcia i zamkniecia.
    return build_chat_response(provider="openai", model=model, raw_answer=raw_answer)  # Zwracamy odpowiedz uzupelniona o 4.0.


async def ask_ollama(request: ChatRequest) -> ChatResponse:  # Funkcja wysyla zapytanie do lokalnej Ollamy.
    base_url = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")  # Pobieramy adres Ollamy albo domyslny.
    model = request.model or os.getenv("OLLAMA_MODEL", "qwen2.5:0.5b")  # Pobieramy model Ollamy albo domyslnie bardzo maly model pokazowy.
    timeout = float(os.getenv("OLLAMA_TIMEOUT", "300"))  # Ustawiamy dluzszy timeout, bo lokalny model moze startowac wolno.
    num_predict = int(os.getenv("OLLAMA_NUM_PREDICT", "120"))  # Ograniczamy dlugosc odpowiedzi, aby demo dzialalo szybciej.
    payload = {  # Budujemy payload zgodny z endpointem /api/chat Ollamy.
        "model": model,  # Przekazujemy nazwe lokalnego modelu.
        "stream": False,  # Wylaczamy streaming, aby dostac jedna pelna odpowiedz.
        "messages": [  # Lista wiadomosci dla modelu lokalnego.
            {"role": "system", "content": SYSTEM_PROMPT},  # Kontekst systemowy asystenta sklepu.
            {"role": "user", "content": request.message},  # Pytanie uzytkownika.
        ],  # Konczymy liste wiadomosci.
        "options": {  # Opcje generowania odpowiedzi przez Ollame.
            "temperature": 0.2,  # Niska temperatura daje prostsze i bardziej przewidywalne odpowiedzi.
            "num_predict": num_predict,  # Limitujemy liczbe generowanych tokenow, aby uniknac dlugiego czekania.
        },  # Konczymy opcje Ollamy.
    }  # Konczymy payload Ollamy.

    async with OLLAMA_REQUEST_LOCK:  # Kolejkujemy zapytania, aby kilka pytan z Discorda nie przeciążalo malego modelu.
        async with httpx.AsyncClient(timeout=timeout) as client:  # Tworzymy klienta HTTP z dluzszym timeoutem dla modelu lokalnego.
            try:  # Proba polaczenia moze sie nie udac, jesli Ollama nie dziala.
                response = await client.post(f"{base_url}/api/chat", json=payload)  # Wysylamy request do Ollamy.
            except httpx.ConnectError as exc:  # Obslugujemy blad polaczenia z lokalnym serwerem.
                raise HTTPException(  # Zwracamy czytelny komunikat dla frontendu.
                    status_code=503,  # Kod 503 oznacza niedostepna usluge zalezna.
                    detail="Nie mozna polaczyc sie z Ollama. Uruchom ollama serve albo ustaw OPENAI_API_KEY.",  # Instrukcja naprawy.
                ) from exc  # Zachowujemy oryginalny wyjatek jako przyczyne.
            except httpx.TimeoutException as exc:  # Obslugujemy sytuacje, gdy model lokalny odpowiada zbyt dlugo.
                raise HTTPException(  # Zwracamy kontrolowany blad zamiast Internal Server Error.
                    status_code=504,  # Kod 504 oznacza timeout bramki/uslugi zaleznej.
                    detail="Ollama odpowiada zbyt dlugo. Poczekaj na zaladowanie modelu albo zadaj krotsze pytanie.",  # Podpowiadamy rozwiazanie.
                ) from exc  # Zachowujemy oryginalny timeout jako przyczyne.
            except httpx.RemoteProtocolError as exc:  # Obslugujemy rozlaczenie Ollamy bez poprawnej odpowiedzi HTTP.
                raise HTTPException(  # Zwracamy kontrolowany blad zamiast stack trace i 500.
                    status_code=503,  # Kod 503 pasuje do chwilowej niedostepnosci lokalnego modelu.
                    detail="Ollama przerwala odpowiedz. Sprobuj ponownie za chwile; zapytania sa kolejkowane pojedynczo.",  # Komunikat dla demo.
                ) from exc  # Zachowujemy oryginalny blad protokolu.
            except httpx.RequestError as exc:  # Obslugujemy pozostale bledy klienta HTTP.
                raise HTTPException(  # Zwracamy kontrolowany blad zamiast wewnetrznego bledu serwera.
                    status_code=503,  # Kod 503 informuje, ze zalezna usluga chwilowo nie dziala.
                    detail="Nie udalo sie pobrac odpowiedzi z Ollamy. Sprobuj ponownie za chwile.",  # Krotki komunikat dla uzytkownika.
                ) from exc  # Zachowujemy oryginalny blad requestu.

    if response.status_code >= 400:  # Jesli Ollama zwrocila blad HTTP, przekazujemy go klientowi.
        raise HTTPException(status_code=response.status_code, detail=response.text)  # Zwracamy status i tresc bledu.

    data = response.json()  # Parsujemy odpowiedz JSON z Ollamy.
    raw_answer = data["message"]["content"].strip()  # Wyciagamy tekst odpowiedzi modelu bez otwarcia i zamkniecia.
    return build_chat_response(provider="ollama", model=model, raw_answer=raw_answer)  # Zwracamy odpowiedz uzupelniona o 4.0.


STATIC_DIR = Path(__file__).resolve().parent.parent / "static"  # Wyliczamy sciezke do katalogu static niezaleznie od cwd.
app.mount("/", StaticFiles(directory=STATIC_DIR, html=True), name="static")  # Montujemy frontend JS pod adresem glownym.
