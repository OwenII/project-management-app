// client/src/pages/Login.js

import React, { useState, useContext } from 'react';
import { useMutation, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
        username
      }
    }
  }
`;

function Login() {
  const { loginUser } = useContext(AuthContext);  // Accéder à la fonction loginUser du contexte
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login, { loading, error }] = useMutation(LOGIN_MUTATION);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await login({ variables: { email, password } });
      const { token, user } = result.data.login;

      // Stocker l'utilisateur et le token dans le contexte
      loginUser(user, token);

      // Rediriger vers la page d'accueil
      navigate('/');
    } catch (err) {
      console.error("[DEBUG] Login error:", err);
    }
  };

  return (
    <div>
      <h2>Connexion</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="email" 
          placeholder="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input 
          type="password" 
          placeholder="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">Se connecter</button>
      </form>
      {loading && <p>Chargement...</p>}
      {error && <p>Erreur de connexion</p>}
    </div>
  );
}

export default Login;
