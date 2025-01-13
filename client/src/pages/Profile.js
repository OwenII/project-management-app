// client/src/pages/Profile.js
import React, { useContext, useState } from 'react';
import { useMutation } from '@apollo/client';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
} from '@mui/material';
import { UPDATE_USER, DELETE_USER } from '../graphql/mutations';

function Profile() {
  const { user, logoutUser } = useContext(AuthContext);
  const [username, setUsername] = useState(user ? user.username : '');
  const navigate = useNavigate();
  const [updateUserMutation] = useMutation(UPDATE_USER);
  const [deleteUserMutation] = useMutation(DELETE_USER);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!user) {
    return (
      <Container>
        <Alert severity="warning">Veuillez vous connecter pour voir votre profil.</Alert>
      </Container>
    );
  }

  const handleUpdate = async () => {
    try {
      const { data } = await updateUserMutation({ 
        variables: { id: parseInt(user.id, 10), username } 
      });
      console.log('Utilisateur mis à jour :', data.updateUser);
      setSuccessMessage("Nom d'utilisateur mis à jour avec succès.");
      setErrorMessage('');
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
      setErrorMessage('Une erreur est survenue lors de la mise à jour.');
    }
  };

  const handleDelete = async () => {
    const confirmation = window.confirm(
      "Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible."
    );
    if (!confirmation) return;

    try {
      const { data } = await deleteUserMutation({ 
        variables: { id: parseInt(user.id, 10) } 
      });
      if (data.deleteUser) {
        logoutUser(); 
        alert('Votre compte a été supprimé avec succès.');
        navigate('/');  
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du compte :", error);
      alert('Une erreur est survenue lors de la suppression du compte.');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper variant="outlined" sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Profil de {user.username}
        </Typography>
        <Typography>Email : {user.email}</Typography>

        <Paper variant="outlined" sx={{ p: 2, mt: 3 }}>
          <Typography variant="h6" gutterBottom>Modifier le nom d'utilisateur</Typography>
          <TextField
            label="Nouveau nom d'utilisateur"
            variant="outlined"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button variant="contained" color="primary" onClick={handleUpdate}>
            Sauvegarder
          </Button>
          {errorMessage && <Alert severity="error" sx={{ mt: 2 }}>{errorMessage}</Alert>}
          {successMessage && <Alert severity="success" sx={{ mt: 2 }}>{successMessage}</Alert>}
        </Paper>

        <Paper variant="outlined" sx={{ p: 2, mt: 3, bgcolor: '#ffe6e6' }}>
          <Typography variant="h6" gutterBottom color="error">Supprimer le compte</Typography>
          <Button variant="contained" color="error" onClick={handleDelete}>
            Supprimer mon compte
          </Button>
        </Paper>
      </Paper>
    </Container>
  );
}

export default Profile;
