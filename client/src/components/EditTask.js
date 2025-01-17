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
  // Déclare les états locaux pour gérer l'ouverture du dialogue et les valeurs des champs
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [status, setStatus] = useState(task.status);

  // Déclare les mutations pour mettre à jour et supprimer une tâche
  const [updateTask] = useMutation(UPDATE_TASK);
  const [deleteTask] = useMutation(DELETE_TASK);

  // Fonction pour mettre à jour une tâche avec les nouvelles valeurs
  const handleUpdate = async () => {
    try {
      // Exécute la mutation de mise à jour en passant l'ID de la tâche et les nouvelles valeurs
      await updateTask({
        variables: { id: parseInt(task.id, 10), title, status },
        refetchQueries: [{ query: TASKS_PROJECTS_QUERY }],  // Refait la requête pour récupérer les données actualisées
        awaitRefetchQueries: true, // Attendre que les requêtes soient terminées avant de fermer le dialogue
      });
      setIsOpen(false); // Ferme le dialogue après la mise à jour réussie
    } catch (err) {
      console.error("[DEBUG] Erreur lors de la mise à jour :", err); // Log d'erreur en cas de problème
    }
  };

  // Fonction pour supprimer une tâche après confirmation
  const handleDelete = async () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette tâche ?")) {
      try {
        // Exécute la mutation de suppression en passant l'ID de la tâche
        await deleteTask({
          variables: { id: parseInt(task.id, 10) },
          refetchQueries: [{ query: TASKS_PROJECTS_QUERY }],  // Refait la requête pour récupérer les données actualisées
          awaitRefetchQueries: true, // Attendre que les requêtes soient terminées avant de fermer le dialogue
        });
        setIsOpen(false); // Ferme le dialogue après la suppression réussie
      } catch (err) {
        console.error("[DEBUG] Erreur lors de la suppression :", err); // Log d'erreur en cas de problème
      }
    }
  };

  return (
    <>
      {/* Bouton pour ouvrir le dialogue de modification de la tâche */}
      <IconButton onClick={() => setIsOpen(true)} size="small" color="primary">
        <EditIcon />
      </IconButton>

      {/* Dialogue de modification de la tâche */}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <DialogTitle>Modifier la Tâche</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          {/* Champ pour modifier le titre de la tâche */}
          <TextField
            label="Titre"
            fullWidth
            variant="outlined"
            value={title}
            onChange={e => setTitle(e.target.value)} // Met à jour le titre en fonction de la saisie
          />
          {/* Sélecteur pour modifier le statut de la tâche */}
          <Select
            fullWidth
            variant="outlined"
            value={status}
            onChange={e => setStatus(e.target.value)} // Met à jour le statut en fonction de la sélection
          >
            <MenuItem value="TODO">À faire</MenuItem>
            <MenuItem value="IN_PROGRESS">En cours</MenuItem>
            <MenuItem value="DONE">Terminé</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          {/* Bouton pour mettre à jour la tâche */}
          <Button onClick={handleUpdate} variant="contained" color="primary">
            Mettre à jour
          </Button>
          {/* Bouton pour supprimer la tâche */}
          <Button onClick={handleDelete} variant="contained" color="error">
            Supprimer
          </Button>
          {/* Bouton pour annuler la modification */}
          <Button onClick={() => setIsOpen(false)}>Annuler</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default EditTask;
