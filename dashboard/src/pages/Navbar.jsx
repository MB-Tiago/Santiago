import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';'@emotion/react';
import './Navbar.css'

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/');
    window.location.reload();
  };

  return (
    <nav className="navbar">
      <div className='logo-img'>
        <img src="logo.png" alt="logo" />
      
      </div>
      <div className='navbar-btn'>
        {isLoggedIn ? (
          <Link to="/" className='Homebar' onClick={handleLogout}>Logout</Link>
        ) : (
          <>
            <Link to="/AdminDashboard" className='Homebar'>Home</Link>
            <Link to="/Menu" className='Menubar'>Menu</Link>
            <Link to="/" className='LoginBar'>Login</Link>
            <Link to="/TiagoShop" className='Shop'>TiagoShop</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
