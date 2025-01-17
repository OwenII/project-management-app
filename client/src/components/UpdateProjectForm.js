// client/src/components/UpdateProjectForm.js
import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { TextField, Button, Typography, Paper } from '@mui/material';
import { UPDATE_PROJECT } from '../graphql/mutations';

function UpdateProjectForm({ project, onProjectUpdated }) {
  // Déclare des états locaux pour le nom et la description du projet
  const [name, setName] = useState(project.name || '');
  const [description, setDescription] = useState(project.description || '');

  // Définition de la mutation pour mettre à jour le projet
  const [updateProject, { loading, error }] = useMutation(UPDATE_PROJECT);

  // Gestion de la soumission du formulaire de mise à jour
  const handleSubmit = async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page lors de la soumission
    const projectId = parseInt(project.id, 10); // Récupère l'ID du projet

    try {
      // Lancement de la mutation pour mettre à jour le projet avec les nouvelles valeurs
      const result = await updateProject({
        variables: { id: projectId, name, description },
      });

      // Si une fonction de rappel est fournie, elle est appelée avec le projet mis à jour
      if (onProjectUpdated) onProjectUpdated(result.data.updateProject);
    } catch (err) {
      // Capture les erreurs lors de la mise à jour
      console.error("Error updating project", err);
    }
  };

  return (
    <Paper variant="outlined" sx={{ p: 2, mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Mettre à jour le projet
      </Typography>
      {/* Formulaire de mise à jour du projet */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Champ de saisie pour le nom du projet */}
        <TextField
          label="Nom du projet"
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        
        {/* Champ de saisie pour la description du projet */}
        <TextField
          label="Description"
          variant="outlined"
          multiline
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        
        {/* Bouton de soumission qui est désactivé si la mutation est en cours */}
        <Button type="submit" variant="contained" color="primary" disabled={loading}>
          Mettre à jour
        </Button>
        
        {/* Affichage d'une erreur si elle survient durant la mise à jour */}
        {error && (
          <Typography color="error">
            Erreur lors de la mise à jour : {error.message}
          </Typography>
        )}
      </form>
    </Paper>
  );
}

export default UpdateProjectForm;
