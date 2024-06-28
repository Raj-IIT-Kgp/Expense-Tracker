import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import axios from 'axios';
import { BACKEND_URL } from "../config.ts";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, Filler);

interface TransactionGroup {
    categoryId: number;
    _sum: { amount: number };
    category: { name: string };
}

interface ChartData {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        backgroundColor: string[];
        borderColor: string[];
        borderWidth: number;
    }[];
}

const SpendingChart: React.FC<{ userId: number }> = ({ userId }) => {
    const [chartData, setChartData] = useState<ChartData | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    throw new Error('No token found');
                }

                const response = await axios.get<TransactionGroup[]>(`${BACKEND_URL}/api/v1/transaction/chart-data/${userId}`, {
                    headers: {
                        Authorization: token,
                    },
                });

                const data = response.data;

                const labels = data.map(d => d.category.name);
                const amounts = data.map(d => d._sum.amount);

                setChartData({
                    labels,
                    datasets: [
                        {
                            label: 'Spending by Category',
                            data: amounts,
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(255, 206, 86, 0.2)',
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(153, 102, 255, 0.2)',
                                'rgba(255, 159, 64, 0.2)',
                            ],
                            borderColor: [
                                'rgba(255, 99, 132, 1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)',
                                'rgba(255, 159, 64, 1)',
                            ],
                            borderWidth: 1,
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
        <div className="w-full lg:w-2/3  p-4 ml-12">
            <h2 className="text-xl font-semibold mb-4">Spending by Category</h2>
            {chartData && <Pie data={chartData} />}
        </div>
    );
};

export default SpendingChart;
