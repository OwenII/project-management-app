// client/src/components/NavBar.js
import React, { useContext, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  AppBar,
  Toolbar,
  Button,
  Menu,
  MenuItem,
  IconButton,
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';

function NavBar() {
  // Accède au contexte d'authentification pour récupérer l'utilisateur et la fonction de déconnexion
  const { user, logoutUser } = useContext(AuthContext);

  // Gère l'état pour ouvrir/fermer le menu utilisateur
  const [anchorEl, setAnchorEl] = useState(null);

  // Fonction pour ouvrir le menu utilisateur
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Fonction pour fermer le menu utilisateur
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Fonction pour gérer la déconnexion
  const handleLogout = () => {
    logoutUser(); // Appelle la fonction de déconnexion du contexte
    handleMenuClose(); // Ferme le menu après la déconnexion
  };

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        {/* Lien vers la liste des projets */}
        <Button component={RouterLink} to="/" color="inherit">
          Liste des Projets
        </Button>
        
        {/* Espacement flexible pour pousser le menu utilisateur à droite */}
        <div style={{ flexGrow: 1 }} />
        
        {/* Si l'utilisateur est connecté, afficher les options de menu */}
        {user ? (
          <>
            {/* Icône de profil qui ouvre le menu utilisateur */}
            <IconButton color="inherit" onClick={handleMenuOpen}>
              <AccountCircle />
            </IconButton>
            
            {/* Menu de l'utilisateur avec différentes options */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              {/* Lien vers la page de profil */}
              <MenuItem component={RouterLink} to="/profile" onClick={handleMenuClose}>
                Edit Profil
              </MenuItem>
              {/* Lien vers la page des tâches de l'utilisateur */}
              <MenuItem component={RouterLink} to="/my-tasks" onClick={handleMenuClose}>
                Toutes les Tâches
              </MenuItem>
              {/* Lien vers les projets de l'utilisateur */}
              <MenuItem component={RouterLink} to="/my-projects" onClick={handleMenuClose}>
                Mes Projets
              </MenuItem>
              {/* Option de déconnexion */}
              <MenuItem onClick={handleLogout}>Se déconnecter</MenuItem>
            </Menu>
          </>
        ) : (
          // Si l'utilisateur n'est pas connecté, afficher les options de connexion et d'inscription
          <>
            <Button component={RouterLink} to="/login" color="inherit">
              Se connecter
            </Button>
            <Button component={RouterLink} to="/signup" color="inherit">
              Créer un compte
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
