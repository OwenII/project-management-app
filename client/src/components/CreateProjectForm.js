import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { TextField, Button, Typography, Paper } from '@mui/material';
import { CREATE_PROJECT } from '../graphql/mutations';

function CreateProjectForm({ ownerId, onProjectCreated }) {
  // Déclare les états pour le nom et la description du projet
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  // Utilise la mutation CREATE_PROJECT pour créer un nouveau projet
  const [createProject, { loading, error }] = useMutation(CREATE_PROJECT);

  // Fonction qui gère la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page lors de la soumission du formulaire

    try {
      // Appelle la mutation pour créer un projet avec les données saisies
      const result = await createProject({
        variables: {
          name,
          description,
          ownerId: parseInt(ownerId, 10), // Convertit ownerId en nombre entier
        },
      });

      // Si un callback onProjectCreated est passé, on l'appelle avec le projet créé
      if (onProjectCreated) onProjectCreated(result.data.createProject);

      // Réinitialise les champs du formulaire
      setName('');
      setDescription('');
    } catch (err) {
      // Gère les erreurs lors de l'exécution de la mutation
      console.error('Erreur lors de la mutation createProject :', err);
    }
  };

  return (
    <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        Créer un nouveau projet
      </Typography>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Champ pour saisir le nom du projet */}
        <TextField
          label="Nom du projet"
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)} // Met à jour le nom du projet
          required
        />
        {/* Champ pour saisir la description du projet */}
        <TextField
          label="Description"
          variant="outlined"
          multiline
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)} // Met à jour la description du projet
        />
        {/* Bouton pour soumettre le formulaire */}
        <Button type="submit" variant="contained" color="primary" disabled={loading}>
          Créer
        </Button>

        {/* Affichage d'un message d'erreur en cas de problème lors de la création */}
        {error && (
          <Typography color="error">
            Erreur lors de la création : {error.message}
          </Typography>
        )}
      </form>
    </Paper>
  );
}

export default CreateProjectForm;
