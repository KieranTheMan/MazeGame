import React, { useState } from 'react';
import Auth from './components/Auth';
import GameBoard from './components/GameBoard';
import './App.css';

function App() {
  const [token, setToken] = useState<string | null>(null);

  const handleLogin = (newToken: string) => {
    setToken(newToken);
  };

  const handleLogout = () => {
    setToken(null);
  };

  return (
    <div className="App">
      {token ? (
        <GameBoard token={token} onLogout={handleLogout} />
      ) : (
        <Auth onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
