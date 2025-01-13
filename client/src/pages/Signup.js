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
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState(''); 
  const [password, setPassword] = useState('');
  const [createUser, { loading, error }] = useMutation(SIGNUP_MUTATION);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createUser({ variables: { email, username, password } });
      navigate('/login'); 
    } catch (err) {
      console.error("[DEBUG] Erreur lors de la création du compte:", err);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper variant="outlined" sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>Créer un compte</Typography>
        <form 
          onSubmit={handleSubmit} 
          style={{ display: 'flex', flexDirection:'column', gap:'16px' }}
        >
          <TextField
            type="email"
            label="Email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <TextField
            type="text"
            label="Pseudo"
            variant="outlined"
            fullWidth
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
          <TextField
            type="password"
            label="Mot de passe"
            variant="outlined"
            fullWidth
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Créer un compte'}
          </Button>
        </form>
        {loading && <Alert severity="info" sx={{ mt: 2 }}>Création en cours...</Alert>}
        {error && <Alert severity="error" sx={{ mt: 2 }}>Erreur lors de la création du compte.</Alert>}
      </Paper>
    </Container>
  );
}

export default Signup;
