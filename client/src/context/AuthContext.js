import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';  // Utilisation de l'export nommé de jwt-decode

// Création du contexte d'authentification
export const AuthContext = createContext();

export function AuthProvider({ children }) {
  // État local pour stocker les informations de l'utilisateur
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Récupération du token JWT depuis le stockage local au chargement du composant
    const token = localStorage.getItem('token');
    
    // Si un token est trouvé, on tente de le décoder
    if (token) {
      try {
        const decoded = jwtDecode(token);  // Décodage du token JWT
        console.log('[DEBUG] Token décodé :', decoded);
        
        // On récupère les informations de l'utilisateur à partir du token décodé et on les stocke dans l'état
        setUser({ id: parseInt(decoded.id, 10), email: decoded.sub }); // Conversion explicite de l'id en entier
      } catch (error) {
        // En cas d'erreur de décodage, on supprime le token du stockage local
        console.error('Invalid token:', error);
        localStorage.removeItem('token');
      }
    }
  }, []);

  // Fonction pour connecter un utilisateur, mettre à jour l'état et stocker les données dans le stockage local
  const loginUser = (userData, token) => {
    console.log('[DEBUG] Utilisateur connecté :', userData);
    setUser({ id: parseInt(userData.id, 10), email: userData.email }); // Conversion explicite de l'id en entier
    localStorage.setItem('token', token);  // Sauvegarde du token dans le stockage local
    localStorage.setItem('user', JSON.stringify(userData));  // Sauvegarde des données de l'utilisateur
  };

  // Fonction pour déconnecter l'utilisateur, réinitialiser l'état et supprimer les données du stockage local
  const logoutUser = () => {
    setUser(null);  // Réinitialisation de l'état de l'utilisateur
    localStorage.removeItem('token');  // Suppression du token du stockage local
    localStorage.removeItem('user');   // Suppression des données de l'utilisateur
  };

  // Fourniture des informations d'authentification via le contexte
  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
}
