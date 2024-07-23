import React, { useEffect, useState } from 'react'
import './Menu.css'
import axios from 'axios'
import Navbar from './Navbar'
const { VITE_HOST } = import.meta.env

function Menu() {
    const [values, setValues] = useState([])

    useEffect(() => {
        fetchMenu()
    }, [])

    const fetchMenu = async () => {
        const menu = await axios.get(`${VITE_HOST}/getallproducts`)
        setValues(menu?.data?.data)
    }
    return (
        
        <div className="menu">
            <Navbar/>
            <h1>TiagoShop</h1>
            <div className="menu-container">
                {
                    values?.map((pro) => (
                        <div key={pro?._id} className="card">
                            <div className="image-container">
                                <img src={`${VITE_HOST}/uploads/${pro?.image}`} alt='' />
                            </div>
                            <div className='label'>
                            <h3>{pro?.name}</h3>
                            <h3>₱ {pro?.price}</h3>
                        </div>
                        <div className='description'>
                            <p>{pro?.description}</p>
                        </div>
                        </div>
                    ))
                }
            </div>
        </div >
    )
}

export default Menu
