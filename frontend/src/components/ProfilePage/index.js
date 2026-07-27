import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/navbar";
import { SelectedPage } from "@/shared/types";
import { API_URL } from "@/lib/config";
import { TokenService } from "@/utils/auth";
const ProfilePage = () => {
    const [workouts, setWorkouts] = useState([]);
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [formData, setFormData] = useState({ bio: "", location: "", birthday: "" });
    const [birthdayInputs, setBirthdayInputs] = useState({ month: "", day: "", year: "" });
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedPage, setSelectedPage] = useState(SelectedPage.Home);
    const navigate = useNavigate();
    const formatDate = (dateString) => new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
    useEffect(() => {
        const token = TokenService.getAccessToken();
        if (!token) {
            navigate("/");
            return;
        }
        fetch(`${API_URL}/users/api/check-auth-jwt/`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data) => {
            if (!data.authenticated) {
                navigate("/");
                return;
            }
            fetchProfileData();
        })
            .catch(() => { setError("Failed to authenticate"); setLoading(false); });
    }, [navigate]);
    const fetchProfileData = async () => {
        try {
            const token = TokenService.getAccessToken();
            if (!token) {
                navigate("/");
                return;
            }
            const res = await fetch(`${API_URL}/api/profile/profile-jwt/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok)
                throw new Error();
            const data = await res.json();
            setWorkouts(data.workouts);
            setUser(data.user);
            setProfile(data.profile);
            setFormData({
                bio: data.profile?.bio ?? "",
                location: data.profile?.location ?? "",
                birthday: data.profile?.birthday ?? "",
            });
            if (data.profile?.birthday) {
                const d = new Date(data.profile.birthday);
                setBirthdayInputs({
                    month: String(d.getMonth() + 1).padStart(2, "0"),
                    day: String(d.getDate()).padStart(2, "0"),
                    year: String(d.getFullYear()),
                });
            }
            setLoading(false);
        }
        catch {
            setError("Failed to load profile");
            setLoading(false);
        }
    };
    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        const { month, day, year } = birthdayInputs;
        const formattedBirthday = month && day && year ? `${year}-${month}-${day}` : null;
        try {
            const token = TokenService.getAccessToken();
            const res = await fetch(`${API_URL}/api/profile/editprofile-jwt/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ ...formData, birthday: formattedBirthday }),
            });
            const data = await res.json();
            if (!data.success)
                throw new Error();
            setProfile(data.profile);
            setIsEditing(false);
        }
        catch {
            alert("Failed to update profile");
        }
    };
    if (loading) {
        return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx(Navbar, { isTopOfPage: false, selectedPage: selectedPage, setSelectedPage: setSelectedPage }), _jsx("div", { className: "flex items-center justify-center h-screen", children: _jsx("p", { className: "text-lg", children: "Loading profile..." }) })] }));
    }
    if (error) {
        return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx(Navbar, { isTopOfPage: false, selectedPage: selectedPage, setSelectedPage: setSelectedPage }), _jsx("div", { className: "flex items-center justify-center h-screen", children: _jsx("p", { className: "text-lg text-red-500", children: error }) })] }));
    }
    return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx(Navbar, { isTopOfPage: false, selectedPage: selectedPage, setSelectedPage: setSelectedPage }), _jsxs("div", { className: "pt-20 pb-12 md:pt-24 md:pb-16 max-w-4xl mx-auto px-4 sm:px-6", children: [_jsxs("div", { className: "bg-white rounded-lg shadow-md p-5 sm:p-8 mb-6 md:mb-8", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4", children: [_jsxs("h1", { className: "text-2xl sm:text-3xl md:text-4xl font-bold text-primary-500", children: [user?.username, "'s Profile"] }), _jsx("button", { onClick: () => setIsEditing(!isEditing), className: "self-start sm:self-auto px-4 py-2 bg-secondary-500 text-white rounded-md hover:bg-secondary-600 transition text-sm sm:text-base whitespace-nowrap", children: isEditing ? "Cancel" : "Edit Profile" })] }), !isEditing && profile && (_jsxs("div", { className: "space-y-2 text-sm sm:text-base", children: [_jsxs("p", { className: "text-gray-700", children: [_jsx("span", { className: "font-semibold", children: "Bio:" }), " ", profile.bio || _jsx("span", { className: "text-gray-400 italic", children: "Not set" })] }), _jsxs("p", { className: "text-gray-700", children: [_jsx("span", { className: "font-semibold", children: "Location:" }), " ", profile.location || _jsx("span", { className: "text-gray-400 italic", children: "Not set" })] }), _jsxs("p", { className: "text-gray-700", children: [_jsx("span", { className: "font-semibold", children: "Birthday:" }), " ", profile.birthday
                                                ? new Date(profile.birthday + "T00:00:00").toLocaleDateString()
                                                : _jsx("span", { className: "text-gray-400 italic", children: "Not set" })] })] })), isEditing && (_jsxs("form", { onSubmit: handleProfileUpdate, className: "space-y-4 mt-2", children: [_jsxs("div", { children: [_jsx("label", { className: "block font-semibold mb-1 text-sm sm:text-base", children: "Bio" }), _jsx("textarea", { className: "w-full border rounded-md p-2 text-black text-base", rows: 3, value: formData.bio ?? "", onChange: (e) => setFormData({ ...formData, bio: e.target.value }) })] }), _jsxs("div", { children: [_jsx("label", { className: "block font-semibold mb-1 text-sm sm:text-base", children: "Location" }), _jsx("input", { type: "text", className: "w-full border rounded-md p-2 text-black text-base", value: formData.location ?? "", onChange: (e) => setFormData({ ...formData, location: e.target.value }) })] }), _jsxs("div", { children: [_jsx("label", { className: "block font-semibold mb-1 text-sm sm:text-base", children: "Birthday" }), _jsxs("div", { className: "grid grid-cols-3 gap-2", children: [_jsxs("select", { className: "border rounded-md p-2 text-black text-sm", value: birthdayInputs.month, onChange: (e) => setBirthdayInputs((prev) => ({ ...prev, month: e.target.value })), children: [_jsx("option", { value: "", children: "Month" }), [...Array(12)].map((_, i) => (_jsx("option", { value: String(i + 1).padStart(2, "0"), children: new Date(2000, i, 1).toLocaleString("default", { month: "long" }) }, i)))] }), _jsxs("select", { className: "border rounded-md p-2 text-black text-sm", value: birthdayInputs.day, onChange: (e) => setBirthdayInputs((prev) => ({ ...prev, day: e.target.value })), children: [_jsx("option", { value: "", children: "Day" }), [...Array(31)].map((_, i) => (_jsx("option", { value: String(i + 1).padStart(2, "0"), children: i + 1 }, i)))] }), _jsxs("select", { className: "border rounded-md p-2 text-black text-sm", value: birthdayInputs.year, onChange: (e) => setBirthdayInputs((prev) => ({ ...prev, year: e.target.value })), children: [_jsx("option", { value: "", children: "Year" }), [...Array(100)].map((_, i) => {
                                                                const year = new Date().getFullYear() - i;
                                                                return _jsx("option", { value: year, children: year }, year);
                                                            })] })] })] }), _jsx("button", { type: "submit", className: "w-full sm:w-auto px-6 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition active:scale-95", children: "Save Changes" })] }))] }), _jsxs("div", { className: "bg-white rounded-lg shadow-md p-5 sm:p-8", children: [_jsx("h2", { className: "text-2xl sm:text-3xl font-bold text-primary-500 mb-5 md:mb-6", children: "Your Workouts" }), workouts.length === 0 ? (_jsx("p", { className: "text-gray-500", children: "No workouts logged yet." })) : (_jsx("div", { className: "space-y-3 md:space-y-4", children: workouts.map((workout) => (_jsxs("div", { className: "border-2 border-primary-300 rounded-lg p-4 sm:p-6 hover:bg-primary-50 transition-colors", children: [_jsxs("div", { className: "flex flex-wrap items-center gap-2 sm:gap-3 mb-2", children: [_jsx("span", { className: `px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${workout.type === "cardio"
                                                        ? "bg-accent-500 text-white"
                                                        : "bg-secondary-500 text-white"}`, children: workout.type.toUpperCase() }), _jsx("h3", { className: "text-lg sm:text-xl font-bold text-gray-800", children: workout.activity })] }), _jsx("p", { className: "text-gray-600 text-xs sm:text-sm", children: formatDate(workout.date) }), workout.duration && (_jsxs("p", { className: "text-gray-700 mt-1 sm:mt-2 text-sm", children: [_jsx("span", { className: "font-semibold", children: "Duration:" }), " ", workout.duration, " minutes"] }))] }, workout.id))) }))] })] })] }));
};
export default ProfilePage;
