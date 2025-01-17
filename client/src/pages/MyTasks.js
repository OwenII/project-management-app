import React, { useContext, useEffect } from 'react';
import { useQuery } from '@apollo/client';
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
import { PROJECTS_QUERY } from '../graphql/queries';

function MyProjects() {
  // Récupère l'utilisateur depuis le contexte d'authentification
  const { user } = useContext(AuthContext);

  // Exécute la requête GraphQL pour récupérer les projets
  const { loading, error, data, refetch } = useQuery(PROJECTS_QUERY, {
    notifyOnNetworkStatusChange: true, // Permet d'obtenir des notifications de changement d'état réseau
  });

  // Utilise un effet secondaire pour forcer la mise à jour de la requête dès que le composant est monté
  useEffect(() => {
    if (user) {
      refetch();  // Recharger les données dès que l'utilisateur est défini
    }
  }, [user, refetch]);  // L'effet s'exécute uniquement si l'utilisateur change

  // Si l'utilisateur n'est pas connecté, on affiche un message d'avertissement
  if (!user) {
    return (
      <Container>
        <Alert severity="warning">Veuillez vous connecter pour voir vos projets.</Alert>
      </Container>
    );
  }

  // Si la requête est en cours de chargement, on affiche un indicateur de progression
  if (loading) return <CircularProgress />;

  // Si une erreur survient pendant la récupération des projets, on l'affiche
  if (error) return <Alert severity="error">Erreur lors du chargement des projets.</Alert>;

  // Filtre les projets pour n'afficher que ceux appartenant à l'utilisateur
  const myProjects = data.projects.filter(
    project => project.ownerId === parseInt(user.id, 10)
  );

  return (
    <Container>
      {/* Titre de la page */}
      <Typography variant="h4" gutterBottom>Mes Projets</Typography>

      {/* Si l'utilisateur n'a aucun projet, affiche un message d'information */}
      {myProjects.length === 0 ? (
        <Alert severity="info">Vous n'avez aucun projet.</Alert>
      ) : (
        <Paper variant="outlined" sx={{ p: 2 }}>
          {/* Liste des projets */}
          <List>
            {myProjects.map(project => (
              <ListItem 
                button 
                key={project.id} 
                component={RouterLink} 
                to={`/projects/${project.id}`}
              >
                {/* Affichage du nom et de la description de chaque projet */}
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
