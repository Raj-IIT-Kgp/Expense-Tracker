import { Link, useNavigate } from "react-router-dom";
import { ProfileLogo } from './ProfileLogo';
import { useUserId } from "../hooks";

export const Appbar = () => {
    const userId = useUserId();
  const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.removeItem("token");
       navigate("/signin")
    };

    return (
        <div className="border-b bg-white shadow-md flex justify-between px-10 py-4">
            <Link to="/dashboard" className="flex flex-col justify-center text-xl font-bold text-blue-600 hover:text-blue-800 cursor-pointer">
                Dashboard
            </Link>
            <div className="flex items-center space-x-4">
                <button onClick={handleLogout} className="text-black px-4 py-2 hover:text-red-600">
                    Log Out
                </button>
                <Link to="/add">
                    <button className="bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300 hover:text-black transition duration-200 ease-in-out">
                        Add Transaction
                    </button>
                </Link>
                <Link to="/transactions">
                    <button className="bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300 hover:text-black transition duration-200 ease-in-out">
                        All Transactions
                    </button>
                </Link>
                <Link to={`/categories/${userId}`}>
                    <button className="bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300 hover:text-black transition duration-200 ease-in-out">
                        Categories
                    </button>
                </Link>
                <Link to="/how">
                    <button className="bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300 hover:text-black transition duration-200 ease-in-out">
                        How to Use?
                    </button>
                </Link>
                <ProfileLogo />
            </div>
        </div>
    );
};
