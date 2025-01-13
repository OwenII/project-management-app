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
  const { loginUser } = useContext(AuthContext); // Accéder à la fonction loginUser du contexte
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // État pour stocker les messages d'erreur
  const [login, { loading }] = useMutation(LOGIN_MUTATION);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Réinitialiser le message d'erreur

    try {
      const result = await login({ variables: { email, password } });
      const { token, user } = result.data.login;

      // Stocker l'utilisateur et le token dans le contexte
      loginUser(user, token);

      // Rediriger vers la page d'accueil
      navigate('/');
    } catch (err) {
      console.error("[DEBUG] Login error:", err);

      // Vérifier si des erreurs spécifiques sont retournées
      if (err.graphQLErrors && err.graphQLErrors.length > 0) {
        // Récupérer le message de la première erreur GraphQL
        setErrorMessage(err.graphQLErrors[0].message);
      } else {
        // Erreur générique
        setErrorMessage("Une erreur s'est produite. Veuillez réessayer.");
      }
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
        <button type="submit" disabled={loading}>
          {loading ? 'Chargement...' : 'Se connecter'}
        </button>
      </form>

      {/* Affichage du message d'erreur */}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
}

export default Login;
