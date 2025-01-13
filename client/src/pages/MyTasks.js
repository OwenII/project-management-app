import React, { useContext, useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import { AuthContext } from '../context/AuthContext';
import EditTask from '../components/EditTask'; 
import { TASKS_PROJECTS_QUERY } from '../graphql/mutations';  

function MyTasks() {
  const { user } = useContext(AuthContext);
  
  // États pour le filtrage
  const [nameFilter, setNameFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

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

  const myTasks = data.tasks;

  // Appliquer les filtres sur les tâches
  const filteredTasks = myTasks.filter(task => {
    const matchesName = task.title.toLowerCase().includes(nameFilter.toLowerCase());
    const matchesStatus = statusFilter === "" || task.status === statusFilter;
    return matchesName && matchesStatus;
  });

  return (
    <div>
      <h2>Mes Tâches</h2>

      {/* Barres de filtre */}
      <input
        type="text"
        placeholder="Filtrer par nom de tâche..."
        value={nameFilter}
        onChange={(e) => setNameFilter(e.target.value)}
      />
      <select 
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
      >
        <option value="">Tous les statuts</option>
        <option value="TODO">TODO</option>
        <option value="IN_PROGRESS">IN_PROGRESS</option>
        <option value="DONE">DONE</option>
      </select>

      {filteredTasks.length === 0 ? (
        <p>Vous n'avez aucune tâche assignée.</p>
      ) : (
        <ul>
          {filteredTasks.map(task => (
            <li key={task.id}>
              {task.title} - {task.status} (Projet ID: {task.projectId})
              <EditTask task={task} projectId={task.projectId} /> 
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MyTasks;
