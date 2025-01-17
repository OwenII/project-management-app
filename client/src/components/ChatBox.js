// client/src/components/ChatBox.js
import React, { useState, useContext, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { AuthContext } from '../context/AuthContext';
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Edit } from '@mui/icons-material';

import { COMMENTS_QUERY } from '../graphql/queries';
import { CREATE_COMMENT_MUTATION, UPDATE_COMMENT_MUTATION, DELETE_COMMENT_MUTATION } from '../graphql/mutations';

function ChatBox({ projectId }) {
  const { user } = useContext(AuthContext); // Récupère l'utilisateur connecté depuis le contexte d'authentification
  const { loading, error, data, startPolling, stopPolling } = useQuery(COMMENTS_QUERY, {
    variables: { projectId }, // Récupère les commentaires liés à un projet spécifique
    pollInterval: 2000, // Intervalles de 2 secondes pour récupérer les nouveaux messages
  });

  // Mutation pour la création, modification et suppression de commentaires
  const [createComment] = useMutation(CREATE_COMMENT_MUTATION);
  const [updateComment] = useMutation(UPDATE_COMMENT_MUTATION);
  const [deleteComment] = useMutation(DELETE_COMMENT_MUTATION);

  // États locaux pour gérer les messages, les couleurs des utilisateurs, et l'édition des commentaires
  const [message, setMessage] = useState('');
  const [userColors, setUserColors] = useState({});
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingContent, setEditingContent] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Fonction pour générer une couleur unique pour chaque utilisateur
  const getColorForUser = (username) => {
    if (!userColors[username]) {
      const color = '#' + Math.floor(Math.random() * 16777215).toString(16); // Génère une couleur hexadécimale aléatoire
      setUserColors((prev) => ({ ...prev, [username]: color }));
      return color;
    }
    return userColors[username];
  };

  // Fonction pour parser le contenu du commentaire et mettre en évidence les mentions
  function parseContent(content) {
    const parts = content.split(/(@\w+)/g); // Sépare le texte par les mentions
    return parts.map((part, index) =>
      part.startsWith('@') ? (
        <span key={index} style={{ fontWeight: 'bold', color: 'blue' }}>
          {part}
        </span>
      ) : (
        <span key={index}>{part}</span>
      )
    );
  }

  // Gère la visibilité de la page (arrête/reprend le polling quand l'utilisateur change d'onglet)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopPolling(); // Arrêter le polling si l'onglet devient invisible
      } else {
        startPolling(2000); // Reprendre le polling toutes les 2 secondes si l'onglet devient visible
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      stopPolling(); // Arrêter le polling en cas de démontage du composant
    };
  }, [startPolling, stopPolling]);

  // Si l'utilisateur n'est pas connecté, affiche un message pour l'inviter à se connecter
  if (!user) return <Typography>Veuillez vous connecter pour accéder au chat.</Typography>;
  
  // Si les données sont en train de se charger ou s'il y a une erreur, afficher un message correspondant
  if (loading) return <Typography>Chargement des messages...</Typography>;
  if (error) return <Typography color="error">Erreur lors du chargement des messages.</Typography>;

  const messages = data.commentsByProject;

  // Fonction pour envoyer un nouveau commentaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (message.trim() === '') return; // Ne rien envoyer si le message est vide

    try {
      await createComment({
        variables: {
          content: message,
          authorId: parseInt(user.id, 10),
          projectId: parseInt(projectId, 10),
        },
      });
      setMessage(''); // Réinitialise le champ de message après l'envoi
    } catch (err) {
      console.error("Erreur lors de l'envoi du message:", err);
    }
  };

  // Fonction pour commencer l'édition d'un commentaire
  const startEditing = (msg) => {
    setEditingCommentId(parseInt(msg.id, 10));
    setEditingContent(msg.content);
    setShowModal(true); // Affiche la modale d'édition
  };

  // Fonction pour mettre à jour un commentaire
  const handleUpdate = async () => {
    try {
      await updateComment({
        variables: { id: editingCommentId, content: editingContent },
      });
    } catch (err) {
      console.error("Erreur lors de la modification :", err);
    }
    setShowModal(false); // Ferme la modale après la mise à jour
    setEditingCommentId(null);
    setEditingContent('');
  };

  // Fonction pour supprimer un commentaire
  const handleDelete = async () => {
    try {
      await deleteComment({ variables: { id: editingCommentId } });
    } catch (err) {
      console.error("Erreur lors de la suppression :", err);
    }
    setShowModal(false); // Ferme la modale après la suppression
    setEditingCommentId(null);
    setEditingContent('');
  };

  return (
    <Container>
      <Paper
        variant="outlined"
        sx={{ height: 300, overflowY: 'scroll', p: 2, mb: 2 }}
      >
        {/* Affiche les messages et les édite si l'utilisateur est le propriétaire du commentaire */}
        {messages.map((msg) => {
          const username = msg.author ? msg.author.username : 'Utilisateur inconnu';
          return (
            <Typography
              key={msg.id}
              sx={{ color: getColorForUser(username), mb: 1 }}
            >
              [{username}] : {parseContent(msg.content)}
              {String(msg.author?.id) === String(user.id) && (
                <IconButton
                  size="small"
                  onClick={() => startEditing(msg)} // Lancer l'édition pour ce commentaire
                  sx={{ ml: 1 }}
                >
                  <Edit fontSize="small" />
                </IconButton>
              )}
            </Typography>
          );
        })}
      </Paper>

      {/* Formulaire pour envoyer un nouveau message */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Votre message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button variant="contained" color="primary" type="submit">
          Envoyer
        </Button>
      </form>

      {/* Modale d'édition pour modifier ou supprimer un commentaire */}
      <Dialog open={showModal} onClose={() => setShowModal(false)}>
        <DialogTitle>Modifier/Supprimer le commentaire</DialogTitle>
        <DialogContent>
          <TextField
            multiline
            rows={4}
            value={editingContent}
            onChange={(e) => setEditingContent(e.target.value)}
            fullWidth
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUpdate} variant="contained" color="primary">
            Modifier
          </Button>
          <Button onClick={handleDelete} variant="contained" color="secondary">
            Supprimer
          </Button>
          <Button onClick={() => setShowModal(false)}>Annuler</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default ChatBox;
