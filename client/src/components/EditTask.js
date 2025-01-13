// client/src/components/EditTask.js
import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  Button,
  IconButton,
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { UPDATE_TASK, DELETE_TASK } from '../graphql/mutations';
import { TASKS_PROJECTS_QUERY } from '../graphql/queries';

function EditTask({ task, projectId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [status, setStatus] = useState(task.status);

  const [updateTask] = useMutation(UPDATE_TASK);
  const [deleteTask] = useMutation(DELETE_TASK);

  const handleUpdate = async () => {
    try {
      await updateTask({
        variables: { id: parseInt(task.id, 10), title, status },
        refetchQueries: [{ query: TASKS_PROJECTS_QUERY }],
        awaitRefetchQueries: true,
      });
      setIsOpen(false);
    } catch (err) {
      console.error("[DEBUG] Erreur lors de la mise à jour :", err);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette tâche ?")) {
      try {
        await deleteTask({
          variables: { id: parseInt(task.id, 10) },
          refetchQueries: [{ query: TASKS_PROJECTS_QUERY }],
          awaitRefetchQueries: true,
        });
        setIsOpen(false);
      } catch (err) {
        console.error("[DEBUG] Erreur lors de la suppression :", err);
      }
    }
  };

  return (
    <>
      <IconButton onClick={() => setIsOpen(true)} size="small" color="primary">
        <EditIcon />
      </IconButton>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <DialogTitle>Modifier la Tâche</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Titre"
            fullWidth
            variant="outlined"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <Select
            fullWidth
            variant="outlined"
            value={status}
            onChange={e => setStatus(e.target.value)}
          >
            <MenuItem value="TODO">À faire</MenuItem>
            <MenuItem value="IN_PROGRESS">En cours</MenuItem>
            <MenuItem value="DONE">Terminé</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUpdate} variant="contained" color="primary">
            Mettre à jour
          </Button>
          <Button onClick={handleDelete} variant="contained" color="error">
            Supprimer
          </Button>
          <Button onClick={() => setIsOpen(false)}>Annuler</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default EditTask;
