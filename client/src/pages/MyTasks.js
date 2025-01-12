// client/src/pages/MyTasks.js
import React, { useContext } from 'react';
import { useQuery, gql } from '@apollo/client';
import { AuthContext } from '../context/AuthContext';

const TASKS_PROJECTS_QUERY = gql`
  query GetTasksAndProjects {
    tasks {
      id
      title
      status
      projectId
    }
    projects {
      id
      ownerId
    }
  }
`;

function MyTasks() {
  const { user } = useContext(AuthContext);
  const { loading, error, data } = useQuery(TASKS_PROJECTS_QUERY);

  if (!user) {
    return <p>Veuillez vous connecter pour voir vos tâches.</p>;
  }

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur lors du chargement des tâches.</p>;

  // Filtrer les projets appartenant à l'utilisateur
  const myProjectIds = data.projects
    .filter(project => project.ownerId === parseInt(user.id, 10))
    .map(project => project.id);

  // Filtrer les tâches associées aux projets de l'utilisateur
  const myTasks = data.tasks.filter(task => myProjectIds.includes(task.projectId));

  return (
    <div>
      <h2>Mes Tâches</h2>
      {myTasks.length === 0 ? (
        <p>Vous n'avez aucune tâche assignée.</p>
      ) : (
        <ul>
          {myTasks.map(task => (
            <li key={task.id}>
              {task.title} - {task.status} (Projet ID: {task.projectId})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MyTasks;
