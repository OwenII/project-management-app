// client/src/components/NavBar.js
import React, { useContext, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem,
  IconButton,
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';

function NavBar() {
  const { user, logoutUser } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    logoutUser();
    handleMenuClose();
  };

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        <Button component={RouterLink} to="/" color="inherit">
          Liste des Projets
        </Button>
        <div style={{ flexGrow: 1 }} />
        {user ? (
          <>
            <IconButton color="inherit" onClick={handleMenuOpen}>
              <AccountCircle />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem component={RouterLink} to="/profile" onClick={handleMenuClose}>
                Edit Profil
              </MenuItem>
              <MenuItem component={RouterLink} to="/my-tasks" onClick={handleMenuClose}>
                Toutes les Tâches
              </MenuItem>
              <MenuItem component={RouterLink} to="/my-projects" onClick={handleMenuClose}>
                Mes Projets
              </MenuItem>
              <MenuItem onClick={handleLogout}>Se déconnecter</MenuItem>
            </Menu>
          </>
        ) : (
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
