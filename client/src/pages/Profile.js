// client/src/pages/Profile.js
import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function Profile() {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <p>Veuillez vous connecter pour voir votre profil.</p>;
  }

  return (
    <div>
      <h2>Profil de {user.username}</h2>
      <p>Email : {user.email}</p>
    </div>
  );
}

export default Profile;
