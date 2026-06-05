FROM python:3.12-slim
# Uzywamy lekkiego obrazu Pythona 3.12 jako podstawy serwisu FastAPI.

WORKDIR /app
# Ustawiamy katalog roboczy w kontenerze na /app.

COPY requirements.txt .
# Kopiujemy najpierw requirements.txt, aby Docker mogl cache'owac instalacje zaleznosci.

RUN pip install --no-cache-dir -r requirements.txt
# Instalujemy biblioteki Pythona bez zapisywania cache pip w obrazie.

COPY app ./app
# Kopiujemy kod backendu FastAPI do kontenera.

COPY static ./static
# Kopiujemy statyczny frontend HTML/CSS/JS do kontenera.

EXPOSE 8000
# Informujemy, ze aplikacja nasluchuje na porcie 8000.

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
# Uruchamiamy serwer Uvicorn dostepny z zewnatrz kontenera.
