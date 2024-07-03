import React from 'react';
import { Link } from 'react-router-dom';
import './SidebarAdmin.css'; // Import the CSS file for styling

function SidebarAdmin() {
  return (
    <div className="sidebar">
      <div className="logo">
        <img src="Order.png" alt="Logo" />
      </div>
      <h2>Admin Panel</h2>
      <ul>
        <li>
          <Link to="/AdminDashboard">Dashboard</Link>
        </li>
        <li>
          <Link to="/ManageUser">Manage User</Link>
        </li>
        <li>
          <Link to="/TiagoShop">Shop</Link>
        </li>
        <li>
          <Link to="/Reports">Reports</Link>
        </li>
      </ul>
    </div>
  );
}

export default SidebarAdmin;
