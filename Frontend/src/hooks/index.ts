import {useEffect, useState} from "react";
import {BACKEND_URL} from "../config.ts";
import axios from "axios";

export interface Transaction {
    id: number;
    amount: number;
    category: {
        name : string,
        id : number,
        userId : number
    },
    description: string;
    type: string;
    date : string
}
export interface Category {
    id: number;
    name: string;
    userId: number;
}


export const useTransaction = () => {
    const [loading, setLoading] = useState(true);
    const [transactions, setTransactions] = useState<Transaction[]>([]);// Change setBlog to setBlogs and default value to []

    useEffect(() => {
        axios.get(`${BACKEND_URL}/api/v1/transaction/get`, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })
            .then(response => {
                setTransactions(response.data.transactions);
                setLoading(false);

            })
    }, [])

    return {
        loading,
       transactions
    }
}

export const useUserId = () => {
    const [userId, setUserId] = useState('');

    useEffect(() => {
        axios.get(`${BACKEND_URL}/api/v1/transaction/user`, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })
            .then(response => {
                setUserId(response.data.userId || '');
            })
    }, [])

    return userId;
}
export const useUserName = () => {
    const [userName, setUserName] = useState('');

    useEffect(() => {
        axios.get(`${BACKEND_URL}/api/v1/transaction/user`, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })
            .then(response => {
                setUserName(response.data.userName || '');
            })
    }, [])

    return userName;
}



export const useCategory = ({ userId }: { userId: string }) => {
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        axios.get(`${BACKEND_URL}/api/v1/transaction/categories/${userId}`, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })
            .then(response => {
                setCategories(response.data.categories);
                setLoading(false);

            })
    }, [userId])

    return {
        loading,
        categories
    }
}