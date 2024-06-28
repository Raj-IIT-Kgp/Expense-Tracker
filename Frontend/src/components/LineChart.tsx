import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import { BACKEND_URL } from "../config.ts";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

interface Transaction {
    date: string;
    amount: number;
}

interface ChartData {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        borderColor: string;
        backgroundColor: string;
        fill: boolean;
    }[];
}

const LineChart: React.FC<{ userId: number }> = ({ userId }) => {
    const [chartData, setChartData] = useState<ChartData | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    throw new Error('No token found');
                }

                const response = await axios.get<Transaction[]>(`${BACKEND_URL}/api/v1/transaction/spending-over-time/${userId}`, {
                    headers: {
                        Authorization: token,
                    },
                });

                const data = response.data;

                const dates = data.map(t => new Date(t.date).toLocaleDateString());
                const amounts = data.map(t => t.amount);

                setChartData({
                    labels: dates,
                    datasets: [
                        {
                            label: 'Spending Over Time',
                            data: amounts,
                            borderColor: 'rgba(75, 192, 192, 1)',
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            fill: true,
                        },
                    ],
                });
            } catch (error) {
                console.error('Error fetching chart data', error);
            }
        };

        fetchData();
    }, [userId]);

    return (
        <div className="w-full lg:w-6/7  p-4">
            <h2 className="text-xl font-semibold mb-4">Spending Over Time</h2>
            {chartData && <Line data={chartData} />}
        </div>
    );
};

export default LineChart;
