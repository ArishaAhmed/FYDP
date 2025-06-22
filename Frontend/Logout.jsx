import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LogoutPage = ({ setToken, setRole }) => {
    const navigate = useNavigate();

    useEffect(() => {
        // Clear token from local storage and reset state
        localStorage.removeItem("token");
        setToken(null);
        setRole(null);

        // Optionally navigate to the login page or show a confirmation
        navigate("/login"); // Redirects to login page
    }, [navigate, setToken, setRole]);

    return (
        <div className="max-w-md mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">You have been logged out.</h1>
            <p className="text-gray-600">Thank you for visiting. You will be redirected shortly...</p>
            <button
                className="w-full bg-blue-500 text-white p-2 rounded mt-4"
                onClick={() => navigate("/login")}
            >
                Go to Login
            </button>
        </div>
    );
};

export default LogoutPage;
