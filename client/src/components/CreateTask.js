import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import {
  TextField,
  Button,
  Select,
  MenuItem,
  Typography,
  Paper,
} from '@mui/material';
import { PROJECT_QUERY } from '../graphql/queries'; 
import { CREATE_TASK_MUTATION } from '../graphql/mutations';


function CreateTask({ projectId }) {
  // États pour gérer le titre et le statut de la tâche
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('TODO');
  
  // Mutation pour créer une nouvelle tâche
  const [createTask, { loading, error }] = useMutation(CREATE_TASK_MUTATION);

  // Fonction de gestion de la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page lors de la soumission
    try {
      // Lancement de la mutation pour créer la tâche avec les variables
      await createTask({
        variables: { title, status, projectId },
        // Rafraîchissement de la requête du projet pour inclure la nouvelle tâche
        refetchQueries: [
          { query: PROJECT_QUERY, variables: { id: projectId } },
        ],
        awaitRefetchQueries: true,
      });
      // Réinitialisation du titre de la tâche après la soumission
      setTitle('');
    } catch (err) {
      // Gestion des erreurs en cas de problème avec la mutation
      console.error("Erreur lors de la création de la tâche :", err);
    }
  };

  return (
    <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
      {/* Formulaire pour la création de la tâche */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Champ pour saisir le titre de la tâche */}
        <TextField
          label="Titre de la tâche"
          variant="outlined"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
        
        {/* Sélecteur pour choisir le statut de la tâche */}
        <Select
          value={status}
          onChange={e => setStatus(e.target.value)}
          variant="outlined"
        >
          <MenuItem value="TODO">À faire</MenuItem>
          <MenuItem value="IN_PROGRESS">En cours</MenuItem>
          <MenuItem value="DONE">Terminé</MenuItem>
        </Select>

        {/* Bouton pour soumettre le formulaire */}
        <Button type="submit" variant="contained" color="primary">
          Ajouter la tâche
        </Button>

        {/* Affichage de l'indicateur de chargement pendant l'envoi */}
        {loading && <Typography>Envoi...</Typography>}

        {/* Affichage d'un message d'erreur en cas de problème lors de la création */}
        {error && <Typography color="error">Erreur lors de la création de la tâche.</Typography>}
      </form>
    </Paper>
  );
}

export default CreateTask;
