// client/src/components/Login.js
import React, { useState, useContext } from 'react';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  CircularProgress,
} from '@mui/material';
import { LOGIN_MUTATION } from '../graphql/mutations';

function Login() {
  // Accès au contexte d'authentification pour gérer l'état de l'utilisateur
  const { loginUser } = useContext(AuthContext);

  // Déclarations des états pour gérer l'email, le mot de passe et le message d'erreur
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Définition de la mutation pour se connecter
  const [login, { loading }] = useMutation(LOGIN_MUTATION);
  
  // Hook de navigation pour rediriger après une connexion réussie
  const navigate = useNavigate();

  // Gestion de la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page lors de la soumission
    setErrorMessage(''); // Réinitialise les messages d'erreur avant chaque tentative de connexion

    try {
      // Lancement de la mutation pour se connecter avec l'email et le mot de passe
      const result = await login({ variables: { email, password } });
      
      // Récupération du token et de l'utilisateur depuis la réponse de la mutation
      const { token, user } = result.data.login;
      
      // Appel à la fonction loginUser du contexte pour stocker l'utilisateur et le token
      loginUser(user, token);

      // Redirection vers la page d'accueil après une connexion réussie
      navigate('/');
    } catch (err) {
      console.error("[DEBUG] Login error:", err);
      
      // Gestion des erreurs GraphQL
      if (err.graphQLErrors && err.graphQLErrors.length > 0) {
        setErrorMessage(err.graphQLErrors[0].message);
      } else {
        // Message d'erreur générique si aucune erreur spécifique n'est trouvée
        setErrorMessage("Une erreur s'est produite. Veuillez réessayer.");
      }
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper variant="outlined" sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Connexion
        </Typography>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Champ pour l'email avec un contrôle de validation */}
          <TextField
            type="email"
            label="Email"
            variant="outlined"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            fullWidth
          />
          
          {/* Champ pour le mot de passe */}
          <TextField
            type="password"
            label="Mot de passe"
            variant="outlined"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            fullWidth
          />
          
          {/* Bouton de soumission qui affiche un indicateur de chargement si la requête est en cours */}
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Se connecter'}
          </Button>
        </form>
        
        {/* Affichage d'un message d'erreur si un problème survient lors de la connexion */}
        {errorMessage && (
          <Typography color="error" sx={{ mt: 2 }}>
            {errorMessage}
          </Typography>
        )}
      </Paper>
    </Container>
  );
}

export default Login;
