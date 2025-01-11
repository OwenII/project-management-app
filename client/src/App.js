// client/src/App.js
import React from 'react';
import { Route, Routes } from 'react-router-dom'; 
import NavBar from './components/NavBar';
import Login from './pages/Login';
import ProjectsList from './pages/ProjectsList';
import ProjectDetail from './pages/ProjectDetail';

function App() {
  return (
    <>
      <NavBar /> 
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="/" element={<ProjectsList />} />
      </Routes>
    </>
  );
}

export default App;
