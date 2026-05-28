// Deklarujemy funkcję reportWebVitals, która przyjmuje jeden argument: funkcję zwrotną (callback)
const reportWebVitals = onPerfEntry => {
  // Sprawdzamy, czy podano funkcję zwrotną
  // POPRAWKA DLA SONARCLOUD: Zamiast "instanceof Function" używamy sprawdzenia typu "typeof"
  if (onPerfEntry && typeof onPerfEntry === 'function') {
    // Dynamicznie importujemy paczkę "web-vitals" (załaduje się tylko wtedy, gdy ten kod się uruchomi)
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      // Wywołujemy pomiar Cumulative Layout Shift (przesunięcia interfejsu podczas ładowania)
      getCLS(onPerfEntry);
      // Wywołujemy pomiar First Input Delay (czas reakcji na pierwsze kliknięcie)
      getFID(onPerfEntry);
      // Wywołujemy pomiar First Contentful Paint (czas wyrenderowania pierwszego kawałka treści)
      getFCP(onPerfEntry);
      // Wywołujemy pomiar Largest Contentful Paint (czas wyrenderowania największego obrazka/tekstu)
      getLCP(onPerfEntry);
      // Wywołujemy pomiar Time to First Byte (czas oczekiwania na odpowiedź serwera backendowego)
      getTTFB(onPerfEntry);
    });
  }
};

// Eksportujemy funkcję jako domyślną z tego pliku, aby można było ją zaimportować w index.js
export default reportWebVitals;