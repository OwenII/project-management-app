
import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';  // Utilisez l'export nommé

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log('[DEBUG] Token décodé :', decoded);
        setUser({ id: parseInt(decoded.id, 10), email: decoded.sub }); // Conversion explicite en entier
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('token');
      }
    }
  }, []);

  const loginUser = (userData, token) => {
    console.log('[DEBUG] Utilisateur connecté :', userData);
    setUser({ id: parseInt(userData.id, 10), email: userData.email }); // Conversion explicite en entier
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
}
