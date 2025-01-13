import React, { useContext, useState, useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
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
  Button,
  IconButton,
  CircularProgress,
  Snackbar,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

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
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilter(filter);
    }, 300);
    return () => clearTimeout(timer);
  }, [filter]);

  const { loading, error, data, refetch } = useQuery(PROJECTS_QUERY, {
    variables: { filter: debouncedFilter },
  });

  if (!user) {
    return (
      <Container>
        <Typography variant="h6" align="center" gutterBottom>
          Veuillez vous connecter pour voir vos projets.
        </Typography>
      </Container>
    );
  }

  const handleProjectCreated = (newProject) => {
    refetch();
    setSnackbar({ open: true, message: 'Projet créé avec succès!', severity: 'success' });
  };

  const handleProjectDeleted = () => {
    refetch();
    setSnackbar({ open: true, message: 'Projet supprimé avec succès!', severity: 'info' });
  };

  const handleProjectUpdated = () => {
    setEditingProject(null);
    refetch();
    setSnackbar({ open: true, message: 'Projet mis à jour avec succès!', severity: 'success' });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom>
        Liste des Projets
      </Typography>

      {/* Champ de recherche */}
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
        ownerId={parseInt(user.id, 10)}
        onProjectCreated={handleProjectCreated}
      />

      {/* Gestion des états de chargement et d'erreur */}
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
          {data.projects.map((project) => (
            <Grid item xs={12} sm={6} md={4} key={project.id}>
              <Card>
                <CardContent>
                  <Typography variant="h5" component="div">
                    <Link to={`/projects/${project.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      {project.name}
                    </Link>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {project.description}
                  </Typography>
                </CardContent>
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
                {editingProject === project.id && (
                  <UpdateProjectForm
                    project={project}
                    onProjectUpdated={handleProjectUpdated}
                  />
                )}
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Snackbar pour les notifications */}
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
