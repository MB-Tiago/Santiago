import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Menu from './pages/Menu';
import './App.css';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import TiagoShop from './pages/TiagoShop';
import Billing from './pages/Billing';
import ManageUser from './pages/ManageUser';

function App() {
  return (
    <BrowserRouter>
      
      <Routes>
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/Menu" element={<Menu />} />
        <Route path="/" element={<Login />} />
        <Route path="/AdminDashboard" element={<AdminDashboard />} />
        <Route path="/TiagoShop" element={<TiagoShop />} />
        <Route path="/Billing" element={<Billing />} />
        <Route path="/ManageUser" element={<ManageUser />} />
       
      
      </Routes>
    </BrowserRouter>
  );
}

export default App;
