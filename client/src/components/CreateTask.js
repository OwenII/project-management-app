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
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('TODO');
  const [createTask, { loading, error }] = useMutation(CREATE_TASK_MUTATION);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTask({
        variables: { title, status, projectId },
        refetchQueries: [
          { query: PROJECT_QUERY, variables: { id: projectId } },
        ],
        awaitRefetchQueries: true,
      });
      setTitle('');
    } catch (err) {
      console.error("Erreur lors de la création de la tâche :", err);
    }
  };

  return (
    <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <TextField
          label="Titre de la tâche"
          variant="outlined"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
        <Select
          value={status}
          onChange={e => setStatus(e.target.value)}
          variant="outlined"
        >
          <MenuItem value="TODO">À faire</MenuItem>
          <MenuItem value="IN_PROGRESS">En cours</MenuItem>
          <MenuItem value="DONE">Terminé</MenuItem>
        </Select>
        <Button type="submit" variant="contained" color="primary">
          Ajouter la tâche
        </Button>
        {loading && <Typography>Envoi...</Typography>}
        {error && <Typography color="error">Erreur lors de la création de la tâche.</Typography>}
      </form>
    </Paper>
  );
}

export default CreateTask;
