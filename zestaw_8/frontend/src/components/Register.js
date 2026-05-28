import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Register() {
  // Stany lokalne przechowujące dane z formularza
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  // Funkcja wywoływana po kliknięciu przycisku "Zarejestruj"
  const handleRegister = (e) => {
    e.preventDefault(); // Blokujemy przeładowanie strony

    // Wysyłamy żądanie POST do naszego serwera Go (endpoint /api/register)
    axios.post('http://localhost:8080/api/register', { email, password })
      .then((response) => {
        // Jeśli serwer zwróci 200 OK (sukces)
        setMessage('Sukces! Konto zostało utworzone. Możesz się teraz zalogować.');
        setEmail('');
        setPassword('');
      })
      .catch((error) => {
        // Jeśli serwer zwróci błąd (np. 409 Conflict - taki email już istnieje)
        if (error.response && error.response.data.error) {
          setMessage(error.response.data.error);
        } else {
          setMessage('Wystąpił błąd podczas rejestracji.');
        }
      });
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <h2>Rejestracja w Magicznym Sklepie</h2>
      <form onSubmit={handleRegister}>
        <div style={{ marginBottom: '10px' }}>
          <label>Email: </label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            style={{ width: '100%', padding: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Hasło: </label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            style={{ width: '100%', padding: '5px' }}
          />
        </div>
        <button type="submit" style={{ padding: '10px 15px', width: '100%' }}>Utwórz konto</button>
      </form>
      {/* Wyświetlanie komunikatów o błędach lub sukcesie */}
      {message && <p style={{ marginTop: '15px', fontWeight: 'bold', color: 'darkred' }}>{message}</p>}
      
      <p style={{ marginTop: '20px' }}>
        Masz już kociołek? <Link to="/login">Zaloguj się tutaj</Link>
      </p>
    </div>
  );
}

export default Register;