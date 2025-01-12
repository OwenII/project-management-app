// client/src/pages/Signup.js
import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

const SIGNUP_MUTATION = gql`
  mutation SignUp($email: String!, $username: String!, $password: String!) {
    createUser(email: $email, username: $username, password: $password) {
      id
      email
      username
    }
  }
`;

function Signup() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');  // Champ pour le pseudo
  const [password, setPassword] = useState('');
  const [createUser, { loading, error }] = useMutation(SIGNUP_MUTATION);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createUser({ variables: { email, username, password } });
      navigate('/login'); 
    } catch (err) {
      console.error("[DEBUG] Erreur lors de la création du compte:", err);
    }
  };

  return (
    <div>
      <h2>Créer un compte</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Pseudo"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">Créer un compte</button>
      </form>
      {loading && <p>Création en cours...</p>}
      {error && <p>Erreur lors de la création du compte.</p>}
    </div>
  );
}

export default Signup;
