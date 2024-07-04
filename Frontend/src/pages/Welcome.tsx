import { Link } from 'react-router-dom';
const WelcomePage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-green-500 text-white">
            <header className="text-center">
                <h1 className="text-6xl font-bold mb-4">Welcome to Expense Tracker</h1>
                <p className="text-2xl mb-8">Track your expenses effortlessly and efficiently</p>
                <div className="flex space-x-4  col justify-center">
                    <Link to="/signup">
                        <button className="bg-white text-blue-500 font-semibold py-2 px-4 rounded shadow-lg transition-transform transform hover:scale-105">
                            Get Started
                        </button>
                    </Link>
                    <Link to="/signin">
                        <button className="bg-white text-blue-500 font-semibold py-2 px-4 rounded shadow-lg transition-transform transform hover:scale-105">
                            Sign In
                        </button>
                    </Link>
                </div>
            </header>
        </div>
    );
};

export default WelcomePage;
