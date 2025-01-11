import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { useParams } from 'react-router-dom';
import CreateTask from '../components/CreateTask';

console.log("[DEBUG] Chargement de ProjectDetail.js");

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

function ProjectDetail() {
  const { id } = useParams();
  const projectId = parseInt(id, 10);

  const { loading, error, data } = useQuery(PROJECT_QUERY, {
    variables: { id: projectId },
    notifyOnNetworkStatusChange: true,
  });

  if (loading) {
    console.log("[DEBUG] Chargement des données...");
    return <p>Chargement...</p>;
  }

  if (error) {
    console.error("[DEBUG] Erreur lors du chargement des données :", error);
    return <p>Erreur lors du chargement des détails du projet.</p>;
  }

  console.log("[DEBUG] Données reçues :", data);

  const { project, tasks } = data;

  console.log("[DEBUG] Tâches brutes :", tasks);

  const projectTasks = tasks.filter(task => {
    console.log(
      `[DEBUG] Comparaison : task.projectId (${task.projectId}) === projectId (${projectId})`,
      task.projectId === projectId
    );
    return Number(task.projectId) === Number(projectId);
  });

  console.log("[DEBUG] Tâches après filtrage :", projectTasks);

  return (
    <div>
      <h2>Détails du Projet</h2>
      <h3>{project.name}</h3>
      <p>{project.description}</p>

      <h4>Tâches associées :</h4>
      {projectTasks.length === 0 ? (
        <p>Aucune tâche associée à ce projet.</p>
      ) : (
        <ul>
          {projectTasks.map(task => {
            console.log("[DEBUG] Rendu de la tâche :", task);
            return <li key={task.id}>{task.title} - {task.status}</li>;
          })}
        </ul>
      )}

      <CreateTask projectId={projectId} />
    </div>
  );
}

export default ProjectDetail;
