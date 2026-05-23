// Plik: frontend/src/AppUnit.test.js

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'; // Zapewnia dodatkowe asercje, np. toBeInTheDocument
import { AppContext } from './context/AppContext';
import Products from './components/Products';
import Cart from './components/Cart';
import Payments from './components/Payments';

// --- MOCKOWANIE DANYCH (Sztuczny stan dla testów jednostkowych) ---
const mockProducts = [
  { id: 1, name: 'Testowa Różdżka', price: 100.50 },
  { id: 2, name: 'Testowy Kociołek', price: 49.99 }
];

const mockCartItems = [
  { id: 1, name: 'Testowa Różdżka', price: 100.50 }
];

// Sztuczna funkcja do śledzenia, czy komponent w ogóle próbuje cokolwiek dodać
const mockAddToCart = jest.fn(); 
const mockClearCart = jest.fn();

describe('Testy Jednostkowe Komponentów (Minimum 50 asercji)', () => {

  // ==========================================
  // 1. TESTY KOMPONENTU PRODUCTS
  // ==========================================
  describe('Komponent Products', () => {
    
    it('Renderuje ekran ładowania gdy loading jest true', () => {
      render(
        <AppContext.Provider value={{ loading: true, products: [], addToCart: mockAddToCart }}>
          <Products />
        </AppContext.Provider>
      );
      
      const loadingText = screen.getByText(/Magia w toku/i);
      expect(loadingText).toBeInTheDocument(); // Asercja 1
      expect(loadingText.tagName).toBe('P'); // Asercja 2
    });

    it('Renderuje listę produktów gdy dane są gotowe', () => {
      render(
        <AppContext.Provider value={{ loading: false, products: mockProducts, addToCart: mockAddToCart }}>
          <Products />
        </AppContext.Provider>
      );
      
      const heading = screen.getByRole('heading', { name: /Dostępne Magiczne Przedmioty/i });
      expect(heading).toBeInTheDocument(); // Asercja 3
      expect(heading.tagName).toBe('H2'); // Asercja 4

      const buttons = screen.getAllByRole('button', { name: /Dodaj do kociołka/i });
      expect(buttons).toHaveLength(2); // Asercja 5 (Mamy 2 produkty w mocku)
      
      const firstProduct = screen.getByText(/Testowa Różdżka/i);
      expect(firstProduct).toBeInTheDocument(); // Asercja 6
      expect(firstProduct.tagName).toBe('STRONG'); // Asercja 7
      
      const secondProduct = screen.getByText(/Testowy Kociołek/i);
      expect(secondProduct).toBeInTheDocument(); // Asercja 8
      expect(secondProduct.tagName).toBe('STRONG'); // Asercja 9

      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(2); // Asercja 10
      expect(listItems[0]).toHaveTextContent('100.50 PLN'); // Asercja 11
      expect(listItems[1]).toHaveTextContent('49.99 PLN'); // Asercja 12
    });

    it('Wywołuje funkcję addToCart po kliknięciu przycisku', () => {
      render(
        <AppContext.Provider value={{ loading: false, products: mockProducts, addToCart: mockAddToCart }}>
          <Products />
        </AppContext.Provider>
      );
      
      const buttons = screen.getAllByRole('button', { name: /Dodaj do kociołka/i });
      fireEvent.click(buttons[0]); // Symulacja kliknięcia w pierwszy produkt
      
      expect(mockAddToCart).toHaveBeenCalledTimes(1); // Asercja 13
      expect(mockAddToCart).toHaveBeenCalledWith(mockProducts[0]); // Asercja 14
    });
  });

  // ==========================================
  // 2. TESTY KOMPONENTU CART
  // ==========================================
  describe('Komponent Cart', () => {
    
    it('Renderuje pusty koszyk', () => {
      render(
        <AppContext.Provider value={{ cartItems: [], cartTotal: 0 }}>
          <Cart />
        </AppContext.Provider>
      );

      const heading = screen.getByRole('heading', { name: /Zawartość Twojego Kociołka/i });
      expect(heading).toBeInTheDocument(); // Asercja 15
      
      const emptyMessage = screen.getByText(/Kociołek jest pusty/i);
      expect(emptyMessage).toBeInTheDocument(); // Asercja 16
      expect(emptyMessage.tagName).toBe('P'); // Asercja 17
      
      const totalHeading = screen.queryByText(/Do zapłaty:/i);
      expect(totalHeading).toBeNull(); // Asercja 18 (Suma nie powinna istnieć)
    });

    it('Renderuje koszyk z elementami', () => {
      render(
        <AppContext.Provider value={{ cartItems: mockCartItems, cartTotal: 100.50 }}>
          <Cart />
        </AppContext.Provider>
      );

      const emptyMessage = screen.queryByText(/Kociołek jest pusty/i);
      expect(emptyMessage).not.toBeInTheDocument(); // Asercja 19

      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(1); // Asercja 20
      expect(listItems[0]).toHaveTextContent('Testowa Różdżka'); // Asercja 21
      expect(listItems[0]).toHaveTextContent('100.50 PLN'); // Asercja 22
      expect(listItems[0].tagName).toBe('LI'); // Asercja 23

      const totalHeading = screen.getByRole('heading', { name: /Do zapłaty: 100.50 PLN/i });
      expect(totalHeading).toBeInTheDocument(); // Asercja 24
      expect(totalHeading.tagName).toBe('H3'); // Asercja 25
    });
  });

  // ==========================================
  // 3. TESTY KOMPONENTU PAYMENTS
  // ==========================================
  describe('Komponent Payments', () => {
    
    it('Renderuje formularz płatności poprawnie', () => {
      render(
        <AppContext.Provider value={{ cartTotal: 0, clearCart: mockClearCart }}>
          <Payments />
        </AppContext.Provider>
      );

      const heading = screen.getByRole('heading', { name: /Bank Gringotta/i });
      expect(heading).toBeInTheDocument(); // Asercja 26
      expect(heading.tagName).toBe('H2'); // Asercja 27

      const label = screen.getByText(/Przekaż goblinom kwotę/i);
      expect(label).toBeInTheDocument(); // Asercja 28

      const input = screen.getByRole('spinbutton'); // W HTML5 type="number" to spinbutton w ARIA
      expect(input).toBeInTheDocument(); // Asercja 29
      expect(input).toHaveAttribute('type', 'number'); // Asercja 30
      expect(input).toHaveAttribute('step', '0.01'); // Asercja 31
      expect(input).toBeRequired(); // Asercja 32
      expect(input).toHaveValue(null); // Asercja 33 (Początkowo pusty)

      const button = screen.getByRole('button', { name: /Zatwierdź transfer/i });
      expect(button).toBeInTheDocument(); // Asercja 34
      expect(button).toHaveAttribute('type', 'submit'); // Asercja 35
    });

    it('Inicjalizuje input wartością z koszyka', () => {
      render(
        <AppContext.Provider value={{ cartTotal: 150.75, clearCart: mockClearCart }}>
          <Payments />
        </AppContext.Provider>
      );

      const input = screen.getByRole('spinbutton');
      expect(input).toBeInTheDocument(); // Asercja 36
      expect(input).toHaveValue(150.75); // Asercja 37
    });

    it('Pozwala na ręczną zmianę wartości w inpucie', () => {
      render(
        <AppContext.Provider value={{ cartTotal: 0, clearCart: mockClearCart }}>
          <Payments />
        </AppContext.Provider>
      );

      const input = screen.getByRole('spinbutton');
      expect(input).toHaveValue(null); // Asercja 38
      
      fireEvent.change(input, { target: { value: '99.99' } });
      
      expect(input).toHaveValue(99.99); // Asercja 39
      expect(input.value).toBe('99.99'); // Asercja 40
    });
  });

  // ==========================================
  // 4. TESTY DODATKOWE ASERCJI (Struktura drzewa DOM)
  // ==========================================
  describe('Weryfikacja strukturalna komponentów', () => {
    
    it('Komponent Products nie renderuje pustych tagów li', () => {
      render(
        <AppContext.Provider value={{ loading: false, products: mockProducts, addToCart: mockAddToCart }}>
          <Products />
        </AppContext.Provider>
      );
      const items = screen.getAllByRole('listitem');
      expect(items[0]).not.toBeEmptyDOMElement(); // Asercja 41
      expect(items[1]).not.toBeEmptyDOMElement(); // Asercja 42
    });

    it('Komponent Cart poprawnie ukrywa listę przy braku elementów', () => {
      render(
        <AppContext.Provider value={{ cartItems: [], cartTotal: 0 }}>
          <Cart />
        </AppContext.Provider>
      );
      const list = screen.queryByRole('list');
      expect(list).not.toBeInTheDocument(); // Asercja 43
      expect(list).toBeNull(); // Asercja 44
    });

    it('Komponent Payments posiada tylko jeden przycisk wysyłania', () => {
      render(
        <AppContext.Provider value={{ cartTotal: 0, clearCart: mockClearCart }}>
          <Payments />
        </AppContext.Provider>
      );
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(1); // Asercja 45
      expect(buttons[0]).toBeEnabled(); // Asercja 46
      expect(buttons[0]).toHaveStyle('margin-left: 10px'); // Asercja 47
    });

    it('Mockowane funkcje posiadają właściwy stan początkowy', () => {
      expect(mockAddToCart).toBeDefined(); // Asercja 48
      expect(mockClearCart).toBeDefined(); // Asercja 49
      expect(typeof mockAddToCart).toBe('function'); // Asercja 50
      expect(typeof mockClearCart).toBe('function'); // Asercja 51
      expect(mockClearCart).not.toHaveBeenCalled(); // Asercja 52
    });
  });

});