import { BACKEND_URL } from "../config.ts";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashCan } from '@fortawesome/free-solid-svg-icons';

interface CategoryItemProps {
    category: {
        id: number;
        name: string;
    };
}

export const CategoryItem = ({ category }: CategoryItemProps) => {
    const navigate = useNavigate();

    const deleteCategory = async () => {
        if (window.confirm("Do you want to delete the Category?")) {
            try {
                const response = await axios.delete(`${BACKEND_URL}/api/v1/transaction/categories/${category.id}`, {
                    headers: {
                        Authorization: localStorage.getItem("token"),
                    },
                });
                alert(response.data.message);
                navigate('/dashboard'); // navigate to home page or the page that lists all categories
            } catch (error) {
                console.error("There was an error deleting the category:", error);
            }
        }
    };

    const handleEditClick = () => {
        navigate(`/categories/edit/${category.id}`);
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow-md flex items-center justify-between space-x-4 transform transition-transform duration-300 hover:scale-105">
            <div className="flex flex-col space-y-1">
                <div className="text-lg font-semibold text-gray-800">
                    {category.name}
                </div>
            </div>
            <div className="flex space-x-2">
                <button onClick={handleEditClick} className="text-gray-500 hover:text-gray-700 focus:outline-none transition-colors duration-300">
                    <FontAwesomeIcon icon={faEdit} className="w-4 h-4" />
                </button>
                <button
                    onClick={deleteCategory}
                    className="text-red-500 hover:text-gray-700 focus:outline-none transition-colors duration-300"
                >
                    <FontAwesomeIcon icon={faTrashCan} className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default CategoryItem;
