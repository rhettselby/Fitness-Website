import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Link from "./link";
import useMediaQuery from "@/hooks/useMediaQuery";
import ActionButton from "@/shared/ActionButton";
import Login from "@/components/Login";
import { API_URL } from "@/lib/config";
import { TokenService } from "@/utils/auth";
const Navbar = ({ isTopOfPage, selectedPage, setSelectedPage }) => {
    const flexBetween = "flex items-center justify-between";
    const [isMenuToggled, setIsMenuToggled] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState("");
    const isAboveMediumScreens = useMediaQuery("(min-width: 1060px)");
    const navbarBackground = isTopOfPage ? "" : "bg-primary-100 drop-shadow";
    const navigate = useNavigate();
    const location = useLocation();
    const isProfilePage = location.pathname === "/profile";
    const isConnectPage = location.pathname === "/connect";
    const checkAuth = async () => {
        const token = TokenService.getAccessToken();
        if (!token) {
            setIsAuthenticated(false);
            setUsername("");
            return;
        }
        try {
            const response = await fetch(`${API_URL}/users/api/check-auth-jwt/`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                setIsAuthenticated(false);
                setUsername("");
                TokenService.removeTokens();
                return;
            }
            const data = await response.json();
            if (data.authenticated && data.user) {
                setIsAuthenticated(true);
                setUsername(data.user.username);
                TokenService.setUser(data.user);
            }
            else {
                setIsAuthenticated(false);
                setUsername("");
                TokenService.removeTokens();
            }
        }
        catch {
            setIsAuthenticated(false);
            setUsername("");
            TokenService.removeTokens();
        }
    };
    useEffect(() => {
        checkAuth();
    }, []);
    useEffect(() => {
        setIsMenuToggled(false);
    }, [location.pathname]);
    const handleLoginSuccess = () => checkAuth();
    const handleLogout = () => {
        TokenService.removeTokens();
        setIsAuthenticated(false);
        setUsername("");
        navigate("/");
    };
    return (_jsxs("nav", { children: [_jsx("div", { className: `${flexBetween} fixed top-0 z-30 w-full py-6`, children: _jsx("div", { className: `${navbarBackground} ${flexBetween} mx-auto w-5/6 pr-8`, children: _jsxs("div", { className: `${flexBetween} w-full gap-16`, children: [_jsxs("button", { onClick: () => navigate("/"), className: "flex flex-col leading-none text-left bg-transparent border-none cursor-pointer p-0 shrink-0", children: [_jsx("span", { className: `font-extrabold tracking-tight ${isTopOfPage ? "text-white" : "text-gray-900"}`, style: { fontSize: "1.25rem" }, children: "Rhett's" }), _jsx("span", { className: `font-bold tracking-wide ${isTopOfPage ? "text-primary-300" : "text-primary-500"}`, style: { fontSize: "1rem" }, children: "Fitness" })] }), isAboveMediumScreens ? (_jsxs("div", { className: `${flexBetween} w-full`, children: [_jsxs("div", { className: `${flexBetween} gap-8 text-sm`, children: [_jsx(Link, { page: "Home", selectedPage: selectedPage, isTopOfPage: isTopOfPage, setSelectedPage: setSelectedPage }), _jsx(Link, { page: "Leaderboard", selectedPage: selectedPage, isTopOfPage: isTopOfPage, setSelectedPage: setSelectedPage }), !isAuthenticated && (_jsx(Link, { page: "Contact Us", selectedPage: selectedPage, isTopOfPage: isTopOfPage, setSelectedPage: setSelectedPage })), isAuthenticated && (_jsx("button", { onClick: () => navigate("/add-workout"), className: `font-bold transition duration-500 hover:text-primary-300 ${location.pathname === "/add-workout"
                                                    ? "text-primary-500"
                                                    : isTopOfPage ? "text-white" : "text-gray-900"}`, children: "Add Workout" })), isAuthenticated && (_jsx(Link, { page: "Connect", selectedPage: selectedPage, isTopOfPage: isTopOfPage, setSelectedPage: setSelectedPage })), isAuthenticated && (_jsx("button", { onClick: () => navigate("/groups"), className: `font-bold transition duration-500 hover:text-primary-300 ${location.pathname === "/groups"
                                                    ? "text-primary-500"
                                                    : isTopOfPage ? "text-white" : "text-gray-900"}`, children: "Groups" }))] }), _jsx("div", { className: `${flexBetween} gap-8`, children: isAuthenticated ? (_jsxs(_Fragment, { children: [_jsxs("span", { className: `text-sm font-bold ${isTopOfPage ? "text-white" : "text-gray-900"}`, children: ["Hello, ", username] }), _jsx("button", { onClick: () => navigate("/profile"), className: `text-sm font-bold transition duration-500 cursor-pointer ${isTopOfPage ? "text-white hover:text-primary-300" : "text-gray-900 hover:text-primary-500"}`, children: "Profile" }), _jsx("button", { onClick: handleLogout, className: `text-sm font-bold transition duration-500 cursor-pointer ${isTopOfPage ? "text-white hover:text-primary-300" : "text-gray-900 hover:text-primary-500"}`, children: "Sign out" })] })) : (_jsxs(_Fragment, { children: [_jsx("button", { onClick: () => setShowLogin(true), className: `text-sm font-bold transition duration-500 cursor-pointer ${isTopOfPage ? "text-white hover:text-primary-300" : "text-gray-900 hover:text-primary-500"}`, children: "Sign in" }), !isProfilePage && !isConnectPage && (_jsx(ActionButton, { setSelectedPage: setSelectedPage, children: "Become a Member" }))] })) })] })) : (_jsx("div", { className: "ml-auto", children: _jsx("button", { "aria-label": "Open menu", className: `p-2 rounded-md transition ${isTopOfPage ? "text-white hover:bg-white/10" : "text-gray-900 hover:bg-gray-100"}`, onClick: () => setIsMenuToggled(true), children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M4 6h16M4 12h16M4 18h16" }) }) }) }))] }) }) }), !isAboveMediumScreens && (_jsxs(_Fragment, { children: [_jsx("div", { className: `fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${isMenuToggled ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`, onClick: () => setIsMenuToggled(false) }), _jsxs("div", { className: `fixed right-0 top-0 z-50 h-full w-[300px] bg-primary-100 drop-shadow-xl
              transform transition-transform duration-300 ease-in-out
              ${isMenuToggled ? "translate-x-0" : "translate-x-full"}`, children: [_jsx("div", { className: "flex justify-end p-5", children: _jsx("button", { "aria-label": "Close menu", className: "p-2 rounded-md text-gray-900 hover:bg-gray-200 transition", onClick: () => setIsMenuToggled(false), children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M6 18L18 6M6 6l12 12" }) }) }) }), isAuthenticated && (_jsxs("div", { className: "px-8 pb-4 text-sm font-bold text-gray-700", children: ["Hello, ", username] })), _jsxs("div", { className: "flex flex-col gap-6 px-8 text-xl font-bold text-gray-900", children: [_jsx(Link, { page: "Home", selectedPage: selectedPage, setSelectedPage: setSelectedPage, isTopOfPage: false }), _jsx(Link, { page: "Leaderboard", selectedPage: selectedPage, setSelectedPage: setSelectedPage, isTopOfPage: false }), !isAuthenticated && (_jsx(Link, { page: "Contact Us", selectedPage: selectedPage, setSelectedPage: setSelectedPage, isTopOfPage: false })), isAuthenticated && (_jsx("button", { onClick: () => { navigate("/add-workout"); setIsMenuToggled(false); }, className: "text-left hover:text-primary-500 transition", children: "Add Workout" })), isAuthenticated && (_jsx(Link, { page: "Connect", selectedPage: selectedPage, setSelectedPage: setSelectedPage, isTopOfPage: false })), isAuthenticated && (_jsx("button", { onClick: () => { navigate("/profile"); setIsMenuToggled(false); }, className: "text-left hover:text-primary-500 transition", children: "Profile" })), _jsx("div", { className: "border-t border-gray-300 pt-4", children: isAuthenticated ? (_jsx("button", { onClick: handleLogout, className: "text-left hover:text-primary-500 transition", children: "Sign out" })) : (_jsxs("div", { className: "flex flex-col gap-4", children: [_jsx("button", { onClick: () => { setShowLogin(true); setIsMenuToggled(false); }, className: "text-left hover:text-primary-500 transition", children: "Sign in" }), !isProfilePage && !isConnectPage && (_jsx(ActionButton, { setSelectedPage: setSelectedPage, children: "Become a Member" }))] })) })] })] })] })), showLogin && (_jsx(Login, { onLoginSuccess: handleLoginSuccess, onClose: () => setShowLogin(false) }))] }));
};
export default Navbar;
