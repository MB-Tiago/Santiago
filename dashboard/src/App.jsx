import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Menu from './pages/Menu';

import './App.css';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';  

function App() {
  return (
    <BrowserRouter>
      
      <Routes>
        <Route path="/Santiago" element={<Dashboard />} />
        <Route path="/Menu" element={<Menu />} />
        <Route path="/" element={<Login />} />
        <Route path="/AdminDashboard" element={<AdminDashboard />} />
      
      </Routes>
    </BrowserRouter>
  );
}

export default App;
