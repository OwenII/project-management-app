// client/src/pages/Signup.js
import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';
import { SIGNUP_MUTATION } from '../graphql/mutations';

function Signup() {
  // Déclaration des états pour l'email, le pseudo et le mot de passe
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Mutation pour créer un utilisateur
  const [createUser, { loading, error }] = useMutation(SIGNUP_MUTATION);

  // Hook de navigation pour rediriger après la création du compte
  const navigate = useNavigate();

  // Fonction pour gérer la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page
    try {
      // Appel de la mutation pour créer un utilisateur
      await createUser({ variables: { email, username, password } });
      navigate('/login'); // Redirige vers la page de connexion après la création du compte
    } catch (err) {
      console.error("[DEBUG] Erreur lors de la création du compte:", err);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper variant="outlined" sx={{ p: 3 }}>
        {/* Titre de la page */}
        <Typography variant="h5" gutterBottom>Créer un compte</Typography>

        {/* Formulaire d'inscription */}
        <form 
          onSubmit={handleSubmit} 
          style={{ display: 'flex', flexDirection:'column', gap:'16px' }}
        >
          {/* Champ pour l'email */}
          <TextField
            type="email"
            label="Email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          
          {/* Champ pour le pseudo */}
          <TextField
            type="text"
            label="Pseudo"
            variant="outlined"
            fullWidth
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
          
          {/* Champ pour le mot de passe */}
          <TextField
            type="password"
            label="Mot de passe"
            variant="outlined"
            fullWidth
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          
          {/* Bouton de soumission, avec indicateur de chargement */}
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Créer un compte'}
          </Button>
        </form>

        {/* Message d'information si la création est en cours */}
        {loading && <Alert severity="info" sx={{ mt: 2 }}>Création en cours...</Alert>}

        {/* Message d'erreur en cas de problème lors de la création */}
        {error && <Alert severity="error" sx={{ mt: 2 }}>Erreur lors de la création du compte.</Alert>}
      </Paper>
    </Container>
  );
}

export default Signup;
