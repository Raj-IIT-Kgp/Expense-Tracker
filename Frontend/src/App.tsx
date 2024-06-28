import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Signup} from "./pages/Signup.tsx";
import {Signin} from "./pages/Signin.tsx";
import WelcomePage from "./pages/Welcome.tsx";

import Dashboard from "./pages/Dashboard.tsx";
import AddTransaction from "./pages/AddTransaction.tsx";
import Transactions from "./pages/Transactions.tsx";
import EditTransaction from "./pages/EditTransaction.tsx";
import AddCategory from "./pages/AddCategory.tsx";
import EditCategory from "./pages/EditCategory.tsx";
import Categories from "./pages/Categories.tsx";


function App(){
    return(
        <BrowserRouter>
            <Routes>
                <Route path={"/"} element={<WelcomePage/>}/>
                <Route path={"/categories/:userId"} element={<Categories/>}/>
             <Route path={"/signup"} element={<Signup/>}/>
                <Route path={"/signin"} element={<Signin/>}/>
                <Route path={"/dashboard"} element={<Dashboard/>}/>
                <Route path={"/add"} element={<AddTransaction/>}/>
                <Route path={"/transactions"} element={<Transactions/>}/>
                <Route path={"transactions/edit/:id"} element={<EditTransaction/>}/>
                <Route path={"/add/categories"} element={<AddCategory/>}/>
                <Route path={"categories/edit/:id"} element={<EditCategory/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default App;