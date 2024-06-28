import { ChangeEvent, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { BACKEND_URL } from "../config.ts";
import { Appbar } from "../components/Appbar.tsx"; // Import the Appbar component

export const EditTransactionPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [transaction, setTransaction] = useState({
        amount: '',
        categoryName: '',
        description: '',
        type: 'expense',
        recurring: false,
    });

    useEffect(() => {
        const fetchTransaction = async () => {
            try {
                const response = await axios.get(`${BACKEND_URL}/api/v1/transaction/${id}`, {
                    headers: { Authorization: localStorage.getItem("token") },
                });
                setTransaction({
                    amount: String(response.data.transaction.amount),
                    categoryName: response.data.category.name,
                    description: response.data.transaction.description,
                    type: response.data.transaction.type,
                    recurring: response.data.transaction.recurring,
                });
            } catch (error) {
                console.error('Error fetching transaction', error);
            }
        };

        fetchTransaction();
    }, [id]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type, checked } = e.target as HTMLInputElement;
        setTransaction({
            ...transaction,
            [name]: type === 'checkbox' ? checked : value,
        });
        console.log(transaction); // Log the transaction state
    };

    const handleEdit = async () => {
        try {
            const data = {
                amount: Number(transaction.amount),
                description: transaction.description,
                type: transaction.type,
                categoryName: transaction.categoryName,
                recurring: transaction.recurring,
            };

              await axios.put(`${BACKEND_URL}/api/v1/transaction/${id}`, data, {
                headers: { Authorization: localStorage.getItem("token") },
            });
            alert("Transaction updated successfully");
                navigate("/transactions");


        } catch (error) {
            console.error('Error updating transaction', error);
            alert('Error updating transaction');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Appbar /> {/* Add the Appbar component */}
            <div className="py-8 flex justify-center w-full">
                <div className="max-w-screen-lg w-full">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">Edit Transaction</h1>
                    <form className="space-y-6 bg-white p-8 rounded-lg shadow-lg">
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</label>
                                <input
                                    id="amount"
                                    name="amount"
                                    type="number"
                                    step="0.01"
                                    value={transaction.amount}
                                    onChange={handleInputChange}
                                    placeholder="Amount"
                                    required
                                    aria-label="Amount"
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                                <input
                                    id="categoryName"
                                    name="categoryName"
                                    type="text"
                                    value={transaction.categoryName}
                                    onChange={handleInputChange}
                                    placeholder="Category"
                                    required
                                    aria-label="Category"
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={transaction.description}
                                    onChange={handleInputChange}
                                    placeholder="Description"
                                    required
                                    aria-label="Description"
                                    rows={4}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
                                <select
                                    id="type"
                                    name="type"
                                    value={transaction.type}
                                    onChange={handleInputChange}
                                    required
                                    aria-label="Type"
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                >
                                    <option value="income">Income</option>
                                    <option value="expense">Expense</option>
                                </select>
                            </div>
                            <div className="flex items-center">
                                <input
                                    id="recurring"
                                    name="recurring"
                                    type="checkbox"
                                    checked={transaction.recurring}
                                    onChange={handleInputChange}
                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    aria-label="Monthly Recurring"
                                />
                                <label htmlFor="recurring" className="ml-2 block text-sm text-gray-900">Monthly Recurring</label>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={handleEdit}
                            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Edit Transaction
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditTransactionPage;
