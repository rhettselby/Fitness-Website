import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import { useNavigate, useLocation } from "react-router-dom";
import UCLA_Logo from "@/assets/UCLA_Logo.svg";
import Logo_Placeholder from "@/assets/Logo.png";
import Link from "./link";
import useMediaQuery from "@/hooks/useMediaQuery";
import ActionButton from "@/shared/ActionButton";
import Login from "@/components/Login";
const Navbar = ({ isTopOfPage, selectedPage, setSelectedPage }) => {
    const flexBetween = "flex items-center justify-between";
    const [isMenuToggled, setIsMenuToggled] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState("");
    const [logoError, setLogoError] = useState(false);
    const isAboveMediumScreens = useMediaQuery("(min-width: 1060px)");
    const navbarBackground = isTopOfPage ? "" : "bg-primary-100 drop-shadow";
    const navigate = useNavigate();
    const location = useLocation();
    // Check if we're on the profile page
    const isProfilePage = location.pathname === "/profile";
    const checkAuth = async () => {
        try {
            const response = await fetch("/users/api/check-auth/", {
                credentials: 'include',
            });
            if (!response.ok) {
                console.error("Auth check failed:", response.status);
                setIsAuthenticated(false);
                setUsername("");
                return;
            }
            const data = await response.json();
            console.log("Auth check response:", data); // Debug log
            if (data.authenticated) {
                setIsAuthenticated(true);
                setUsername(data.user.username);
            }
            else {
                setIsAuthenticated(false);
                setUsername("");
            }
        }
        catch (error) {
            console.error("Error checking auth:", error);
            setIsAuthenticated(false);
            setUsername("");
        }
    };
    // Check authentication status on mount
    useEffect(() => {
        checkAuth();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const handleLoginSuccess = () => {
        checkAuth(); // Refresh auth status
    };
    const handleLogout = async () => {
        try {
            await fetch("/users/api/logout/", {
                method: "POST",
                credentials: 'include',
            });
            setIsAuthenticated(false);
            setUsername("");
        }
        catch (error) {
            console.error("Error logging out:", error);
        }
    };
    return (_jsxs("nav", { children: [_jsx("div", { className: `${flexBetween} fixed top-0 z-30 w-full py-6`, children: _jsx("div", { className: `${navbarBackground} ${flexBetween} mx-auto w-5/6`, children: _jsxs("div", { className: `${flexBetween} w-full gap-16`, children: [_jsx("button", { onClick: () => navigate("/"), className: "flex items-center bg-transparent border-none cursor-pointer p-0", children: logoError ? (_jsx("img", { alt: "Logo Placeholder", src: Logo_Placeholder, className: "h-12 w-auto cursor-pointer hover:opacity-80 transition-opacity", style: { backgroundColor: 'transparent' } })) : (_jsx("img", { alt: "UCLA Logo", src: UCLA_Logo, className: "cursor-pointer hover:opacity-90 transition-opacity", style: {
                                        height: '50px',
                                        width: 'auto',
                                        minWidth: '160px',
                                        backgroundColor: 'transparent',
                                        display: 'block',
                                        border: 'none',
                                        outline: 'none'
                                    }, onError: () => setLogoError(true) })) }), isAboveMediumScreens ? (_jsxs("div", { className: `${flexBetween} w-full`, children: [_jsx("div", { className: `${flexBetween} gap-8 text-sm`, children: !isProfilePage && (_jsxs(_Fragment, { children: [_jsx(Link, { page: "Home", selectedPage: selectedPage, setSelectedPage: setSelectedPage }), _jsx(Link, { page: "Benefits", selectedPage: selectedPage, setSelectedPage: setSelectedPage }), _jsx(Link, { page: "Leaderboard", selectedPage: selectedPage, setSelectedPage: setSelectedPage }), !isAuthenticated && (_jsx(Link, { page: "Contact Us", selectedPage: selectedPage, setSelectedPage: setSelectedPage })), isAuthenticated && (_jsx("button", { onClick: () => navigate("/add-workout"), className: `font-bold transition duration-500 hover:text-primary-300 ${location.pathname === "/add-workout" ? "text-primary-500" : ""}`, children: "Add Workout" }))] })) }), _jsx("div", { className: `${flexBetween} gap-8`, children: isAuthenticated ? (_jsxs(_Fragment, { children: [_jsxs("span", { className: "text-sm", children: ["Hello, ", username] }), _jsx("button", { onClick: () => navigate("/profile"), className: "text-sm hover:text-primary-500 transition duration-500 cursor-pointer", children: "Profile" }), _jsx("button", { onClick: handleLogout, className: "text-sm hover:text-primary-500 transition duration-500 cursor-pointer", children: "Sign out" })] })) : (_jsxs(_Fragment, { children: [_jsx("button", { onClick: () => setShowLogin(true), className: "text-sm hover:text-primary-500 transition duration-500 cursor-pointer", children: "Sign in" }), !isProfilePage && (_jsx(ActionButton, { setSelectedPage: setSelectedPage, children: "Become a Member" }))] })) })] })) : (_jsx("button", { className: "rounded-full bg-secondary-500 p-2", onClick: () => setIsMenuToggled(!isMenuToggled), children: _jsx(Bars3Icon, { className: "h-6 w-6 text-white" }) }))] }) }) }), !isAboveMediumScreens && isMenuToggled && (_jsxs("div", { className: "fixed right-0 bottom-0 z-40 h-full w-[300px] bg-primary-100 drop-shadow-xl", children: [_jsx("div", { className: "flex justify-end p-12", children: _jsx("button", { onClick: () => setIsMenuToggled(!isMenuToggled), children: _jsx(XMarkIcon, { className: "h-6 w-6 text-gray-400" }) }) }), _jsxs("div", { className: "ml-[33%] flex flex-col gap-10 text-2xl", children: [!isProfilePage ? (_jsxs(_Fragment, { children: [_jsx(Link, { page: "Home", selectedPage: selectedPage, setSelectedPage: setSelectedPage }), _jsx(Link, { page: "Benefits", selectedPage: selectedPage, setSelectedPage: setSelectedPage }), _jsx(Link, { page: "Leaderboard", selectedPage: selectedPage, setSelectedPage: setSelectedPage }), !isAuthenticated && (_jsx(Link, { page: "Contact Us", selectedPage: selectedPage, setSelectedPage: setSelectedPage })), isAuthenticated && (_jsx("button", { onClick: () => {
                                            navigate("/add-workout");
                                            setIsMenuToggled(false);
                                        }, className: "text-left font-bold", children: "Add Workout" }))] })) : (_jsx("button", { onClick: () => navigate("/"), className: "text-left", children: "Home" })), isAuthenticated && (_jsx("button", { onClick: () => navigate("/profile"), className: "text-left", children: "Profile" })), isAuthenticated ? (_jsx("button", { onClick: handleLogout, className: "text-left", children: "Sign out" })) : (_jsx("button", { onClick: () => setShowLogin(true), className: "text-left", children: "Sign in" }))] })] })), showLogin && (_jsx(Login, { onLoginSuccess: handleLoginSuccess, onClose: () => setShowLogin(false) }))] }));
};
export default Navbar;
