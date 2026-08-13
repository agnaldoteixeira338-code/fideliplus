import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../api/requisicoes.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('fideli_token');
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get('/auth/me')
      .then(setUser)
      .catch(() => {
        localStorage.removeItem('fideli_token');
      })
      .finally(() => setLoading(false));
  }, []);

  async function loginAs(role) {
    const { token, user: loggedUser } = await api.post('/auth/demo-login', { role });
    localStorage.setItem('fideli_token', token);
    setUser(loggedUser);
    return loggedUser;
  }

  function logout() {
    localStorage.removeItem('fideli_token');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, loginAs, logout }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
