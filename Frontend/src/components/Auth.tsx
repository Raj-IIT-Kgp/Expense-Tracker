import { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SignupInput } from "@raj9339/common-app";
import axios, { AxiosError } from "axios"; // Import AxiosError for TypeScript support
import { BACKEND_URL } from "../config.ts";
import LoadingSpinner from "./LoadingSpinner.tsx";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export const Auth = ({ type }: { type: "signup" | "signin" }) => {
    const navigate = useNavigate();
    const [postInputs, setPostInputs] = useState<SignupInput>({
        name: "",
        username: "",
        password: ""
    });
    const [isLoading, setIsLoading] = useState(false);

    async function sendRequest() {
        setIsLoading(true);
        try {
            const response = await axios.post(`${BACKEND_URL}/api/v1/user/${type === "signup" ? "signup" : "signin"}`, postInputs);
            const jwt = response.data.token;
            localStorage.setItem("token", jwt);
            if (response.data.message) {
                alert(response.data.message);
            }
            navigate("/dashboard");
        } catch (error) {
            if (axios.isAxiosError(error)) {
                // Handle Axios-specific errors
                const axiosError = error as AxiosError;
                if (axiosError.response) {
                    // The request was made and the server responded with a status code
                    if (axiosError.response.status === 400) {
                        alert("Username already exists. Please choose a different username.");
                    } else if (axiosError.response.status === 401) {
                        alert("User not found or password is incorrect");
                    } else if (axiosError.response.status === 411) {
                        alert("Invalid input. Please provide valid input data.");
                    } else {
                        alert("Server error. Please try again later.");
                    }
                } else if (axiosError.request) {
                    // The request was made but no response was received
                    alert("No response from server. Please check your internet connection or try again later.");
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.error('Error', axiosError.message);
                    alert("An unexpected error occurred. Please try again later.");
                }
            } else if(error instanceof  Error) {
                // Handle non-Axios errors
                console.error('Error', error.message);
                alert("An unexpected error occurred. Please try again later.");
            }
        } finally {
            setIsLoading(false);
        }
    }

    if (isLoading) {
        return <div className="h-screen flex justify-center items-center">
            <LoadingSpinner />
        </div>;
    }

    return (
        <div className="h-screen flex justify-center items-center flex-col">
            <div className="p-8 rounded-lg shadow-lg w-full max-w-md">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold mb-4">{type === "signup" ? "Create an account" : "Sign in to your account"}</h2>
                    <p className="text-slate-500">
                        {type === "signin" ? "Don't have an account?" : "Already have an account?"}
                        <Link className="pl-2 underline text-blue-600" to={type === "signin" ? "/signup" : "/signin"}>
                            {type === "signin" ? "Sign up" : "Sign in"}
                        </Link>
                    </p>
                </div>
                <div className="pt-8">
                    {type === "signup" ? <LabelledInput label="Name" placeholder="Raj Majumder..." onChange={(e) => {
                        setPostInputs({
                            ...postInputs,
                            name: e.target.value
                        })
                    }} /> : null}
                    <LabelledInput label="email" placeholder="raj@gmail.com" onChange={(e) => {
                        setPostInputs({
                            ...postInputs,
                            username: e.target.value
                        })
                    }} />
                    <LabelledInput label="Password" type={"password"} placeholder="123456" onChange={(e) => {
                        setPostInputs({
                            ...postInputs,
                            password: e.target.value
                        })
                    }} />
                    <button onClick={sendRequest} type="button" className="mt-8 w-full text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 transition duration-300">{type === "signup" ? "Sign up" : "Sign in"}</button>
                </div>
            </div>
        </div>
    );
}

interface LabelledInputType {
    label: string;
    placeholder: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    type?: string;
}
function LabelledInput({ label, placeholder, onChange, type }: LabelledInputType) {
    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    return (
        <div className="mb-4">
            <label className="block mb-2 text-sm text-gray-700 font-semibold">{label}</label>
            <div className="relative">
                <input onChange={onChange} type={type === 'password' && !showPassword ? 'password' : 'text'} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder={placeholder} required />
                {type === 'password' && (
                    <div onClick={togglePasswordVisibility} className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer">
                        {showPassword ? <AiOutlineEyeInvisible className="text-gray-500" /> : <AiOutlineEye className="text-gray-500" />}
                    </div>
                )}
            </div>
        </div>
    );
}
