// client/src/components/NavBar.js
import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function NavBar() {
  const { user, logoutUser } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logoutUser();
    setMenuOpen(false);
  };

  return (
    <nav style={{ padding: '10px', borderBottom: '1px solid #ccc', marginBottom: '20px' }}>
      <Link to="/" style={{ marginRight: '10px' }}>Liste des Projets</Link>
      {user ? (
        <div style={{ display: 'inline-block', position: 'relative' }}>
          <span 
            onClick={() => setMenuOpen(!menuOpen)} 
            style={{ cursor: 'pointer', marginRight: '10px' }}
          >
            {user.username}
          </span>
          {menuOpen && (
            <div 
              style={{ 
                position: 'absolute', 
                background: '#fff', 
                border: '1px solid #ccc', 
                padding: '10px' 
              }}
            >
              <Link to="/profile">Edit Profil</Link><br />
              <Link to="/my-tasks">Mes Tâches</Link><br />
              <Link to="/my-projects">Mes Projets</Link><br />
              <button onClick={handleLogout}>Se déconnecter</button>
            </div>
          )}
        </div>
      ) : (
        <>
          <Link to="/login" style={{ marginRight: '10px' }}>Se connecter</Link>
          <Link to="/signup">Créer un compte</Link>
        </>
      )}
    </nav>
  );
}

export default NavBar;
