import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { API_URL } from "@/lib/config";
const WearablesCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    useEffect(() => {
        const code = searchParams.get("code");
        const state = searchParams.get("state");
        if (code && state) {
            // Redirect to backend callback to exchange code for tokens
            window.location.href = `${API_URL}/api/wearables/oura/callback/?code=${code}&state=${state}`;
        }
        else {
            alert("Oura connection failed - missing authorization code");
            navigate("/profile");
        }
    }, [searchParams, navigate]);
    return (_jsx("div", { className: "flex items-center justify-center min-h-screen bg-gray-50", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4" }), _jsx("p", { className: "text-lg text-gray-700", children: "Connecting to Oura..." })] }) }));
};
export default WearablesCallback;
