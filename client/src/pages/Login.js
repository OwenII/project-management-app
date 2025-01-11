import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom'; 

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
      }
    }
  }
`;

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login, { loading, error }] = useMutation(LOGIN_MUTATION);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await login({ variables: { email, password } });
      console.log("[DEBUG] Login result:", result);
      const token = result.data.login.token;
      localStorage.setItem('token', token);
      navigate('/');
    } catch (err) {
      console.error("[DEBUG] Login error:", err);
    }
  };

  return (
    <div>
      <h2>Connexion</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="email" 
          placeholder="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input 
          type="password" 
          placeholder="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">Se connecter</button>
      </form>
      {loading && <p>Chargement...</p>}
      {error && <p>Erreur de connexion</p>}
    </div>
  );
}

export default Login;
