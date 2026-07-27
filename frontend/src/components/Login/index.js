import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { API_URL } from "@/lib/config";
import { TokenService } from "@/utils/auth";
const Login = ({ onLoginSuccess, onClose }) => {
    const inputStyles = `mb-5 w-full rounded-lg bg-primary-300 px-5 py-3 placeholder-white text-black text-base`;
    const [error, setError] = useState("");
    const { register, handleSubmit, formState: { errors }, reset, } = useForm();
    const onSubmit = async (data) => {
        setError("");
        try {
            const response = await fetch(`${API_URL}/users/api/login-jwt/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
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
                catch {
                    errorMessage = `Server error: ${response.status}`;
                }
                setError(errorMessage);
                return;
            }
            const result = await response.json();
            if (result.success) {
                TokenService.setTokens(result.access, result.refresh);
                TokenService.setUser(result.user);
                reset();
                window.location.reload();
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
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4", onClick: (e) => { if (e.target === e.currentTarget)
            onClose(); }, children: _jsxs("div", { className: "bg-white p-6 sm:p-8 rounded-lg shadow-xl w-full max-w-md", children: [_jsxs("div", { className: "flex justify-between items-center mb-5", children: [_jsx("h2", { className: "text-xl sm:text-2xl font-bold text-gray-900", children: "Sign In" }), _jsx("button", { onClick: onClose, className: "text-gray-400 hover:text-gray-700 text-3xl leading-none transition", type: "button", "aria-label": "Close", children: "\u00D7" })] }), _jsxs("form", { onSubmit: handleSubmit(onSubmit), children: [_jsx("input", { className: inputStyles, type: "text", placeholder: "Username", autoComplete: "username", ...register("username", { required: true, minLength: 3 }) }), errors.username && (_jsxs("p", { className: "mt-1 mb-3 text-sm text-primary-500", children: [errors.username.type === "required" && "Username is required.", errors.username.type === "minLength" && "Username must be at least 3 characters."] })), _jsx("input", { className: inputStyles, type: "password", placeholder: "Password", autoComplete: "current-password", ...register("password", { required: true, minLength: 1 }) }), errors.password && (_jsx("p", { className: "mt-1 mb-3 text-sm text-primary-500", children: errors.password.type === "required" && "Password is required." })), error && (_jsx("div", { className: "mt-2 p-3 rounded-lg bg-red-100 text-red-800 text-sm", children: _jsx("p", { children: error }) })), _jsx("button", { type: "submit", className: "mt-5 w-full rounded-lg bg-secondary-500 text-white py-3 font-bold transition duration-300 hover:bg-secondary-600 active:scale-95 text-base", children: "Sign In" })] })] }) }));
};
export default Login;
