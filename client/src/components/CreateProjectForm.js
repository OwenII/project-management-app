import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_PROJECT } from '../graphql/mutations';

function CreateProjectForm({ ownerId, onProjectCreated }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [createProject, { loading, error }] = useMutation(CREATE_PROJECT);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('[DEBUG] Soumission avec variables :', {
      name,
      description,
      ownerId: parseInt(ownerId, 10) // Conversion explicite
    });
  
    try {
      const result = await createProject({
        variables: {
          name,
          description,
          ownerId: parseInt(ownerId, 10), // Conversion explicite en entier
        },
      });
  
      console.log('[DEBUG] Mutation réussie, résultat :', result);
      if (onProjectCreated) onProjectCreated(result.data.createProject);
      setName('');
      setDescription('');
    } catch (err) {
      console.error('[DEBUG] Erreur lors de la mutation createProject :', err);
    }
  };
  

  return (
    <form onSubmit={handleSubmit}>
      <h3>Créer un nouveau projet</h3>
      <input
        type="text"
        placeholder="Nom du projet"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button type="submit" disabled={loading}>Créer</button>
      {error && <p>Erreur lors de la création : {error.message}</p>}
    </form>
  );
}

export default CreateProjectForm;
