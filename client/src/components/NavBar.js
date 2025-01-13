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
  <Link to="/" style={{ marginRight: '10px' }} onClick={() => setMenuOpen(false)}>
    Liste des Projets
  </Link>
  {user ? (
    <div style={{ display: 'inline-block', position: 'relative' }}>
      <span 
        onClick={() => setMenuOpen(!menuOpen)} 
        style={{ cursor: 'pointer', marginRight: '10px' }}
      >
        {user.email}
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
          <Link to="/profile" onClick={() => setMenuOpen(false)}>Edit Profil</Link><br />
          <Link to="/my-tasks" onClick={() => setMenuOpen(false)}>Toutes les Tâches</Link><br />
          <Link to="/my-projects" onClick={() => setMenuOpen(false)}>Mes Projets</Link><br />
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
