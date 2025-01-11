// client/src/pages/ProjectsList.js
import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { Link } from 'react-router-dom';

const PROJECTS_QUERY = gql`
  query GetProjects {
    projects {
      id
      name
      description
      ownerId
    }
  }
`;

function ProjectsList() {
  const { loading, error, data } = useQuery(PROJECTS_QUERY);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur lors du chargement des projets.</p>;

  console.log("[DEBUG] Liste des projets :", data);

  if (data.projects.length === 0) {
    return <p>Aucun projet disponible. Vous pouvez en créer un nouveau.</p>;
  }

  return (
    <div>
      <h2>Liste des Projets</h2>
      <ul>
        {data.projects.map(project => (
          <li key={project.id}>
            <Link to={`/projects/${project.id}`}>{project.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}


export default ProjectsList;
