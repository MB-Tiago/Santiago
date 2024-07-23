import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './SalesAnalysis.css';
import { Bar } from 'react-chartjs-2';
import { Box } from '@mui/material';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import AnalystDashboard from './AnalystSidebar';
const { VITE_HOST } = import.meta.env

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const SalesAnalysis = () => {
    const [productCounts, setProductCounts] = useState({});

    useEffect(() => {
        fetchSales();
    }, []);

    const fetchSales = async () => {
        try {
            const response = await axios.get(`${VITE_HOST}/api/getSales`);
            const reversedSales = response.data.data.reverse();
            countProducts(reversedSales);
        } catch (error) {
            console.error('Error fetching sales:', error);
        }
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

    const generateChartData = () => {
        const labels = Object.keys(productCounts);
        const data = Object.values(productCounts);

        return {
            
            
            labels: labels,
            datasets: [
                {
                    label: 'Number of Purchases',
                    data: data,
                    backgroundColor: '#2560d5',
                    borderColor: '#2560d5',
                    borderWidth: 1,
                },
            ],
        };
    };

    return (
        <div className="sales-analysis-container">
            <AnalystDashboard/>
            <h2>Sales Analysis</h2>
            <Box className="chart-container">
                {Object.keys(productCounts).length > 0 ? (
                    <Bar data={generateChartData()} />
                ) : (
                    <p className="no-data-message">No sales data available to display chart.</p>
                )}
            </Box>
        </div>
    );
};

export default SalesAnalysis;
