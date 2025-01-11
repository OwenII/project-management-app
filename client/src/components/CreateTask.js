import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';

const CREATE_TASK_MUTATION = gql`
  mutation CreateTask($title: String!, $status: String!, $projectId: Int!) {
    createTask(title: $title, status: $status, projectId: $projectId) {
      id
      title
      status
      projectId
    }
  }
`;

const PROJECT_QUERY = gql`
  query GetProject($id: Int!) {
    project(id: $id) {
      id
      name
      description
      ownerId
    }
    tasks {
      id
      title
      status
      projectId
    }
  }
`;

function CreateTask({ projectId }) {
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('TODO');
  const [createTask, { loading, error }] = useMutation(CREATE_TASK_MUTATION);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await createTask({ 
        variables: { title, status, projectId },
        refetchQueries: [
          { query: PROJECT_QUERY, variables: { id: projectId } }
        ],
        awaitRefetchQueries: true
      });
      console.log("[DEBUG] Tâche créée :", result.data.createTask);
      setTitle('');
    } catch (err) {
      console.error("[DEBUG] Erreur lors de la création de la tâche :", err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Titre de la tâche"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
      />
      <select value={status} onChange={e => setStatus(e.target.value)}>
        <option value="TODO">À faire</option>
        <option value="IN_PROGRESS">En cours</option>
        <option value="DONE">Terminé</option>
      </select>
      <button type="submit">Ajouter la tâche</button>
      {loading && <p>Envoi...</p>}
      {error && <p>Erreur lors de la création de la tâche.</p>}
    </form>
  );
}

export default CreateTask;
