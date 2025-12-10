import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/navbar";
import { SelectedPage } from "@/shared/types";
const ProfilePage = () => {
    const [workouts, setWorkouts] = useState([]);
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedPage, setSelectedPage] = useState(SelectedPage.Home);
    const navigate = useNavigate();
    useEffect(() => {
        // Check if user is authenticated
        fetch(`${API_URL}/users/api/check-auth/`, {
            credentials: "include",
        })
            .then((res) => res.json())
            .then((data) => {
            if (!data.authenticated) {
                navigate("/");
                return;
            }
            // Fetch profile and workouts
            fetchProfileData();
        })
            .catch((err) => {
            console.error("Error checking auth:", err);
            setError("Failed to authenticate");
            setLoading(false);
        });
    }, [navigate]);
    const fetchProfileData = async () => {
        try {
            const response = await fetch("/profile/api/", {
                credentials: "include",
            });
            if (!response.ok) {
                if (response.status === 401) {
                    navigate("/");
                    return;
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setWorkouts(data.workouts || []);
            setUser(data.user);
            setProfile(data.profile);
            setLoading(false);
        }
        catch (err) {
            console.error("Error fetching profile data:", err);
            setError("Failed to load profile data");
            setLoading(false);
        }
    };
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };
    if (loading) {
        return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx(Navbar, { isTopOfPage: false, selectedPage: selectedPage, setSelectedPage: setSelectedPage }), _jsx("div", { className: "flex items-center justify-center h-screen", children: _jsx("p", { className: "text-lg", children: "Loading profile..." }) })] }));
    }
    if (error) {
        return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx(Navbar, { isTopOfPage: false, selectedPage: selectedPage, setSelectedPage: setSelectedPage }), _jsx("div", { className: "flex items-center justify-center h-screen", children: _jsx("p", { className: "text-lg text-red-500", children: error }) })] }));
    }
    return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx(Navbar, { isTopOfPage: false, selectedPage: selectedPage, setSelectedPage: setSelectedPage }), _jsx("div", { className: "pt-24 pb-16", children: _jsxs("div", { className: "max-w-4xl mx-auto px-4", children: [_jsxs("div", { className: "bg-white rounded-lg shadow-md p-8 mb-8", children: [_jsxs("h1", { className: "text-4xl font-bold text-primary-500 mb-4", children: [user?.username, "'s Profile"] }), profile && (_jsxs("div", { className: "space-y-2", children: [profile.bio && (_jsxs("p", { className: "text-gray-700", children: [_jsx("span", { className: "font-semibold", children: "Bio:" }), " ", profile.bio] })), profile.location && (_jsxs("p", { className: "text-gray-700", children: [_jsx("span", { className: "font-semibold", children: "Location:" }), " ", profile.location] }))] }))] }), _jsxs("div", { className: "bg-white rounded-lg shadow-md p-8", children: [_jsx("h2", { className: "text-3xl font-bold text-primary-500 mb-6", children: "Your Workouts" }), workouts.length === 0 ? (_jsxs("div", { className: "text-center py-12", children: [_jsx("p", { className: "text-lg text-gray-500", children: "No workouts logged yet." }), _jsx("p", { className: "text-gray-400 mt-2", children: "Start logging your workouts to see them here!" })] })) : (_jsx("div", { className: "space-y-4 overflow-y-auto pr-2", style: {
                                        maxHeight: '70vh',
                                        scrollBehavior: 'smooth',
                                    }, children: workouts.map((workout) => (_jsx("div", { className: "border-2 border-primary-300 rounded-lg p-6 hover:bg-primary-50 transition-colors", children: _jsx("div", { className: "flex items-start justify-between", children: _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-3 mb-2", children: [_jsx("span", { className: `px-3 py-1 rounded-full text-sm font-semibold ${workout.type === "cardio"
                                                                    ? "bg-accent-500 text-white"
                                                                    : "bg-secondary-500 text-white"}`, children: workout.type.toUpperCase() }), _jsx("h3", { className: "text-xl font-bold text-gray-800", children: workout.activity })] }), _jsx("p", { className: "text-gray-600 text-sm", children: formatDate(workout.date) }), workout.duration && (_jsxs("p", { className: "text-gray-700 mt-2", children: [_jsx("span", { className: "font-semibold", children: "Duration:" }), " ", workout.duration, " minutes"] }))] }) }) }, workout.id))) }))] })] }) })] }));
};
export default ProfilePage;
