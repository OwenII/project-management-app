import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { UPDATE_PROJECT } from '../graphql/mutations';

function UpdateProjectForm({ project, onProjectUpdated }) {
  const [name, setName] = useState(project.name || '');
  const [description, setDescription] = useState(project.description || '');
  
  const [updateProject, { loading, error }] = useMutation(UPDATE_PROJECT);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convertir project.id en entier pour éviter l'erreur
    const projectId = parseInt(project.id, 10);

    try {
      const result = await updateProject({
        variables: { id: projectId, name, description } // Passer l'id converti
      });

      if (onProjectUpdated) onProjectUpdated(result.data.updateProject);
    } catch (err) {
      console.error("Error updating project", err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Mettre à jour le projet</h3>
      <input
        type="text"
        placeholder="Nom du projet"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button type="submit" disabled={loading}>Mettre à jour</button>
      {error && <p>Erreur lors de la mise à jour : {error.message}</p>}
    </form>
  );
}

export default UpdateProjectForm;
