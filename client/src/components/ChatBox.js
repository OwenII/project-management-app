import React, { useState, useContext } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
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

const COMMENTS_QUERY = gql`
  query CommentsByProject($projectId: Int!) {
    commentsByProject(projectId: $projectId) {
      id
      content
      author {
        id
        username
      }
    }
  }
`;

const CREATE_COMMENT_MUTATION = gql`
  mutation CreateComment($content: String!, $authorId: Int!, $projectId: Int) {
    createComment(content: $content, authorId: $authorId, projectId: $projectId) {
      id
      content
      authorId
    }
  }
`;

const UPDATE_COMMENT_MUTATION = gql`
  mutation UpdateComment($id: Int!, $content: String!) {
    updateComment(id: $id, content: $content) {
      id
      content
      author {
        id
        username
      }
    }
  }
`;

const DELETE_COMMENT_MUTATION = gql`
  mutation DeleteComment($id: Int!) {
    deleteComment(id: $id) {
      id
      content
      author {
        id
        username
      }
    }
  }
`;

function ChatBox({ projectId }) {
  const { user } = useContext(AuthContext);
  const { loading, error, data } = useQuery(COMMENTS_QUERY, {
    variables: { projectId },
    pollInterval: 2000,
  });

  const [createComment] = useMutation(CREATE_COMMENT_MUTATION);
  const [updateComment] = useMutation(UPDATE_COMMENT_MUTATION);
  const [deleteComment] = useMutation(DELETE_COMMENT_MUTATION);

  const [message, setMessage] = useState('');
  const [userColors, setUserColors] = useState({});

  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingContent, setEditingContent] = useState('');
  const [showModal, setShowModal] = useState(false);

  const getColorForUser = (username) => {
    if (!userColors[username]) {
      const color = '#' + Math.floor(Math.random() * 16777215).toString(16);
      setUserColors(prev => ({ ...prev, [username]: color }));
      return color;
    }
    return userColors[username];
  };

  function parseContent(content) {
    const parts = content.split(/(@\w+)/g);
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

  if (!user) return <Typography>Veuillez vous connecter pour accéder au chat.</Typography>;
  if (loading) return <Typography>Chargement des messages...</Typography>;
  if (error) return <Typography color="error">Erreur lors du chargement des messages.</Typography>;

  const messages = data.commentsByProject;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (message.trim() === '') return;

    try {
      await createComment({
        variables: {
          content: message,
          authorId: parseInt(user.id, 10),
          projectId: parseInt(projectId, 10),
        },
      });
      setMessage('');
    } catch (err) {
      console.error("Erreur lors de l'envoi du message:", err);
    }
  };

  const startEditing = (msg) => {
    setEditingCommentId(parseInt(msg.id, 10));
    setEditingContent(msg.content);
    setShowModal(true);
  };

  const handleUpdate = async () => {
    try {
      await updateComment({
        variables: { id: editingCommentId, content: editingContent },
      });
    } catch (err) {
      console.error("Erreur lors de la modification :", err);
    }
    setShowModal(false);
    setEditingCommentId(null);
    setEditingContent('');
  };

  const handleDelete = async () => {
    try {
      await deleteComment({ variables: { id: editingCommentId } });
    } catch (err) {
      console.error("Erreur lors de la suppression :", err);
    }
    setShowModal(false);
    setEditingCommentId(null);
    setEditingContent('');
  };

  return (
    <Container>
      <Paper
        variant="outlined"
        sx={{ height: 300, overflowY: 'scroll', p: 2, mb: 2 }}
      >
        {messages.map((msg) => {
          const username = msg.author ? msg.author.username : "Utilisateur inconnu";
          return (
            <Typography
              key={msg.id}
              sx={{ color: getColorForUser(username), mb: 1 }}
            >
              [{username}] : {parseContent(msg.content)}
              {String(msg.author?.id) === String(user.id) && (
                <IconButton
                  size="small"
                  onClick={() => startEditing(msg)}
                  sx={{ ml: 1 }}
                >
                  <Edit fontSize="small" />
                </IconButton>
              )}
            </Typography>
          );
        })}
      </Paper>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Votre message..."
          value={message}
          onChange={e => setMessage(e.target.value)}
        />
        <Button variant="contained" color="primary" type="submit">
          Envoyer
        </Button>
      </form>

      <Dialog open={showModal} onClose={() => setShowModal(false)}>
        <DialogTitle>Modifier/Supprimer le commentaire</DialogTitle>
        <DialogContent>
          <TextField
            multiline
            rows={4}
            value={editingContent}
            onChange={e => setEditingContent(e.target.value)}
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
