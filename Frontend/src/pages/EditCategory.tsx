import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BACKEND_URL } from "../config";
import { useNavigate, useParams } from "react-router-dom";
import { Appbar } from "../components/Appbar";
import LoadingSpinner from "../components/LoadingSpinner.tsx";


export interface Category {
    id: number;
    name: string;
}

const EditCategory: React.FC = () => {
    const navigate = useNavigate();
    const {id} = useParams<{ id: string }>();
    const [name, setName] = useState('');
    const [category, setCategory] = useState<Category | null>(null);
    const [isLoading, setIsLoading] = useState(true); // Add a loading state

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const response = await axios.get(`${BACKEND_URL}/api/v1/transaction/category/${id}`, {
                    headers: {Authorization: localStorage.getItem("token")},
                });
                setCategory(response.data.category);
                setName(response.data.category.name); // Set the name state variable
                setIsLoading(false); // Set loading to false after fetching data
            } catch (error) {
                console.error('Error fetching category', error);
            }
        };

        fetchCategory();
    }, [id]);
    const handleEdit = async (category: Category) => {
        try {
            const response = await axios.put(`${BACKEND_URL}/api/v1/transaction/categories/${id}`, {
                name: category.name,
            }, {
                headers: {Authorization: localStorage.getItem("token")},
            });

            if (response.status === 200) {
                alert('Category update successful');
                navigate("/dashboard");
            } else {
                alert('Error updating category');
            }
        } catch (error) {
            console.error('Error updating category', error);
            alert('Error updating category');
        }
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (category) {
            handleEdit({id: category.id, name});
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Appbar/> {/* Add the Appbar component */}
            <div className="py-8">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">Edit Category</h1>
                    {isLoading ? (
                        <div><LoadingSpinner/></div>
                    ) : (
                        category && (
                            <form onSubmit={handleSubmit}
                                  className="space-y-6 bg-white p-8 rounded-lg shadow-lg max-w-lg mx-auto">
                                <h2 className="text-2xl font-bold text-gray-900">Edit Category</h2>
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
                                    Edit Category
                                </button>
                            </form>
                        )
                    )}
                </div>
            </div>
        </div>
    )
}
export default EditCategory;
