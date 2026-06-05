# GPT service

Osobny serwis backendowy w Pythonie dla punktu 3.0. Udostepnia endpoint `POST /chat`,
ktory przekazuje wiadomosc uzytkownika do OpenAI albo lokalnej Ollamy.

## Uruchomienie lokalne

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Frontend bedzie dostepny pod:

```bash
http://localhost:8000/
```

Domyslnie serwis uzywa Ollamy:

```bash
ollama serve
ollama pull qwen2.5:0.5b
```

Domyslnie aplikacja uzywa bardzo malego modelu `qwen2.5:0.5b`, zeby projekt pokazowy odpowiadal szybciej.

Mozna tez uzyc OpenAI:

```bash
export OPENAI_API_KEY=...
export OPENAI_MODEL=gpt-4o-mini
```

## Przykladowe zapytanie

```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Pomoz mi wybrac laptop do pracy"}'
```

Odpowiedz:

```json
{
  "provider": "ollama",
  "model": "llama3.2",
  "answer": "..."
}
```

## Otwarcia i zamkniecia rozmowy

Punkt 4.0 jest realizowany przez backend. Serwis ma 5 gotowych otwarc oraz 5 gotowych zamkniec,
ktore sa losowane przy kazdej odpowiedzi.

Mozna je podejrzec komenda:

```bash
curl http://localhost:8000/conversation-parts
```

## Filtr tematyczny sklepu

Punkt 4.5 jest realizowany przed wyslaniem pytania do modelu. Backend sprawdza, czy pytanie zawiera
slowa zwiazane ze sklepem, produktem, cena, dostepnoscia albo konkretnym asortymentem.

Lista slow kluczowych:

```bash
curl http://localhost:8000/topic-filter
```

Pytanie spoza tematyki sklepu zwroci odpowiedz z polem:

```json
{
  "topic_allowed": false
}
```
