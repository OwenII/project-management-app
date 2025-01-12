import React from 'react';
import { useMutation } from '@apollo/client';
import { DELETE_PROJECT } from '../graphql/mutations';

function DeleteProjectButton({ projectId, onProjectDeleted }) {
    // Convertir projectId en entier pour éviter les erreurs de type
    const intProjectId = parseInt(projectId, 10);

    const [deleteProject, { loading, error }] = useMutation(DELETE_PROJECT, {
        variables: { id: intProjectId }, // Passer la valeur convertie
        onCompleted: () => {
          if (onProjectDeleted) onProjectDeleted(intProjectId);
        }
    });
    
    if (error) {
        console.error("Error deleting project", error);
    }

    return (
        <button onClick={() => deleteProject()} disabled={loading}>
            Supprimer le projet
        </button>
    );
}

export default DeleteProjectButton;
