import React, { useContext, useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Importation du contexte
import CreateProjectForm from '../components/CreateProjectForm';
import DeleteProjectButton from '../components/DeleteProjectButton';
import UpdateProjectForm from '../components/UpdateProjectForm';

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
  const { user } = useContext(AuthContext); // Récupération de l'utilisateur connecté

  // Query Apollo
  const { loading, error, data, refetch } = useQuery(PROJECTS_QUERY);
  const [editingProject, setEditingProject] = useState(null);

  // Log pour voir les données de l'utilisateur
  console.log('[DEBUG] Utilisateur connecté :', user);

  if (!user) {
    return <p>Veuillez vous connecter pour voir vos projets.</p>;
  }

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur lors du chargement des projets.</p>;

  const handleProjectCreated = (newProject) => {
    console.log('[DEBUG] Nouveau projet créé :', newProject);
    refetch();
  };

  const handleProjectDeleted = () => {
    console.log('[DEBUG] Projet supprimé, rafraîchissement des données');
    refetch();
  };

  const handleProjectUpdated = () => {
    console.log('[DEBUG] Projet mis à jour, rafraîchissement des données');
    setEditingProject(null);
    refetch();
  };

  console.log('[DEBUG] Projets récupérés :', data.projects);

  return (
    <div>
      <h2>Liste des Projets</h2>
    
      <CreateProjectForm
        ownerId={parseInt(user.id, 10)} // On passe l'ownerId en tant qu'entier
        onProjectCreated={handleProjectCreated}
      />

      <ul>
        {data.projects.map((project) => (
          <li key={project.id}>
            {editingProject === project.id ? (
              <UpdateProjectForm
                project={project}
                onProjectUpdated={handleProjectUpdated}
              />
            ) : (
              <>
                <Link to={`/projects/${project.id}`}>{project.name}</Link>
                {project.ownerId === user.id && ( 
                  <>
                    <button onClick={() => setEditingProject(project.id)}>Modifier</button>
                    <DeleteProjectButton
                      projectId={project.id}
                      onProjectDeleted={handleProjectDeleted}
                    />
                  </>
                )}
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProjectsList;
