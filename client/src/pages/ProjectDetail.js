// client/src/pages/ProjectDetail.js
import React from 'react';
import { useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import CreateTask from '../components/CreateTask';
import ChatBox from '../components/ChatBox';  
import EditTask from '../components/EditTask';
import { PROJECT_QUERY } from '../graphql/queries';

function ProjectDetail() {
  // Récupère l'ID du projet depuis les paramètres de l'URL
  const { id } = useParams();
  const projectId = parseInt(id, 10); // Conversion de l'ID en entier

  // Exécute la requête GraphQL pour récupérer les détails du projet et ses tâches
  const { loading, error, data } = useQuery(PROJECT_QUERY, {
    variables: { id: projectId },
    notifyOnNetworkStatusChange: true,
  });

  // Si les données sont en train de se charger, affiche un indicateur de progression
  if (loading) return <CircularProgress />;
  
  // Si une erreur survient lors de la récupération des détails du projet, affiche un message d'erreur
  if (error) return <Alert severity="error">Erreur lors du chargement des détails du projet.</Alert>;

  // Déstructure les données du projet et des tâches depuis la réponse de la requête
  const { project, tasks } = data;
  
  // Filtre les tâches associées à ce projet particulier
  const projectTasks = tasks.filter(task => Number(task.projectId) === projectId);

  return (
    <Container>
      {/* Titre principal du projet */}
      <Typography variant="h4" gutterBottom>Détails du Projet</Typography>
      
      {/* Nom et description du projet */}
      <Typography variant="h5">{project.name}</Typography>
      <Typography variant="body1" paragraph>{project.description}</Typography>

      {/* Titre des tâches associées */}
      <Typography variant="h6">Tâches associées :</Typography>

      {/* Si aucune tâche n'est associée à ce projet, affiche un message d'information */}
      {projectTasks.length === 0 ? (
        <Alert severity="info">Aucune tâche associée à ce projet.</Alert>
      ) : (
        <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
          {/* Liste des tâches associées au projet */}
          <List>
            {projectTasks.map(task => (
              <ListItem
                key={task.id}
                secondaryAction={<EditTask task={task} projectId={projectId} />} // Permet d'éditer la tâche
              >
                {/* Affiche le titre et le statut de chaque tâche */}
                <ListItemText primary={`${task.title} - ${task.status}`} />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      {/* Composant pour créer une nouvelle tâche */}
      <CreateTask projectId={projectId} />

      {/* Section pour les commentaires du projet */}
      <Typography variant="h6" sx={{ mt: 4 }}>Commentaires du Projet :</Typography>
      {/* Composant pour afficher et ajouter des commentaires */}
      <ChatBox projectId={projectId} />  
    </Container>
  );
}

export default ProjectDetail;
