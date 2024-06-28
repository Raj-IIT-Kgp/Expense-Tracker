import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";

import { useUserId } from "../hooks";
import SpendingChart from "../components/SpendingChart";
import LineChart from "../components/LineChart";
import { Appbar } from "../components/Appbar";

const Dashboard = () => {
    const [balance, setBalance] = useState(0);
    const [expense, setExpense] = useState(0);
    const [income, setIncome] = useState(0);
    const userId = useUserId();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userResponse = await axios.get(`${BACKEND_URL}/api/v1/transaction/user`, {
                    headers: { Authorization: localStorage.getItem("token") }
                });

                const userId = userResponse.data.userId;
                const response = await axios.get(`${BACKEND_URL}/api/v1/transaction/summary/${userId}`, {
                    headers: { Authorization: localStorage.getItem("token") },
                });

                setBalance(parseFloat(response.data.balance.toFixed(2)));
                setExpense(parseFloat(response.data.expenses.toFixed(2)));
                setIncome(parseFloat(response.data.income.toFixed(2)));

            } catch (error) {
                console.error("Error fetching data", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100">
            <Appbar />
            <div className="container mx-auto py-8">
                <div className="bg-white rounded-lg shadow p-6">
                    <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-green-100 p-4 rounded-lg shadow">
                            <h2 className="text-xl font-semibold">Income</h2>
                            <p className="text-3xl font-bold text-green-500">${income}</p>
                        </div>
                        <div className="bg-red-100 p-4 rounded-lg shadow">
                            <h2 className="text-xl font-semibold">Expense</h2>
                            <p className="text-3xl font-bold text-red-500">${expense}</p>
                        </div>
                        <div className="bg-blue-100 p-4 rounded-lg shadow">
                            <h2 className="text-xl font-semibold">Balance</h2>
                            <p className="text-3xl font-bold text-blue-500">${balance}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container mx-auto py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg shadow p-6">

                        <SpendingChart userId={Number(userId)} />
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">


                        <LineChart userId={Number(userId)} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
