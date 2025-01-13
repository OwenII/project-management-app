// client/src/components/EditTask.js
import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { UPDATE_TASK, DELETE_TASK } from '../graphql/mutations';
import { gql as apolloGql } from '@apollo/client';
import { TASKS_PROJECTS_QUERY } from '../graphql/mutations';  

const PROJECT_QUERY = apolloGql`
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
      <button onClick={() => setIsOpen(true)}>✏️</button>
      {isOpen && (
        <div className="modal">
          <h3>Modifier la Tâche</h3>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <select value={status} onChange={e => setStatus(e.target.value)}>
            <option value="TODO">À faire</option>
            <option value="IN_PROGRESS">En cours</option>
            <option value="DONE">Terminé</option>
          </select>
          <button onClick={handleUpdate}>Mettre à jour</button>
          <button onClick={handleDelete}>Supprimer</button>
          <button onClick={() => setIsOpen(false)}>Annuler</button>
        </div>
      )}
    </>
  );
}

export default EditTask;
