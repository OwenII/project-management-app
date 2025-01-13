// client/src/components/UpdateProjectForm.js
import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { TextField, Button, Typography, Paper } from '@mui/material';
import { UPDATE_PROJECT } from '../graphql/mutations';

function UpdateProjectForm({ project, onProjectUpdated }) {
  const [name, setName] = useState(project.name || '');
  const [description, setDescription] = useState(project.description || '');

  const [updateProject, { loading, error }] = useMutation(UPDATE_PROJECT);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const projectId = parseInt(project.id, 10);

    try {
      const result = await updateProject({
        variables: { id: projectId, name, description },
      });

      if (onProjectUpdated) onProjectUpdated(result.data.updateProject);
    } catch (err) {
      console.error("Error updating project", err);
    }
  };

  return (
    <Paper variant="outlined" sx={{ p: 2, mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Mettre à jour le projet
      </Typography>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <TextField
          label="Nom du projet"
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <TextField
          label="Description"
          variant="outlined"
          multiline
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Button type="submit" variant="contained" color="primary" disabled={loading}>
          Mettre à jour
        </Button>
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
