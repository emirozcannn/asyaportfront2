
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard';
import Users from './pages/Users';
import Assets from './pages/Assets';
import AddUser from './pages/AddUser';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/users" element={<Dashboard><Users /></Dashboard>} />
        <Route path="/dashboard/users/add" element={<Dashboard><AddUser /></Dashboard>} />
        <Route path="/dashboard/assets" element={<Dashboard><Assets /></Dashboard>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
