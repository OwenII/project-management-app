import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { TextField, Button, Typography, Paper } from '@mui/material';
import { CREATE_PROJECT } from '../graphql/mutations';

function CreateProjectForm({ ownerId, onProjectCreated }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [createProject, { loading, error }] = useMutation(CREATE_PROJECT);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await createProject({
        variables: {
          name,
          description,
          ownerId: parseInt(ownerId, 10),
        },
      });

      if (onProjectCreated) onProjectCreated(result.data.createProject);
      setName('');
      setDescription('');
    } catch (err) {
      console.error('Erreur lors de la mutation createProject :', err);
    }
  };

  return (
    <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        Créer un nouveau projet
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
          Créer
        </Button>
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
