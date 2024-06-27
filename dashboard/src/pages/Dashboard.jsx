import React from 'react';
import './Dashboard.css';
import Navbar from './Navbar';

function Dashboard() {
  return (
    <div className="dashboard">
      <Navbar/>
      <div className='image-section'>
        {/* <img src="bg.jpg" alt="Description of image" /> */}
        <h1>Image</h1>
      </div>
      <h1>Title</h1>
      <div className='main-section'>
        <h2>
          Header
        </h2>

        <p>
          text
        </p>


      </div>
    </div>
  );
}

export default Dashboard;
