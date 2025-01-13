// client/src/pages/ProjectDetail.js
import React from 'react';
import { useQuery, gql } from '@apollo/client';
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

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">Erreur lors du chargement des détails du projet.</Alert>;

  const { project, tasks } = data;
  const projectTasks = tasks.filter(task => Number(task.projectId) === projectId);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Détails du Projet</Typography>
      <Typography variant="h5">{project.name}</Typography>
      <Typography variant="body1" paragraph>{project.description}</Typography>

      <Typography variant="h6">Tâches associées :</Typography>
      {projectTasks.length === 0 ? (
        <Alert severity="info">Aucune tâche associée à ce projet.</Alert>
      ) : (
        <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
          <List>
            {projectTasks.map(task => (
              <ListItem
                key={task.id}
                secondaryAction={<EditTask task={task} projectId={projectId} />}
              >
                <ListItemText primary={`${task.title} - ${task.status}`} />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      <CreateTask projectId={projectId} />

      <Typography variant="h6" sx={{ mt: 4 }}>Commentaires du Projet :</Typography>
      <ChatBox projectId={projectId} />  
    </Container>
  );
}

export default ProjectDetail;
