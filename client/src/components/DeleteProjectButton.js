import React from 'react';
import { useMutation } from '@apollo/client';
import { IconButton } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { DELETE_PROJECT } from '../graphql/mutations';

function DeleteProjectButton({ projectId, onProjectDeleted }) {
  // Convertit l'ID du projet en entier
  const intProjectId = parseInt(projectId, 10);

  // Mutation pour supprimer un projet
  const [deleteProject, { loading, error }] = useMutation(DELETE_PROJECT, {
    variables: { id: intProjectId }, // ID du projet à supprimer
    onCompleted: () => {
      // Appelle la fonction onProjectDeleted après la suppression réussie du projet
      if (onProjectDeleted) onProjectDeleted(intProjectId);
    },
  });

  // Affiche une erreur dans la console en cas de problème de suppression
  if (error) {
    console.error("Error deleting project", error);
  }

  return (
    <IconButton
      color="error"
      onClick={() => deleteProject()} // Lance la mutation de suppression du projet
      disabled={loading} // Désactive le bouton pendant que la mutation est en cours
      aria-label="supprimer le projet"
    >
      <Delete />
    </IconButton>
  );
}

export default DeleteProjectButton;
