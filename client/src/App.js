// client/src/App.js
import React from 'react';
import { Route, Routes } from 'react-router-dom'; 
import NavBar from './components/NavBar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import MyTasks from './pages/MyTasks';
import MyProjects from './pages/MyProjects';
import ProjectsList from './pages/ProjectsList';
import ProjectDetail from './pages/ProjectDetail';

function App() {
  return (
    <>
      <NavBar /> 
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/my-tasks" element={<MyTasks />} />
        <Route path="/my-projects" element={<MyProjects />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="/" element={<ProjectsList />} />
      </Routes>
    </>
  );
}

export default App;
