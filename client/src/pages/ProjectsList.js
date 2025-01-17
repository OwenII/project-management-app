// client/src/pages/ProjectsList.js
import React, { useContext, useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import CreateProjectForm from '../components/CreateProjectForm';
import DeleteProjectButton from '../components/DeleteProjectButton';
import UpdateProjectForm from '../components/UpdateProjectForm';
import {
  Container,
  Typography,
  TextField,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  CircularProgress,
  Snackbar,
} from '@mui/material';
import { Edit } from '@mui/icons-material';
import { PROJECTS_QUERY_FILTER } from '../graphql/queries';

function ProjectsList() {
  // Accède au contexte d'authentification pour obtenir l'utilisateur connecté
  const { user } = useContext(AuthContext);

  // Déclare des états pour gérer le filtre de recherche et les projets en cours d'édition
  const [filter, setFilter] = useState("");
  const [debouncedFilter, setDebouncedFilter] = useState(filter);
  const [editingProject, setEditingProject] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Utilisation d'un useEffect pour gérer un filtre avec un délai de 300ms (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilter(filter);
    }, 300);
    return () => clearTimeout(timer); // Nettoyage du timer pour éviter des appels inutiles
  }, [filter]);

  // Exécute la requête GraphQL pour récupérer les projets filtrés selon le filtre entré par l'utilisateur
  const { loading, error, data, refetch } = useQuery(PROJECTS_QUERY_FILTER, {
    variables: { filter: debouncedFilter },
  });

  // Si l'utilisateur n'est pas connecté, on affiche un message d'avertissement
  if (!user) {
    return (
      <Container>
        <Typography variant="h6" align="center" gutterBottom>
          Veuillez vous connecter pour voir vos projets.
        </Typography>
      </Container>
    );
  }

  // Gestion des callbacks pour les notifications et la mise à jour des projets
  const handleProjectCreated = (newProject) => {
    refetch(); // Rafraîchit la liste des projets
    setSnackbar({ open: true, message: 'Projet créé avec succès!', severity: 'success' });
  };

  const handleProjectDeleted = () => {
    refetch(); // Rafraîchit la liste après suppression
    setSnackbar({ open: true, message: 'Projet supprimé avec succès!', severity: 'info' });
  };

  const handleProjectUpdated = () => {
    setEditingProject(null); // Annule l'édition du projet
    refetch(); // Rafraîchit la liste des projets
    setSnackbar({ open: true, message: 'Projet mis à jour avec succès!', severity: 'success' });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false }); // Ferme le snackbar après la notification
  };

  return (
    <Container>
      {/* Titre de la page */}
      <Typography variant="h4" align="center" gutterBottom>
        Liste des Projets
      </Typography>

      {/* Champ de recherche pour filtrer les projets par nom */}
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Filtrer par nom de projet..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        margin="normal"
        InputProps={{
          startAdornment: <Edit />,
        }}
      />

      {/* Formulaire de création de projet */}
      <CreateProjectForm
        ownerId={parseInt(user.id, 10)} // Utilise l'ID de l'utilisateur pour l'attribution du projet
        onProjectCreated={handleProjectCreated}
      />

      {/* Affichage des projets avec gestion de l'état de chargement et d'erreur */}
      {loading ? (
        <Grid container justifyContent="center" style={{ marginTop: '2rem' }}>
          <CircularProgress />
        </Grid>
      ) : error ? (
        <Typography color="error" align="center" style={{ marginTop: '2rem' }}>
          Erreur lors du chargement des projets.
        </Typography>
      ) : (
        <Grid container spacing={3} style={{ marginTop: '1rem' }}>
          {/* Affiche chaque projet sous forme de carte */}
          {data.projects.map((project) => (
            <Grid item xs={12} sm={6} md={4} key={project.id}>
              <Link to={`/projects/${project.id}`} style={{ textDecoration: 'none' }}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    '&:hover': {
                      boxShadow: 4, // Effet au survol
                    },
                  }}
                >
                  <CardContent>
                    <Typography variant="h5" component="div">
                      {project.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {project.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Link>
              {/* Permet de modifier ou supprimer un projet si l'utilisateur est le propriétaire */}
              {project.ownerId === user.id && (
                <CardActions>
                  <IconButton color="primary" onClick={() => setEditingProject(project.id)}>
                    <Edit />
                  </IconButton>
                  <DeleteProjectButton
                    projectId={project.id}
                    onProjectDeleted={handleProjectDeleted}
                  />
                </CardActions>
              )}
              {/* Formulaire de mise à jour de projet affiché si l'utilisateur édite un projet */}
              {editingProject === project.id && (
                <UpdateProjectForm project={project} onProjectUpdated={handleProjectUpdated} />
              )}
            </Grid>          
          ))}
        </Grid>
      )}

      {/* Snackbar pour afficher les messages de notification */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbar.message}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Container>
  );
}

export default ProjectsList;
