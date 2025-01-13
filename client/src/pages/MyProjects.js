// client/src/pages/MyProjects.js
import React, { useContext } from 'react';
import { useQuery, gql } from '@apollo/client';
import { Link as RouterLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  Container,
  Typography,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  Paper,
} from '@mui/material';

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
    return (
      <Container>
        <Alert severity="warning">Veuillez vous connecter pour voir vos projets.</Alert>
      </Container>
    );
  }

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">Erreur lors du chargement des projets.</Alert>;

  const myProjects = data.projects.filter(
    project => project.ownerId === parseInt(user.id, 10)
  );

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Mes Projets</Typography>
      {myProjects.length === 0 ? (
        <Alert severity="info">Vous n'avez aucun projet.</Alert>
      ) : (
        <Paper variant="outlined" sx={{ p: 2 }}>
          <List>
            {myProjects.map(project => (
              <ListItem 
                button 
                key={project.id} 
                component={RouterLink} 
                to={`/projects/${project.id}`}
              >
                <ListItemText primary={project.name} secondary={project.description} />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Container>
  );
}

export default MyProjects;
