import React, { useContext, useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const UPDATE_USER = gql`
  mutation UpdateUser($id: Int!, $username: String!) {
    updateUser(id: $id, username: $username) {
      id
      username
      email
    }
  }
`;

const DELETE_USER = gql`
  mutation DeleteUser($id: Int!) {
    deleteUser(id: $id)
  }
`;

function Profile() {
  const { user, logoutUser } = useContext(AuthContext);
  const [username, setUsername] = useState(user ? user.username : '');
  const navigate = useNavigate();  // Initialisation de navigate

  const [updateUserMutation] = useMutation(UPDATE_USER);
  const [deleteUserMutation] = useMutation(DELETE_USER);

  if (!user) {
    return <p>Veuillez vous connecter pour voir votre profil.</p>;
  }

  const handleUpdate = async () => {
    try {
      const { data } = await updateUserMutation({ 
        variables: { id: parseInt(user.id, 10), username } 
      });
      console.log('Utilisateur mis à jour :', data.updateUser);
      alert('Nom d\'utilisateur mis à jour avec succès.');
    } catch (error) {
      console.error("Erreur lors de la mise à jour du nom d'utilisateur :", error);
      alert('Une erreur est survenue lors de la mise à jour.');
    }
  };

  const handleDelete = async () => {
    const confirmation = window.confirm(
      "Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible."
    );
    if (!confirmation) return;

    try {
      const { data } = await deleteUserMutation({ 
        variables: { id: parseInt(user.id, 10) } 
      });
      if (data.deleteUser) {
        logoutUser(); 
        alert('Votre compte a été supprimé avec succès.');
        navigate('/');  
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du compte :", error);
      alert('Une erreur est survenue lors de la suppression du compte.');
    }
  };

  return (
    <div>
      <h2>Profil de {user.username}</h2>
      <p>Email : {user.email}</p>

      <div style={{ marginTop: '20px' }}>
        <h3>Modifier le nom d'utilisateur</h3>
        <input 
          type="text" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          placeholder="Entrez un nouveau nom d'utilisateur"
          style={{ marginRight: '10px', padding: '5px' }}
        />
        <button onClick={handleUpdate} style={{ padding: '5px 10px' }}>
          Sauvegarder
        </button>
      </div>

      <div style={{ marginTop: '20px', color: 'red' }}>
        <h3>Supprimer le compte</h3>
        <button 
          onClick={handleDelete} 
          style={{ padding: '5px 10px', backgroundColor: 'red', color: 'white' }}
        >
          Supprimer mon compte
        </button>
      </div>
    </div>
  );
}

export default Profile;
