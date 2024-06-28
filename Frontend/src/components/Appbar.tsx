import { Link } from "react-router-dom";
import { ProfileLogo } from './ProfileLogo';
import { useUserId } from "../hooks";

export const Appbar = () => {
    const userId = useUserId();

    return (
        <div className="border-b bg-white shadow-md flex justify-between px-10 py-4 text-white">
            <Link to={'/dashboard'} className="flex flex-col justify-center text-xl font-bold text-blue-600 hover:text-blue-800 cursor-pointer">
                Dashboard
            </Link>
            <div className="flex items-center space-x-4">
                <Link to="/signin" className="text-black px-4 py-2 hover:text-red-600">Log Out</Link>
                <Link to="/add">
                    <button className="bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-200 hover:text-black">
                        Add Transaction
                    </button>
                </Link>
                <Link to="/transactions">
                    <button className="bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-200 hover:text-black">
                        All Transaction
                    </button>
                </Link>
                <Link to={`/categories/${userId}`}>
                    <button className="bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-200 hover:text-black">
                        Categories
                    </button>
                </Link>
                <ProfileLogo />
            </div>
        </div>
    );
}
