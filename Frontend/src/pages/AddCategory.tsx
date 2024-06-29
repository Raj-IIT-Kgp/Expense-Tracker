import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BACKEND_URL } from "../config.ts";
import { Appbar } from "../components/Appbar.tsx"; // Import the Appbar component

export interface Category {
    id: number;
    name: string;
}

const AddCategoryPage: React.FC = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');

    const handleAdd = async (category: Category) => {
        try {
            const response = await axios.post(`${BACKEND_URL}/api/v1/transaction/categories`, {
                name: category.name,
            }, {
                headers: { Authorization: localStorage.getItem("token") },
            });

            if (response.status === 200) {
                alert('Category creation successful');
            } else {
                alert('Error adding category');
            }
            navigate("/dashboard");

        } catch (error) {
            console.error('Error adding category', error);
            alert('Error adding category');
        }
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const newCategory: Category = {
            id: Date.now(),
            name,
        };
        handleAdd(newCategory);
        setName('');
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Appbar />
            <div className="py-8">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">Add Category</h1>
                    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-lg max-w-lg mx-auto">
                        <h2 className="text-2xl font-bold text-gray-900">Add New Category</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Category Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Category Name"
                                    required
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Add Category
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddCategoryPage;
