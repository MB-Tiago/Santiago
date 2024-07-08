import React from 'react';
import './Dashboard.css';
import SidebarAdmin from './SidebarAdmin';

function Dashboard() {
    return (
        <div className="dashboard">
            <SidebarAdmin />
            <div className="wrapper">
                <div className='image-section'>
                    <div className="box">
                        <img src="Order.png" alt="" />
                    </div>

                </div>
                <div className='image-section'>
                    <div className="box">
                        <img src="topup.png" alt="background" />
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Dashboard;
