// client/src/pages/MyTasks.js
import React, { useContext, useState } from 'react';
import { useQuery } from '@apollo/client';
import { AuthContext } from '../context/AuthContext';
import EditTask from '../components/EditTask'; 
import {
  Container,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  Paper,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { TASKS_PROJECTS_QUERY } from '../graphql/mutations';

function MyTasks() {
  const { user } = useContext(AuthContext);
  const [nameFilter, setNameFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const { loading, error, data } = useQuery(TASKS_PROJECTS_QUERY);

  if (!user) {
    return (
      <Container>
        <Alert severity="warning">Veuillez vous connecter pour voir vos tâches.</Alert>
      </Container>
    );
  }
  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">Erreur lors du chargement des tâches.</Alert>;

  const myTasks = data.tasks;

  const filteredTasks = myTasks.filter(task => {
    const matchesName = task.title.toLowerCase().includes(nameFilter.toLowerCase());
    const matchesStatus = statusFilter === "" || task.status === statusFilter;
    return matchesName && matchesStatus;
  });

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Mes Tâches</Typography>

      <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
        <TextField
          label="Filtrer par nom de tâche..."
          variant="outlined"
          fullWidth
          value={nameFilter}
          onChange={e => setNameFilter(e.target.value)}
          sx={{ mb: 2 }}
        />
        <FormControl fullWidth variant="outlined">
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="">Tous les statuts</MenuItem>
            <MenuItem value="TODO">TODO</MenuItem>
            <MenuItem value="IN_PROGRESS">IN_PROGRESS</MenuItem>
            <MenuItem value="DONE">DONE</MenuItem>
          </Select>
        </FormControl>
      </Paper>

      {filteredTasks.length === 0 ? (
        <Alert severity="info">Vous n'avez aucune tâche assignée.</Alert>
      ) : (
        <Paper variant="outlined" sx={{ p: 2 }}>
          <List>
            {filteredTasks.map(task => (
              <ListItem 
                key={task.id}
                secondaryAction={<EditTask task={task} projectId={task.projectId} />}
              >
                <ListItemText 
                  primary={`${task.title} - ${task.status}`} 
                  secondary={`Projet ID: ${task.projectId}`} 
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Container>
  );
}

export default MyTasks;
