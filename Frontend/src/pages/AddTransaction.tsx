import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BACKEND_URL } from "../config.ts";
import { Appbar } from "../components/Appbar.tsx"; // Import the Appbar component

export interface Transaction {
    id: number;
    amount: number;
    category: string;
    type: string;
    description: string;
    recurring: boolean;
}

const AddTransactionPage: React.FC = () => {
    const navigate = useNavigate();
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('income');
    const [recurring, setRecurring] = useState(false);

    const handleAdd = async (transaction: Transaction) => {
        try {
            const response = await axios.post(`${BACKEND_URL}/api/v1/transaction/create`, {
                amount: transaction.amount,
                description: transaction.description,
                type: transaction.type,
                categoryName: transaction.category,
                recurring: transaction.recurring,
            }, {
                headers: { Authorization: localStorage.getItem("token") },
            });

            alert(response.data.message)
            navigate("/transactions");

        } catch (error) {
            console.error('Error adding transaction', error);
            alert('Error adding transaction');
        }
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const newTransaction: Transaction = {
            id: Date.now(),
            amount: Number(amount),
            category,
            type,
            description,
            recurring,
        };
        handleAdd(newTransaction);
        setAmount('');
        setCategory('');
        setDescription('');
        setType('income');
        setRecurring(false);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Appbar /> {/* Add the Appbar component */}
            <div className="py-8">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">Add Transaction</h1>
                    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-lg max-w-lg mx-auto">
                        <h2 className="text-2xl font-bold text-gray-900">Add New Transaction</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Amount</label>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount((e.target.value))}
                                    placeholder="Amount"
                                    required
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Category</label>
                                <input
                                    type="text"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    placeholder="Category"
                                    required
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <input
                                    type="text"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Description"
                                    required
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Type</label>
                                <select
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    required
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                >
                                    <option value="income">Income</option>
                                    <option value="expense">Expense</option>
                                </select>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={recurring}
                                    onChange={(e) => setRecurring(e.target.checked)}
                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <label className="ml-2 block text-sm text-gray-900">Monthly Recurring</label>
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Add Transaction
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddTransactionPage;
