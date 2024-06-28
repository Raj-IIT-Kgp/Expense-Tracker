import { Link, useNavigate } from 'react-router-dom';
import { BACKEND_URL } from "../config.ts";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons'; // Changed from faTrashCan to faTrashAlt

interface TransactionItemProps {
    id: number;
    amount: number;
    category: string;
    description: string;
    type: string;
    date: string;
}

export const TransactionItem = ({
                                    id,
                                    amount,
                                    category,
                                    description,
                                    type,
                                    date
                                }: TransactionItemProps) => {
    const navigate = useNavigate();

    const deleteTransaction = async () => {
        if (window.confirm("Do you want to delete the Transaction?")) {
            try {
                const response = await axios.delete(`${BACKEND_URL}/api/v1/transaction/${id}`, {
                    headers: {
                        Authorization: localStorage.getItem("token"),
                    },
                });
                alert(response.data.message);
                navigate('/dashboard');
            } catch (error) {
                console.error("There was an error deleting the transaction:", error);
            }
        }
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow-md relative">
            <div className="flex justify-between items-start space-x-4">
                <div className="flex flex-col space-y-2 w-full">
                    <div className="text-xl font-bold text-gray-900">
                        ${amount}
                    </div>
                    <div className="text-sm font-medium text-gray-500">
                        {category}
                    </div>
                    <div className="text-sm text-gray-700">
                        {description.slice(0, 100) + "..."}
                    </div>
                    <div className={`text-sm font-medium ${type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                        {type}
                    </div>
                </div>
                <div className="absolute top-2 right-2 text-sm text-gray-500">
                    {date.substring(0, 10)}
                </div>
            </div>
            <div className="absolute bottom-2 right-2 flex space-x-2">
                <Link to={`edit/${id}`}>
                    <button className="text-gray-500 hover:text-gray-700 focus:outline-none transition-colors duration-300">
                        <FontAwesomeIcon icon={faEdit} className="w-4 h-4" />
                    </button>
                </Link>
                <button
                    onClick={deleteTransaction}
                    className="text-red-500 hover:text-gray-700 focus:outline-none transition-colors duration-300"
                >
                    <FontAwesomeIcon icon={faTrashAlt} className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default TransactionItem;
