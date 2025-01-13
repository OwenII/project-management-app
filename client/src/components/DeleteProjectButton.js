import React from 'react';
import { useMutation } from '@apollo/client';
import { IconButton } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { DELETE_PROJECT } from '../graphql/mutations';

function DeleteProjectButton({ projectId, onProjectDeleted }) {
  const intProjectId = parseInt(projectId, 10);

  const [deleteProject, { loading, error }] = useMutation(DELETE_PROJECT, {
    variables: { id: intProjectId },
    onCompleted: () => {
      if (onProjectDeleted) onProjectDeleted(intProjectId);
    },
  });

  if (error) {
    console.error("Error deleting project", error);
  }

  return (
    <IconButton
      color="error"
      onClick={() => deleteProject()}
      disabled={loading}
      aria-label="supprimer le projet"
    >
      <Delete />
    </IconButton>
  );
}

export default DeleteProjectButton;
