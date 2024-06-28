import {Appbar} from "../components/Appbar.tsx";


export const HowToUsePage = () => {
    return (
        <div className="min-h-screen bg-gray-100">
            <Appbar/>
        <div className="max-w-4xl mx-auto py-10 px-6">
            <h1 className="text-3xl font-bold mb-6">How to Use the Expense Tracker Website</h1>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>
                <p className="text-gray-700 mb-4">The dashboard provides an overview of your financial status, including:</p>
                <ul className="list-disc list-inside pl-4 text-gray-700">
                    <li><strong>Total Expenses:</strong> Sum of all your expenses.</li>
                    <li><strong>Total Income:</strong> Sum of all your income.</li>
                    <li><strong>Balance:</strong> Difference between your total income and expenses.</li>
                    <li><strong>Spending by Category Pie Chart:</strong> Visual representation of your spending across different categories.</li>
                    <li><strong>Spending Over Time Line Chart:</strong> A timeline showing your spending patterns over a selected period.</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Adding a Transaction</h2>
                <ol className="list-decimal list-inside pl-4 text-gray-700">
                    <li>Navigate to the <strong>Add Transaction</strong> page using the button in the Appbar.</li>
                    <li>Fill in the details such as amount, category, type (income or expense), date, and description.</li>
                    <li>Click <strong>Add Transaction</strong> to add the transaction.</li>
                </ol>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Viewing All Transactions</h2>
                <ol className="list-decimal list-inside pl-4 text-gray-700">
                    <li>Navigate to the <strong>All Transactions</strong> page using the button in the Appbar.</li>
                    <li>Here, you can see a list of all your transactions.</li>
                </ol>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Sorting Transactions</h2>
                <ol className="list-decimal list-inside pl-4 text-gray-700">
                    <li>On the <strong>All Transactions</strong> page, you can sort transactions by:</li>
                    <ul className="list-disc list-inside pl-6">
                        <li><strong>Category:</strong> Select a category from the dropdown menu.</li>
                        <li><strong>Type:</strong> Choose either income or expense.</li>
                        <li><strong>Date Range:</strong> Select a start date and an end date to filter transactions within this period.</li>
                    </ul>
                </ol>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Searching Transactions</h2>
                <ol className="list-decimal list-inside pl-4 text-gray-700">
                    <li>Use the search bar on the <strong>All Transactions</strong> page to search for specific transactions by description.</li>
                </ol>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Editing or Deleting a Transaction</h2>
                <ol className="list-decimal list-inside pl-4 text-gray-700">
                    <li>On the <strong>All Transactions</strong> page, find the transaction you want to edit or delete.</li>
                    <li>Click the <strong>Edit</strong> button next to the transaction to modify its details.</li>
                    <li>Click the <strong>Delete</strong> button to remove the transaction.</li>
                </ol>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Managing Categories</h2>
                <ol className="list-decimal list-inside pl-4 text-gray-700">
                    <li>Navigate to the <strong>Categories</strong> page using the button in the Appbar.</li>
                    <li>Here, you can see all your categories.</li>
                    <li>To edit a category, click the <strong>Edit</strong> button next to the category.</li>
                    <li>To delete a category, click the <strong>Delete</strong> button next to the category.</li>
                </ol>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Appbar Navigation</h2>
                <p className="text-gray-700">The Appbar at the top of the page provides quick links to various sections:</p>
                <ul className="list-disc list-inside pl-4 text-gray-700">
                    <li><strong>Dashboard:</strong> Takes you to the main dashboard.</li>
                    <li><strong>Log Out:</strong> Logs you out of the application.</li>
                    <li><strong>Add Transaction:</strong> Takes you to the Add Transaction page.</li>
                    <li><strong>All Transactions:</strong> Takes you to the All Transactions page.</li>
                    <li><strong>Categories:</strong> Takes you to the Categories page.</li>
                </ul>
            </section>

            <section>
                <p className="text-gray-700">Enjoy using the Expense Tracker to keep your finances organized and under control! If you have any questions or need further assistance, feel free to reach out to our support team.</p>
            </section>
        </div>
        </div>
    );
};
