import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  
  // Hook useNavigate pozwala nam programowo przenosić klienta na inne podstrony
  const navigate = useNavigate();
  // Hook useLocation pozwala odczytać parametry z adresu URL w przeglądarce
  const location = useLocation();

  // Sprawdzamy, czy w adresie URL jest parametr "oauth_email" (przysłany od serwera Go po sukcesie w Google)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const oauthEmail = params.get('oauth_email');
    
    if (oauthEmail) {
      // Logujemy klienta automatycznie danymi z Google
      localStorage.setItem('userEmail', oauthEmail);
      setMessage('Zalogowano pomyślnie przez Google!');
      setTimeout(() => navigate('/'), 1500);
    }
  }, [location, navigate]);

  const handleLogin = (e) => {
    e.preventDefault();

    // Wysyłamy dane do endpointu /api/login w Go (Tradycyjne logowanie)
    axios.post('http://localhost:8080/api/login', { email, password })
      .then((response) => {
        setMessage('Zalogowano pomyślnie!');
        
        // Zapisujemy prostą informację w przeglądarce, że użytkownik jest zalogowany
        localStorage.setItem('userEmail', response.data.email);
        
        // Po udanym logowaniu przenosimy klienta z powrotem na stronę główną sklepu
        setTimeout(() => {
          navigate('/');
        }, 1000);
      })
      .catch((error) => {
        if (error.response && error.response.data.error) {
          setMessage(error.response.data.error);
        } else {
          setMessage('Błąd logowania. Sprawdź serwer.');
        }
      });
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <h2>Logowanie</h2>
      
      {/* Formularz tradycyjnego logowania */}
      <form onSubmit={handleLogin}>
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
        <button type="submit" style={{ padding: '10px 15px', width: '100%' }}>Wejdź do sklepu</button>
      </form>

      {/* Przycisk logowania OAuth2 przez Google */}
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <p>lub</p>
        <a 
          href="http://localhost:8080/auth/google/login" 
          style={{
            display: 'block', 
            padding: '10px', 
            backgroundColor: '#4285F4', 
            color: 'white', 
            textDecoration: 'none', 
            fontWeight: 'bold', 
            borderRadius: '5px',
            marginBottom: '10px' // Dodałem lekki odstęp
          }}
        >
          Zaloguj się przez Google
        </a>

        {/* DODANY PRZYCISK GITHUB (Punkt 4.5) */}
        <a 
          href="http://localhost:8080/auth/github/login" 
          style={{
            display: 'block', 
            padding: '10px', 
            backgroundColor: '#333', 
            color: 'white', 
            textDecoration: 'none', 
            fontWeight: 'bold', 
            borderRadius: '5px'
          }}
        >
          Zaloguj się przez GitHub
        </a>
      </div>

      {message && <p style={{ marginTop: '15px', fontWeight: 'bold', color: 'darkred' }}>{message}</p>}
      
      <p style={{ marginTop: '20px' }}>
        Nowy czarodziej? <Link to="/register">Zarejestruj się</Link>
      </p>
    </div>
  );
}

export default Login;