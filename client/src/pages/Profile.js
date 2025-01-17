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
  // Accède au contexte d'authentification pour récupérer l'utilisateur actuel et la fonction de déconnexion
  const { user, logoutUser } = useContext(AuthContext);

  // Déclare l'état pour le nom d'utilisateur et les messages d'erreur/succès
  const [username, setUsername] = useState(user ? user.username : '');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Navigation pour rediriger l'utilisateur après la suppression de son compte
  const navigate = useNavigate();

  // Déclare les mutations pour mettre à jour et supprimer l'utilisateur
  const [updateUserMutation] = useMutation(UPDATE_USER);
  const [deleteUserMutation] = useMutation(DELETE_USER);

  // Si l'utilisateur n'est pas connecté, affiche un message d'avertissement
  if (!user) {
    return (
      <Container>
        <Alert severity="warning">Veuillez vous connecter pour voir votre profil.</Alert>
      </Container>
    );
  }

  // Fonction pour gérer la mise à jour du nom d'utilisateur
  const handleUpdate = async () => {
    try {
      // Exécute la mutation pour mettre à jour le nom d'utilisateur
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

  // Fonction pour gérer la suppression du compte utilisateur
  const handleDelete = async () => {
    // Demande une confirmation avant de procéder à la suppression
    const confirmation = window.confirm(
      "Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible."
    );
    if (!confirmation) return;

    try {
      // Exécute la mutation pour supprimer l'utilisateur
      const { data } = await deleteUserMutation({ 
        variables: { id: parseInt(user.id, 10) } 
      });
      if (data.deleteUser) {
        logoutUser(); // Déconnecte l'utilisateur après suppression
        alert('Votre compte a été supprimé avec succès.');
        navigate('/'); // Redirige vers la page d'accueil après suppression
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du compte :", error);
      alert('Une erreur est survenue lors de la suppression du compte.');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper variant="outlined" sx={{ p: 3 }}>
        {/* Affiche les informations de l'utilisateur */}
        <Typography variant="h4" gutterBottom>
          Profil de {user.username}
        </Typography>
        <Typography>Email : {user.email}</Typography>

        {/* Section pour modifier le nom d'utilisateur */}
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
          {/* Affichage des messages d'erreur ou de succès */}
          {errorMessage && <Alert severity="error" sx={{ mt: 2 }}>{errorMessage}</Alert>}
          {successMessage && <Alert severity="success" sx={{ mt: 2 }}>{successMessage}</Alert>}
        </Paper>

        {/* Section pour supprimer le compte utilisateur */}
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
