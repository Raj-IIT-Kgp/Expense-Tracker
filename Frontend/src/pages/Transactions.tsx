import React, { useState } from 'react';
import { Transaction, useCategory, useTransaction, useUserId } from "../hooks";
import TransactionItem from "../components/TransactionItem";
import LoadingSpinner from "../components/LoadingSpinner.tsx";
import { Appbar } from "../components/Appbar.tsx"; // Import the Appbar component

const Transactions: React.FC = () => {
    const { loading, transactions } = useTransaction();
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const userId = useUserId();
    const { categories } = useCategory({ userId: userId });

    // Function to filter and sort transactions
    const filteredTransactions = transactions.filter(transaction => {
        const matchesCategory = selectedCategory ? transaction.category.name === selectedCategory : true;
        const matchesType = selectedType ? transaction.type === selectedType : true;
        const matchesSearchTerm = transaction.description.toLowerCase().includes(searchTerm.toLowerCase());

        // Date range filtering logic
        const transactionDate = transaction.date.substring(0, 10); // Extract YYYY-MM-DD from the timestamp
        const startDateMatch = !startDate || transactionDate >= startDate;
        const endDateMatch = !endDate || transactionDate <= endDate;

        return matchesCategory && matchesType && matchesSearchTerm && startDateMatch && endDateMatch;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-100">
            <Appbar />
            <div className="py-8">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">Transactions</h1>
                    <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="mb-4">
                                <label htmlFor="categoryFilter" className="block text-sm font-medium text-gray-700">Filter by Category:</label>
                                <select
                                    id="categoryFilter"
                                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    value={selectedCategory || ''}
                                >
                                    <option value="">All Categories</option>
                                    {categories.map(category => (
                                        <option key={category.id} value={category.name}>{category.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="typeFilter" className="block text-sm font-medium text-gray-700">Filter by Type:</label>
                                <select
                                    id="typeFilter"
                                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    onChange={(e) => setSelectedType(e.target.value)}
                                    value={selectedType || ''}
                                >
                                    <option value="">All Types</option>
                                    <option value="income">Income</option>
                                    <option value="expense">Expense</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date:</label>
                                <input
                                    type="date"
                                    id="startDate"
                                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    onChange={(e) => setStartDate(e.target.value)}
                                    value={startDate}
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date:</label>
                                <input
                                    type="date"
                                    id="endDate"
                                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    onChange={(e) => setEndDate(e.target.value)}
                                    value={endDate}
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="searchBox" className="block text-sm font-medium text-gray-700">Search:</label>
                                <input
                                    placeholder={"Search in description"}
                                    id="searchBox"
                                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    value={searchTerm}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredTransactions.map((transaction: Transaction) => (
                            <TransactionItem
                                key={transaction.id}
                                id={transaction.id}
                                amount={transaction.amount}
                                category={transaction.category.name}
                                description={transaction.description}
                                type={transaction.type}
                                date={transaction.date}
                                
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Transactions;
