import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useForm } from "react-hook-form";
import { useState } from "react";
const Login = ({ onLoginSuccess, onClose }) => {
    const inputStyles = `mb-5 w-full rounded-lg bg-primary-300 px-5 py-3 placeholder-white`;
    const [error, setError] = useState("");
    const { register, handleSubmit, formState: { errors }, } = useForm();
    const onSubmit = async (data) => {
        setError("");
        try {
            const response = await fetch("/users/api/login/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include',
                body: JSON.stringify({
                    username: data.username,
                    password: data.password,
                }),
            });
            if (!response.ok) {
                let errorMessage = "Login failed";
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.error || errorData.message || errorMessage;
                }
                catch (e) {
                    errorMessage = `Server error: ${response.status}`;
                }
                setError(errorMessage);
                return;
            }
            const result = await response.json();
            if (result.success) {
                onLoginSuccess();
                onClose();
            }
            else {
                setError(result.error || "Login failed");
            }
        }
        catch (err) {
            console.error("Error logging in:", err);
            setError("Network error. Please check your connection.");
        }
    };
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50", children: _jsxs("div", { className: "bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-4", children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsx("h2", { className: "text-2xl font-bold", children: "Sign In" }), _jsx("button", { onClick: onClose, className: "text-gray-500 hover:text-gray-700 text-2xl", type: "button", children: "\u00D7" })] }), _jsxs("form", { onSubmit: handleSubmit(onSubmit), children: [_jsx("input", { className: inputStyles, type: "text", placeholder: "Username", ...register("username", {
                                required: true,
                                minLength: 3,
                            }) }), errors.username && (_jsxs("p", { className: "mt-1 text-primary-500", children: [errors.username.type === "required" && "Username is required.", errors.username.type === "minLength" && "Username must be at least 3 characters."] })), _jsx("input", { className: inputStyles, type: "password", placeholder: "Password", ...register("password", {
                                required: true,
                                minLength: 1,
                            }) }), errors.password && (_jsx("p", { className: "mt-1 text-primary-500", children: errors.password.type === "required" && "Password is required." })), error && (_jsx("div", { className: "mt-3 p-3 rounded-lg bg-red-100 text-red-800", children: _jsx("p", { children: error }) })), _jsx("button", { type: "submit", className: "mt-5 w-full rounded-lg bg-secondary-500 px-20 py-3 transition duration-500 hover:text-white", children: "Sign In" })] })] }) }));
};
export default Login;
