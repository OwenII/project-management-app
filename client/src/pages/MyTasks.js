// client/src/pages/MyTasks.js
import React, { useContext, useState, useEffect } from 'react';  // Importation de React et des hooks nécessaires
import { useQuery } from '@apollo/client';  // Importation du hook useQuery pour effectuer des requêtes GraphQL
import { AuthContext } from '../context/AuthContext';  // Importation du contexte d'authentification
import EditTask from '../components/EditTask';  // Importation du composant pour éditer les tâches
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
} from '@mui/material';  // Importation des composants Material UI
import { TASKS_PROJECTS_QUERY } from '../graphql/queries';  // Importation de la requête GraphQL

function MyTasks() {
  const { user } = useContext(AuthContext);  // Récupération de l'utilisateur à partir du contexte d'authentification
  const [nameFilter, setNameFilter] = useState("");  // État pour filtrer par nom de tâche
  const [statusFilter, setStatusFilter] = useState("");  // État pour filtrer par statut de tâche
  const { loading, error, data, refetch } = useQuery(TASKS_PROJECTS_QUERY);  // Exécution de la requête GraphQL pour récupérer les tâches et projets

  // Utilise un effet secondaire pour forcer la mise à jour de la requête dès que le composant est monté
  useEffect(() => {
    if (user) {
      refetch();  // Recharger les données dès que l'utilisateur est défini
    }
  }, [user, refetch]);  // L'effet s'exécute uniquement si l'utilisateur change

  // Si l'utilisateur n'est pas connecté, afficher un message d'avertissement
  if (!user) {
    return (
      <Container>
        <Alert severity="warning">Veuillez vous connecter pour voir vos tâches.</Alert>
      </Container>
    );
  }

  // Si les données sont en cours de chargement, afficher un indicateur de chargement
  if (loading) return <CircularProgress />;

  // Si une erreur se produit lors du chargement des données, afficher un message d'erreur
  if (error) return <Alert severity="error">Erreur lors du chargement des tâches.</Alert>;

  const myTasks = data.tasks;  // Récupération des tâches depuis la réponse de la requête GraphQL

  // Filtrer les tâches en fonction des filtres (nom et statut)
  const filteredTasks = myTasks.filter(task => {
    const matchesName = task.title.toLowerCase().includes(nameFilter.toLowerCase());  // Vérifie si le titre de la tâche correspond au filtre de nom
    const matchesStatus = statusFilter === "" || task.status === statusFilter;  // Vérifie si le statut de la tâche correspond au filtre de statut
    return matchesName && matchesStatus;  // Retourne vrai si la tâche correspond aux deux filtres
  });

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Mes Tâches</Typography>  {/* Titre de la page */}

      {/* Section des filtres */}
      <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
        <TextField
          label="Filtrer par nom de tâche..."
          variant="outlined"
          fullWidth
          value={nameFilter}
          onChange={e => setNameFilter(e.target.value)}  // Met à jour le filtre de nom
          sx={{ mb: 2 }}
        />
        <FormControl fullWidth variant="outlined">
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => setStatusFilter(e.target.value)}  // Met à jour le filtre de statut
          >
            <MenuItem value="">Tous les statuts</MenuItem>
            <MenuItem value="TODO">TODO</MenuItem>
            <MenuItem value="IN_PROGRESS">IN_PROGRESS</MenuItem>
            <MenuItem value="DONE">DONE</MenuItem>
          </Select>
        </FormControl>
      </Paper>

      {/* Si aucune tâche n'est trouvée après le filtrage, afficher un message d'information */}
      {filteredTasks.length === 0 ? (
        <Alert severity="info">Vous n'avez aucune tâche assignée.</Alert>
      ) : (
        // Si des tâches sont disponibles, les afficher dans une liste
        <Paper variant="outlined" sx={{ p: 2 }}>
          <List>
            {filteredTasks.map(task => (
              <ListItem 
                key={task.id}
                secondaryAction={<EditTask task={task} projectId={task.projectId} />}  // Permet d'éditer chaque tâche
              >
                <ListItemText 
                  primary={`${task.title} - ${task.status}`}  // Affiche le titre et le statut de la tâche
                  secondary={`Projet ID: ${task.projectId}`}  // Affiche l'ID du projet associé à la tâche
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
