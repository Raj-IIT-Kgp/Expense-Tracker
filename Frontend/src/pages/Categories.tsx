import React from 'react';
import { Category, useCategory } from "../hooks";
import CategoryItem from "../components/CategoryItem";
import { useParams, useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner.tsx";
import { Appbar } from "../components/Appbar.tsx"; // Import the Appbar component

export const Categories: React.FC = () => {
    const { userId } = useParams();
    const { loading, categories } = useCategory({ userId: userId || "" });
    const navigate = useNavigate();

    const handleAddCategoryClick = () => {
        navigate("/add/categories");
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">
            <LoadingSpinner />
        </div>;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Appbar />
            <div className="py-8">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold text-gray-800">Categories</h1>
                        <button
                            onClick={handleAddCategoryClick}
                            className="px-6 py-3 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-300"
                        >
                            Add Category
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categories.map((category: Category) => (
                            <CategoryItem
                                key={category.id}
                                category={category}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Categories;
