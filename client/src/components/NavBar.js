// client/src/components/NavBar.js
import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function NavBar() {
  const { user, logoutUser } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null); // Référence pour le menu

  const handleLogout = () => {
    logoutUser();
    setMenuOpen(false);
  };

  // Gestionnaire pour fermer le menu quand on clique à l'extérieur
  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
              ref={menuRef} // Attache la référence au menu
              style={{ 
                position: 'absolute',
                background: '#fff',
                border: '1px solid #ccc',
                padding: '15px',
                width: '200px', // Largeur augmentée
                height: '150px', // Hauteur augmentée
                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                zIndex: 10 // Assurez-vous que le menu est au-dessus des autres éléments
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
