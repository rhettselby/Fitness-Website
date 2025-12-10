import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { SelectedPage } from "@/shared/types";
import HText from "@/shared/HText";
import { motion } from "framer-motion";
import Class from "./Class";
import { useEffect, useState } from "react";
const Leaderboard = ({ setSelectedPage }) => {
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(true);
        fetch(`${API_URL}/api/leaderboard/`, {
            credentials: "include",
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => {
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
        })
            .then((data) => {
            console.log("Leaderboard data received:", data); // Debug log
            if (data.leaderboard && Array.isArray(data.leaderboard)) {
                console.log("Leaderboard items:", data.leaderboard); // Debug log
                const sortedLeaders = data.leaderboard.slice(0, 5);
                console.log("Top 5 leaders:", sortedLeaders); // Debug log
                setLeaders(sortedLeaders);
            }
            else {
                console.error("Unexpected data format:", data);
                setLeaders([]);
            }
        })
            .catch((error) => {
            console.error("Error fetching leaderboard:", error);
            setLeaders([]);
        })
            .finally(() => {
            setLoading(false);
        });
    }, []);
    return (_jsx("section", { id: "leaderboard", className: "w-full bg-primary-100 py-40", children: _jsx("div", { className: "max-w-4xl mx-auto px-4", children: _jsxs(motion.div, { onViewportEnter: () => setSelectedPage(SelectedPage.Leaderboard), children: [_jsx(motion.div, { initial: "hidden", whileInView: "visible", viewport: { once: true, amount: 0.5 }, transition: { delay: 0.1, duration: 2 }, variants: {
                            hidden: { opacity: 0, x: -50 },
                            visible: { opacity: 1, x: 0 },
                        }, children: _jsxs("div", { className: "md:w-3/5", children: [_jsx(HText, { children: "Weekly Leaderboard \uD83C\uDFC6" }), _jsx("p", { className: "py-5", children: "The top 5 members with the most workouts this week!" })] }) }), _jsx("div", { className: "mt-10 h-[320] overflow-x-auto overflow-y-hidden", children: _jsx("div", { className: "flex justify-center", children: loading ? (_jsx("div", { className: "flex items-center justify-center h-full", children: _jsx("p", { className: "text-lg", children: "Loading leaderboard..." }) })) : leaders.length === 0 ? (_jsx("div", { className: "flex items-center justify-center h-full", children: _jsx("p", { className: "text-lg", children: "No workouts logged this week yet. Be the first!" }) })) : (_jsx("ul", { className: "inline-flex whitespace-nowrap gap-3", children: leaders.map((user, index) => (_jsx(Class, { name: `#${index + 1} ${user.username}`, description: `${user.count} workout${user.count !== 1 ? 's' : ''}`, image: "", bio: user.bio, location: user.location }, `${user.username}-${index}`))) })) }) })] }) }) }));
};
export default Leaderboard;
