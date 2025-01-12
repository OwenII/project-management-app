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

function ChatBox({ projectId }) {
  const { user } = useContext(AuthContext);
  const { loading, error, data } = useQuery(COMMENTS_QUERY, {
    variables: { projectId },
    pollInterval: 2000, // interroge toutes les 2 secondes pour actualiser les messages
  });
  const [createComment] = useMutation(CREATE_COMMENT_MUTATION);
  const [message, setMessage] = useState('');
  const [userColors, setUserColors] = useState({});

  // Attribuer une couleur aléatoire pour chaque utilisateur
  const getColorForUser = (username) => {
    if (!userColors[username]) {
      const color = '#' + Math.floor(Math.random() * 16777215).toString(16);
      setUserColors(prev => ({ ...prev, [username]: color }));
      return color;
    }
    return userColors[username];
  };

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
  

  return (
    <div>
      <div style={{ border: '1px solid #ccc', height: '300px', overflowY: 'scroll', padding: '10px', marginBottom: '10px' }}>
        {messages.map(msg => {
          const username = msg.author ? msg.author.username : "Utilisateur inconnu"; // Fallback si author est null
          return (
            <p key={msg.id} style={{ color: getColorForUser(username) }}>
              [{username}] : {msg.content}
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
    </div>
  );
}

export default ChatBox;
