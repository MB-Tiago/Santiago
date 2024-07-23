import React from 'react';
import { Link } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import AssessmentIcon from '@mui/icons-material/Assessment';
import LoyaltyIcon from '@mui/icons-material/Loyalty';
import './AnalystSidebar.css';
const { VITE_HOST } = import.meta.env

function AnalystSidebar() {

  const handleLogout = () => {
    window.location.href = '/';
};
  return (
    <div className="">

<div className="sidebar">
      <div className="logo">
        <img src="Order.png" alt="Logo" />
      </div>
      <h2>Sales Manager</h2>
      <ul>
        <li>
          <Link to="/SalesReport"><LoyaltyIcon></LoyaltyIcon>Sales Reports</Link>
        </li>
        <li>
          <Link to="/SalesAnalysis"><AssessmentIcon></AssessmentIcon>Graph</Link>
        </li>
      </ul>
      <div className="logout">
<button onClick={handleLogout}>Logout</button>

    </div>
      
    </div>

    

    </div>
    


  );
}

export default AnalystSidebar;
