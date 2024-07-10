import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './SalesReport.css';

const SalesReport = () => {
    const [sales, setSales] = useState([]);
    const [productCounts, setProductCounts] = useState({});

    useEffect(() => {
        fetchSales();
    }, []);

    const fetchSales = async () => {
        try {
            const response = await axios.get('http://192.168.10.13:3004/api/getSales');
            const reversedSales = response.data.data.reverse();
            setSales(reversedSales);
            countProducts(reversedSales);
        } catch (error) {
            console.error('Error fetching sales:', error);
        }
    };

    const formatDate = (dateString) => {
        const options = {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    const countProducts = (salesData) => {
        const counts = {};
        salesData.forEach(sale => {
            if (counts[sale.productName]) {
                counts[sale.productName] += 1;
            } else {
                counts[sale.productName] = 1;
            }
        });
        setProductCounts(counts);
    };

    return (
        <div className="sales-report-container">
            <h2>Sales Report</h2>
            <table className="sales-report-table">
                <thead>
                    <tr>
                        <th>Product Name</th>
                        <th>Price</th>
                        <th>Date</th>
                        <th>Number of Purchases</th>
                    </tr>
                </thead>
                <tbody>
                    {sales.map((sale, index) => (
                        <tr key={index}>
                            <td>{sale.productName}</td>
                            <td>₱ {sale.price}</td>
                            <td>{formatDate(sale.date)}</td>
                            <td>{productCounts[sale.productName]}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SalesReport;
