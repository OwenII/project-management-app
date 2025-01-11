// src/components/NavBar.js
import React from 'react';
import { Link } from 'react-router-dom';

function NavBar() {
  return (
    <nav style={{ padding: '10px', borderBottom: '1px solid #ccc', marginBottom: '20px' }}>
      <Link to="/" style={{ marginRight: '10px' }}>Liste des Projets</Link>
      <Link to="/login">Se connecter</Link>
    </nav>
  );
}

export default NavBar;
