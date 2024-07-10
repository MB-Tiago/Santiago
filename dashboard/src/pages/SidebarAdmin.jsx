import React from 'react';
import { Link } from 'react-router-dom';
import './SidebarAdmin.css'; // Import the CSS file for styling
import DashboardIcon from '@mui/icons-material/Dashboard';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import AssessmentIcon from '@mui/icons-material/Assessment';

function SidebarAdmin() {

  const handleLogout = () => {
    window.location.href = '/';
};
  return (
    <div className="">

<div className="sidebar">
      <div className="logo">
        <img src="Order.png" alt="Logo" />
      </div>
      <h2>Admin Panel</h2>
      <ul>
        <li>
          <Link to="/Dashboard"><DashboardIcon></DashboardIcon>Dashboard</Link>
        </li>
        <li>
          <Link to="/ManageUser"><ManageAccountsIcon></ManageAccountsIcon>Manage User</Link>
        </li>
        <li>
          <Link to="/TiagoShop"><LocalOfferIcon></LocalOfferIcon>Shop</Link>
        </li>
        <li>
          <Link to="/SalesReport"><AssessmentIcon></AssessmentIcon>Reports</Link>
        </li>
      </ul>
      <div className="logout">
<button onClick={handleLogout}>Logout</button>

    </div>
      
    </div>

    

    </div>
    


  );
}

export default SidebarAdmin;
