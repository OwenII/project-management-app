import React, { useContext, useState, useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import CreateProjectForm from '../components/CreateProjectForm';
import DeleteProjectButton from '../components/DeleteProjectButton';
import UpdateProjectForm from '../components/UpdateProjectForm';

const PROJECTS_QUERY = gql`
  query GetProjects($filter: String) {
    projects(filter: $filter) {
      id
      name
      description
      ownerId
    }
  }
`;

function ProjectsList() {
  const { user } = useContext(AuthContext);
  const [filter, setFilter] = useState("");
  const [debouncedFilter, setDebouncedFilter] = useState(filter);
  const [editingProject, setEditingProject] = useState(null);

  // Met à jour la valeur filtrée avec un délai (debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilter(filter);
    }, 300); // 300ms de délai
    return () => clearTimeout(timer); // Nettoie le timer précédent
  }, [filter]);

  // Utilisation de la variable debouncedFilter dans la requête
  const { loading, error, data, refetch } = useQuery(PROJECTS_QUERY, {
    variables: { filter: debouncedFilter },
  });

  if (!user) {
    return <p>Veuillez vous connecter pour voir vos projets.</p>;
  }

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur lors du chargement des projets.</p>;

  const handleProjectCreated = (newProject) => {
    refetch();
  };

  const handleProjectDeleted = () => {
    refetch();
  };

  const handleProjectUpdated = () => {
    setEditingProject(null);
    refetch();
  };

  return (
    <div>
      <h2>Liste des Projets</h2>
      
      {/* Champ de recherche pour le filtrage */}
      <input
        type="text"
        placeholder="Filtrer par nom de projet..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />

      <CreateProjectForm
        ownerId={parseInt(user.id, 10)}
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
                    <button onClick={() => setEditingProject(project.id)}>
                      Modifier
                    </button>
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
