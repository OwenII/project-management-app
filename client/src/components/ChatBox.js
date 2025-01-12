import React, { useState, useContext } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { AuthContext } from '../context/AuthContext';

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
  
  // Nouveaux états pour l'édition
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

  // Fonction pour afficher les mentions dans les commentaires
  function parseContent(content) {
    const parts = content.split(/(@\w+)/g);
    return parts.map((part, index) => {
      if (part.startsWith('@')) {
        return <span key={index} style={{ fontWeight: 'bold', color: 'blue' }}>{part}</span>;
      }
      return <span key={index}>{part}</span>;
    });
  }

  if (!user) return <p>Veuillez vous connecter pour accéder au chat.</p>;
  if (loading) return <p>Chargement des messages...</p>;
  if (error) return <p>Erreur lors du chargement des messages.</p>;

  const messages = data.commentsByProject;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (message.trim() === '') return;

    try {
      if (!user || !user.id) {
        console.error("Utilisateur non authentifié");
        return;
      }

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
    console.log("startEditing:", msg);
    setEditingCommentId(parseInt(msg.id, 10)); // Convert to integer
    setEditingContent(msg.content);
    setShowModal(true);
  };

  const handleUpdate = async () => {
    console.log("handleUpdate for comment ID:", editingCommentId);
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
    console.log("handleDelete for comment ID:", editingCommentId);
    try {
      await deleteComment({ variables: { id: editingCommentId } });
    } catch (err) {
      console.error("Erreur lors de la suppression :", err);
    }
    setShowModal(false);
    setEditingCommentId(null);
    setEditingContent('');
  };

  console.log("user.id:", user?.id);
  console.log("messages:", messages);

  return (
    <div>
      <div style={{ border: '1px solid #ccc', height: '300px', overflowY: 'scroll', padding: '10px', marginBottom: '10px' }}>
        {messages.map(msg => {
          const username = msg.author ? msg.author.username : "Utilisateur inconnu";
          console.log("msg.author?.id:", msg.author?.id, "user.id:", user?.id);  // Log comparison here
          return (
            <p key={msg.id} style={{ color: getColorForUser(username) }}>
              [{username}] : {parseContent(msg.content)}
              {/* Afficher le bouton crayon si le commentaire appartient à l'utilisateur connecté */}
              {String(msg.author?.id) === String(user.id) && (
                <button onClick={() => startEditing(msg)} style={{ marginLeft: '10px' }}>
                  ✏️
                </button>
              )}
            </p>
          );
        })}
      </div>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Votre message..." 
          value={message} 
          onChange={e => setMessage(e.target.value)} 
          required 
        />
        <button type="submit">Envoyer</button>
      </form>

      {/* Fenêtre modale pour éditer/supprimer un commentaire */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display:'flex',
          justifyContent:'center', alignItems:'center'
        }}>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '5px' }}>
            <h3>Modifier/Supprimer le commentaire</h3>
            <textarea 
              rows="4" 
              value={editingContent} 
              onChange={e => setEditingContent(e.target.value)} 
              style={{ width: '100%' }}
            />
            <div style={{ marginTop: '10px' }}>
              <button onClick={handleUpdate}>Modifier</button>
              <button onClick={handleDelete} style={{ marginLeft: '10px' }}>Supprimer</button>
              <button onClick={() => setShowModal(false)} style={{ marginLeft: '10px' }}>Annuler</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatBox;
