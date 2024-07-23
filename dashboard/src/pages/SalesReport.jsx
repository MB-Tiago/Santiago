import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './SalesReport.css';
import AnalystDashboard from './AnalystSidebar';
const { VITE_HOST } = import.meta.env

const SalesReport = () => {
    const [sales, setSales] = useState([]);
    const [aggregatedSales, setAggregatedSales] = useState([]);
    const [totalSales, setTotalSales] = useState(0);
    const [mostPurchasedProduct, setMostPurchasedProduct] = useState(null);

    useEffect(() => {
        fetchSales();
    }, []);

    const fetchSales = async () => {
        try {
            const response = await axios.get(`${VITE_HOST}/api/getSales`);
            const reversedSales = response.data.data.reverse();
            setSales(reversedSales);
            aggregateSales(reversedSales);
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

    const aggregateSales = (salesData) => {
        const salesMap = {};
        salesData.forEach(sale => {
            if (salesMap[sale.productName]) {
                salesMap[sale.productName].count += 1;
                salesMap[sale.productName].total += sale.price;
            } else {
                salesMap[sale.productName] = {
                    price: sale.price,
                    count: 1,
                    total: sale.price,
                    date: sale.date
                };
            }
        });

        const aggregatedSalesArray = Object.keys(salesMap).map(productName => ({
            productName,
            ...salesMap[productName]
        }));

        setAggregatedSales(aggregatedSalesArray);

        // Calculate total sales
        const total = aggregatedSalesArray.reduce((acc, sale) => acc + sale.total, 0);
        setTotalSales(total);

        // Find most purchased product
        const mostPurchased = aggregatedSalesArray.reduce((max, sale) => (sale.count > max.count ? sale : max), aggregatedSalesArray[0]);
        setMostPurchasedProduct(mostPurchased);
    };

    return (
        <div className="sales-report-container">
            <AnalystDashboard />
            <h2>Sales Report</h2>
            <div className="sales-summary">
                <p><strong>Total Sales:</strong> ₱ {totalSales}</p>
                {mostPurchasedProduct && (
                    <p><strong>Most Purchased Product:</strong> {mostPurchasedProduct.productName} ({mostPurchasedProduct.count} purchases)</p>
                )}
            </div>
            <table className="sales-report-table">
                <thead>
                    <tr>
                        <th>Product Name</th>
                        <th>Price</th>
                        <th>Date</th>
                        <th>Number of Purchases</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {aggregatedSales.map((sale, index) => (
                        <tr key={index}>
                            <td>{sale.productName}</td>
                            <td>₱ {sale.price}</td>
                            <td>{formatDate(sale.date)}</td>
                            <td>{sale.count}</td>
                            <td>₱ {sale.total}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SalesReport;
