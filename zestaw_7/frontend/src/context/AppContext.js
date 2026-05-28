// Importujemy React oraz hooki
import React, { createContext, useState, useEffect } from 'react';
// IMPORT DODANY DLA SONARCLOUD: biblioteka do walidacji propsów
import PropTypes from 'prop-types';
import axios from 'axios';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [products, setProducts] = useState([]); 
  const [cartItems, setCartItems] = useState([]); 
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    axios.get('http://localhost:8080/api/products')
      .then(response => {
        setProducts(response.data); 
        setLoading(false); 
      })
      .catch(error => {
        console.error('Brak serwera Gringotta. Ładuję asortyment awaryjny:', error);
        
        // POPRAWKA DLA SONARCLOUD: Usunięto zera po przecinku (np. z 150.00 na 150)
        const hpProducts = [
          { id: 1, name: 'Różdżka (Ostrokrzew i pióro feniksa, 11 cali)', price: 150 },
          { id: 2, name: 'Najnowszy model miotły: Błyskawica', price: 1200 },
          { id: 3, name: 'Czekoladowa Żaba (zawiera kartę)', price: 5.5 },
          { id: 4, name: 'Kociołek cynowy (rozmiar standardowy)', price: 45 },
          { id: 5, name: 'Peleryna Niewidka (kolekcja Insygniów Śmierci)', price: 9999.99 }
        ];
        
        setProducts(hpProducts); 
        setLoading(false); 
      });
  }, []);

  const addToCart = (product) => {
    setCartItems((prev) => [...prev, product]);
  };

  const clearCart = () => {
    setCartItems([]); 
  };

  const cartTotal = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <AppContext.Provider value={{ products, cartItems, loading, addToCart, clearCart, cartTotal }}>
      {children}
    </AppContext.Provider>
  );
};

// POPRAWKA DLA SONARCLOUD: Walidacja propsa 'children'
AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
};