import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { SelectedPage } from "@/shared/types";
import { motion } from "framer-motion";
import Class from "./Class";
import { useEffect, useState } from "react";
import { API_URL } from "@/lib/config";
import { TokenService } from "@/utils/auth";
const Leaderboard = ({ setSelectedPage }) => {
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(true);
        const token = TokenService.getAccessToken();
        fetch(`${API_URL}/api/leaderboard/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                ...(token && { Authorization: `Bearer ${token}` }),
            },
        })
            .then((res) => {
            if (!res.ok)
                throw new Error(`HTTP error! status: ${res.status}`);
            return res.json();
        })
            .then((data) => {
            if (data.leaderboard && Array.isArray(data.leaderboard)) {
                setLeaders(data.leaderboard.slice(0, 5));
            }
            else {
                setLeaders([]);
            }
        })
            .catch(() => setLeaders([]))
            .finally(() => setLoading(false));
    }, []);
    return (_jsx("section", { id: "leaderboard", className: "w-full bg-primary-100 py-16 md:py-20", children: _jsx("div", { className: "max-w-7xl mx-auto px-4", children: _jsxs(motion.div, { onViewportEnter: () => setSelectedPage(SelectedPage.Leaderboard), children: [_jsx(motion.div, { initial: "hidden", whileInView: "visible", viewport: { once: true, amount: 0.5 }, transition: { delay: 0.1, duration: 2 }, variants: {
                            hidden: { opacity: 0, x: 50 },
                            visible: { opacity: 1, x: 0 },
                        }, children: _jsxs("div", { className: "w-full flex flex-col items-center text-center", children: [_jsx("h1", { className: "font-montserrat text-2xl sm:text-3xl font-bold text-gray-900", children: "Weekly Leaderboard \uD83C\uDFC6" }), _jsx("p", { className: "py-4 md:py-5 text-gray-900 font-semibold text-sm sm:text-base", children: "The top 5 members with the most points this week!" }), _jsx("div", { className: "flex flex-wrap justify-center gap-2 sm:gap-3 mb-2", children: [
                                        { label: "🏃 Cardio", value: "100 pts + 1pt/min" },
                                        { label: "🏋️ Gym", value: "100 pts" },
                                        { label: "⚽ Sport", value: "50 pts" },
                                        { label: "📸 Photo verified", value: "+50 pts" },
                                        { label: "⌚ Wearable intensity", value: "bonus pts" },
                                    ].map(({ label, value }) => (_jsxs("div", { className: "flex items-center gap-1.5 bg-white/70 border border-primary-300 rounded-full px-3 py-1 text-xs font-medium text-gray-700 shadow-sm", children: [_jsx("span", { children: label }), _jsx("span", { className: "font-extrabold text-primary-500", children: value })] }, label))) })] }) }), _jsx("div", { className: "mt-6 md:mt-10", children: loading ? (_jsx("div", { className: "flex items-center justify-center py-16", children: _jsx("p", { className: "text-lg", children: "Loading leaderboard..." }) })) : leaders.length === 0 ? (_jsx("div", { className: "flex items-center justify-center py-16", children: _jsx("p", { className: "text-lg text-center", children: "No workouts logged this week yet. Be the first!" }) })) : (_jsxs(_Fragment, { children: [_jsx("div", { className: "grid grid-cols-2 gap-4 sm:hidden", children: leaders.map((user, index) => (_jsx(Class, { name: `#${index + 1} ${user.username}`, description: `${user.score} pts`, image: "", bio: user.bio, location: user.location, rank: index + 1 }, `${user.username}-${index}`))) }), _jsx("div", { className: "hidden sm:flex justify-center overflow-x-auto pb-2", children: _jsx("ul", { className: "inline-flex whitespace-nowrap gap-3", children: leaders.map((user, index) => (_jsx(Class, { name: `#${index + 1} ${user.username}`, description: `${user.score} pts`, image: "", bio: user.bio, location: user.location, rank: index + 1 }, `${user.username}-${index}`))) }) })] })) })] }) }) }));
};
export default Leaderboard;
