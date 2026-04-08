#!/bin/bash
# Skrypt do automatycznej weryfikacji wszystkich punktów zadania Ebiznes Zestaw 2

# --- TEST PUNKTU 1 & 2: DODAWANIE PRODUKTU (POST) ---
# Wysyłamy żądanie POST z nowym produktem w formacie JSON do endpointu /products/
curl -X POST -H "Content-Type: application/json" -d '{"id":3,"name":"Klawiatura","price":200.0}' http://localhost:8080/products/
# Pobieramy ponownie listę, aby sprawdzić czy Klawiatura o ID 3 tam jest
curl -X GET http://localhost:8080/products/

# --- TEST PUNKTU 3: KATEGORIE (CRUD) ---
# Wysyłamy żądanie GET, aby pobrać domyślne kategorie (Elektronika, Akcesoria)
curl -X GET http://localhost:8080/categories/
# Wysyłamy żądanie POST, aby dodać nową kategorię "Oprogramowanie"
curl -X POST -H "Content-Type: application/json" -d '{"id":3,"name":"Software"}' http://localhost:8080/categories/
# Sprawdzamy, czy kategoria o ID 3 została poprawnie dodana
curl -X GET http://localhost:8080/categories/3

# --- TEST PUNKTU 3: KOSZYK (CRUD) ---
# Sprawdzamy obecny stan koszyka (powinien mieć jeden domyślny element)
curl -X GET http://localhost:8080/cart/
# Dodajemy produkt do koszyka (np. 10 sztuk produktu o ID 2)
curl -X POST -H "Content-Type: application/json" -d '{"id":2,"productId":2,"quantity":10}' http://localhost:8080/cart/
# Pobieramy koszyk ponownie, aby potwierdzić dodanie elementu
curl -X GET http://localhost:8080/cart/

# --- TEST PUNKTU 5: CORS (Nagłówki bezpieczeństwa) ---
# Wykonujemy zapytanie OPTIONS z nagłówkiem Origin, aby sprawdzić czy serwer zezwala na dostęp
# Flaga -i służy do wyświetlenia nagłówków HTTP (HTTP Headers) w odpowiedzi
curl -i -X OPTIONS -H "Origin: http://localhost:3000" -H "Access-Control-Request-Method: POST" http://localhost:8080/products/
