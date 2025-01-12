// client/src/pages/MyProjects.js
import React, { useContext } from 'react';
import { useQuery, gql } from '@apollo/client';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

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

function MyProjects() {
  const { user } = useContext(AuthContext);
  const { loading, error, data } = useQuery(PROJECTS_QUERY);

  if (!user) {
    return <p>Veuillez vous connecter pour voir vos projets.</p>;
  }

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur lors du chargement des projets.</p>;

  // Filtrer les projets dont l'utilisateur est propriétaire
  const myProjects = data.projects.filter(
    project => project.ownerId === parseInt(user.id, 10)
  );

  return (
    <div>
      <h2>Mes Projets</h2>
      {myProjects.length === 0 ? (
        <p>Vous n'avez aucun projet.</p>
      ) : (
        <ul>
          {myProjects.map(project => (
            <li key={project.id}>
              <Link to={`/projects/${project.id}`}>{project.name}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MyProjects;
