//client\src\components\ChatBox.js
import React, { useState, useContext, useEffect } from 'react';
import { useSubscription, useMutation, useQuery, gql } from '@apollo/client';
import { AuthContext } from '../context/AuthContext';

const MESSAGES_QUERY = gql`
  query GetMessages($projectId: Int!) {
    messages(projectId: $projectId) {
      id
      content
      authorId  
      projectId
    }
  }
`;

const MESSAGE_SUBSCRIPTION = gql`
  subscription OnMessageAdded($projectId: Int!) {
    messageAdded(projectId: $projectId) {
      id
      content
      authorId  
      projectId
    }
  }
`;

const SEND_MESSAGE_MUTATION = gql`
  mutation SendMessage($content: String!, $authorId: Int!, $projectId: Int!) {
    createComment(content: $content, authorId: $authorId, projectId: $projectId) {
      id
      content
      authorId
      projectId
    }
  }
`;

function ChatBox({ projectId }) {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  console.log('[DEBUG] ChatBox initialized with projectId:', projectId, 'user:', user);

  // Récupération initiale des messages
  const { data: initialData, loading: queryLoading, error: queryError } = useQuery(MESSAGES_QUERY, {
    variables: { projectId },
  });

  // Souscription aux nouveaux messages
  const {
    data: subscriptionData,
    loading: subscriptionLoading,
    error: subscriptionError
  } = useSubscription(MESSAGE_SUBSCRIPTION, {
    variables: { projectId },
  });

  // Mutation pour envoyer un nouveau message
  const [sendMessage] = useMutation(SEND_MESSAGE_MUTATION);

  // Met à jour les messages une fois les données initiales récupérées
  useEffect(() => {
    if (queryLoading) {
      console.log('[DEBUG] Messages query loading...');
    }
    if (queryError) {
      console.error('[ERROR] Messages query error:', queryError);
    }
    if (initialData && initialData.messages) {
      console.log('[DEBUG] Initial messages loaded:', initialData.messages);
      setMessages(initialData.messages);
    }
  }, [initialData, queryLoading, queryError]);

  // Ajoute les nouveaux messages reçus via la souscription
  useEffect(() => {
    console.log('[DEBUG] Subscription state - loading:', subscriptionLoading, 'error:', subscriptionError);
    if (subscriptionData && subscriptionData.messageAdded) {
      console.log('[DEBUG] Received subscription data:', subscriptionData.messageAdded);
      setMessages((prev) => [...prev, subscriptionData.messageAdded]);
    }
  }, [subscriptionData, subscriptionLoading, subscriptionError]);

  if (!user || !user.id) {
    console.log('[ERROR] User is not authenticated.');
    return <p>Connectez-vous pour accéder au chat.</p>;
  }

  // Gestion de l'envoi d'un message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage) {
      console.warn('[WARN] Cannot send an empty message.');
      return;
    }
    try {
      console.log('[DEBUG] Sending message:', newMessage);
      await sendMessage({ 
        variables: { 
          content: newMessage, 
          authorId: parseInt(user.id, 10),
          projectId 
        },
      });
      console.log('[DEBUG] Message sent successfully.');
      setNewMessage('');
    } catch (error) {
      console.error('[ERROR] Error sending message:', error);
    }
  };

  return (
    <div>
      <h3>Chat du projet</h3>
      <div style={{ border: '1px solid #ccc', padding: '10px', height: '300px', overflowY: 'scroll' }}>
        {messages.map((msg) => (
          <p key={msg.id}>
            <strong>[{msg.authorId}]</strong>: {msg.content}
          </p>
        ))}
      </div>
      <form onSubmit={handleSendMessage}>
        <input 
          type="text" 
          placeholder="Votre message..." 
          value={newMessage} 
          onChange={(e) => setNewMessage(e.target.value)} 
          required 
        />
        <button type="submit">Envoyer</button>
      </form>
    </div>
  );
}

export default ChatBox;
