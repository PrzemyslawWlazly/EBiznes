Zadanie 5

# Zadanie 5 Frontend

✅ **3.0** W ramach projektu stworzono dwa komponenty: Produkty oraz Płatności. Komponent [Products.js](https://github.com/PrzemyslawWlazly/EBiznes/blob/main/zestaw_5/frontend/src/components/Products.js) pobiera dane o asortymencie, natomiast [Payments.js](https://github.com/PrzemyslawWlazly/EBiznes/blob/main/zestaw_5/frontend/src/components/Payments.js) wysyła dane o płatnościach do serwera.

✅ **3.5** Dodano komponent [Cart.js](https://github.com/PrzemyslawWlazly/EBiznes/blob/main/zestaw_5/frontend/src/components/Cart.js) (Koszyk) wraz z dedykowanym widokiem. Do nawigacji między podstronami wykorzystano bibliotekę `react-router-dom`, skonfigurowaną w pliku [App.js](https://github.com/PrzemyslawWlazly/EBiznes/blob/main/zestaw_5/frontend/src/App.js).

✅ **4.0** Dane pomiędzy wszystkimi komponentami (produkty, stan koszyka, suma płatności) są przesyłane za pomocą React Hooks oraz Context API, co zostało zaimplementowane w pliku [AppContext.js](https://github.com/PrzemyslawWlazly/EBiznes/blob/main/zestaw_5/frontend/src/context/AppContext.js).

✅ **4.5** Przygotowano skrypt [docker-compose.yml](https://github.com/PrzemyslawWlazly/EBiznes/blob/main/zestaw_5/docker-compose.yml), który automatycznie buduje i uruchamia aplikację serwerową (Go) oraz kliencką (React).
- [Link do obrazu Frontend](https://hub.docker.com/r/przemyslawwlazly/esy-floresy-frontend)
- [Link do obrazu Backend](https://hub.docker.com/r/przemyslawwlazly/esy-floresy-backend)

❌ **5.0** Aplikacja serwerowa w języku Go nie została wyposażona w nagłówki obsługujące CORS 

[Link do całego zadania 5](https://github.com/PrzemyslawWlazly/EBiznes/tree/main/zestaw_5)





[zestaw5.webm](https://github.com/user-attachments/assets/147207fc-ac36-4cb1-b5bc-7f114b63bda8)
