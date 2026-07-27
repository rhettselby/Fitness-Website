import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "@/lib/config";
import { TokenService } from "@/utils/auth";
import { motion, AnimatePresence } from "framer-motion";
const Groups = () => {
    const navigate = useNavigate();
    const [groups, setGroups] = useState([]);
    const [loadingGroups, setLoadingGroups] = useState(true);
    const [joinId, setJoinId] = useState("");
    const [joinError, setJoinError] = useState("");
    const [joinLoading, setJoinLoading] = useState(false);
    const [joinOpen, setJoinOpen] = useState(false);
    const [createName, setCreateName] = useState("");
    const [createMotto, setCreateMotto] = useState("");
    const [createError, setCreateError] = useState("");
    const [createLoading, setCreateLoading] = useState(false);
    const [createOpen, setCreateOpen] = useState(false);
    const joinInputRef = useRef(null);
    const createInputRef = useRef(null);
    useEffect(() => {
        const token = TokenService.getAccessToken();
        if (!token) {
            navigate("/");
            return;
        }
        fetchGroups();
    }, []);
    useEffect(() => {
        if (joinOpen)
            setTimeout(() => joinInputRef.current?.focus(), 300);
    }, [joinOpen]);
    useEffect(() => {
        if (createOpen)
            setTimeout(() => createInputRef.current?.focus(), 300);
    }, [createOpen]);
    const fetchGroups = async () => {
        setLoadingGroups(true);
        const token = TokenService.getAccessToken();
        try {
            const res = await fetch(`${API_URL}/groups/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok)
                throw new Error();
            const data = await res.json();
            setGroups(data.groups || []);
        }
        catch {
            setGroups([]);
        }
        finally {
            setLoadingGroups(false);
        }
    };
    const handleJoin = async () => {
        setJoinError("");
        const id = parseInt(joinId);
        if (!joinId || isNaN(id)) {
            setJoinError("Please enter a valid group ID.");
            return;
        }
        setJoinLoading(true);
        const token = TokenService.getAccessToken();
        try {
            const res = await fetch(`${API_URL}/groups/join_group/${id}/`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (!res.ok) {
                setJoinError(data.error || "Failed to join group.");
                return;
            }
            setJoinId("");
            setJoinOpen(false);
            await fetchGroups();
        }
        catch {
            setJoinError("Something went wrong. Please try again.");
        }
        finally {
            setJoinLoading(false);
        }
    };
    const handleCreate = async () => {
        setCreateError("");
        if (!createName.trim()) {
            setCreateError("Please enter a group name.");
            return;
        }
        setCreateLoading(true);
        const token = TokenService.getAccessToken();
        try {
            const res = await fetch(`${API_URL}/groups/create_group/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: createName.trim(),
                    motto: createMotto.trim() || null,
                }),
            });
            const data = await res.json();
            if (!res.ok) {
                setCreateError(data.error || "Failed to create group.");
                return;
            }
            setCreateName("");
            setCreateMotto("");
            setCreateOpen(false);
            await fetchGroups();
        }
        catch {
            setCreateError("Something went wrong. Please try again.");
        }
        finally {
            setCreateLoading(false);
        }
    };
    const handleKeyDown = (e, action) => {
        if (e.key === "Enter")
            action();
    };
    return (_jsxs("section", { className: "w-full bg-primary-100 min-h-screen py-20 px-4", children: [_jsx("button", { onClick: () => navigate("/"), className: "flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-primary-500 transition mb-8", children: "\u2190 Back to Home" }), _jsxs("div", { className: "max-w-3xl mx-auto", children: [_jsxs(motion.div, { initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, className: "text-center mb-10", children: [_jsx("h1", { className: "font-montserrat text-3xl sm:text-4xl font-bold text-gray-900", children: "Groups \uD83C\uDFC5" }), _jsx("p", { className: "mt-2 text-gray-600 font-medium text-sm sm:text-base", children: "Compete with friends and see who tops the leaderboard." })] }), _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay: 0.1 }, className: "bg-white border-2 border-gray-200 rounded-2xl p-5 sm:p-7 mb-6 shadow-sm", children: [_jsxs("div", { className: "flex items-center justify-between mb-5", children: [_jsx("h2", { className: "text-2xl sm:text-3xl font-bold text-primary-500", children: "Your Groups" }), _jsxs("span", { className: "text-xs font-semibold text-gray-400 uppercase tracking-widest", children: [groups.length, " ", groups.length === 1 ? "group" : "groups"] })] }), loadingGroups ? (_jsx("div", { className: "flex flex-col gap-3", children: [1, 2, 3].map((i) => (_jsx("div", { className: "h-16 rounded-xl bg-gray-100 animate-pulse", style: { opacity: 1 - i * 0.2 } }, i))) })) : groups.length === 0 ? (_jsxs("div", { className: "text-center py-10", children: [_jsx("p", { className: "text-4xl mb-3", children: "\uD83C\uDFC3" }), _jsx("p", { className: "text-gray-500 text-sm font-medium", children: "You haven't joined any groups yet." }), _jsx("p", { className: "text-gray-400 text-xs mt-1", children: "Join or create one below to get started!" })] })) : (_jsx("div", { className: "flex flex-col gap-3", children: groups.map((group, index) => (_jsxs(motion.div, { initial: { opacity: 0, x: -15 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.35, delay: index * 0.07 }, whileHover: { scale: 1.015, x: 4 }, className: "relative flex items-center justify-between border-2 border-yellow-300 bg-yellow-50 rounded-xl px-5 py-4 cursor-pointer transition-all group shadow-sm hover:shadow-md hover:border-yellow-400", onClick: () => navigate(`/groups/${group.id}/leaderboard`, {
                                        state: { groupName: group.name },
                                    }), children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("p", { className: "font-bold text-gray-900 text-lg sm:text-xl", children: group.name }), group.motto && (_jsx("p", { className: "text-sm sm:text-base text-gray-400 font-normal", children: group.motto }))] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("span", { className: "text-xs text-gray-400 font-medium", children: ["ID: ", group.id] }), _jsx("span", { className: "text-sm font-bold text-primary-500 opacity-0 group-hover:opacity-100 transition-opacity", children: "View \u2192" })] })] }, group.id))) }))] }), _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay: 0.2 }, className: "grid grid-cols-2 gap-3 mb-3", children: [_jsx("button", { onClick: () => {
                                    setJoinOpen((v) => !v);
                                    setCreateOpen(false);
                                    setJoinError("");
                                }, className: `relative overflow-hidden rounded-xl px-4 py-3 font-semibold text-sm transition-all duration-300 border-2 group
              ${joinOpen
                                    ? "bg-secondary-500 text-white border-secondary-500 shadow-lg shadow-secondary-200"
                                    : "bg-white text-secondary-600 border-secondary-300 hover:bg-secondary-50 hover:border-secondary-400"}`, children: _jsxs("span", { className: "flex items-center justify-center gap-2", children: [_jsx("span", { className: `transition-transform duration-300 ${joinOpen ? "rotate-45" : ""}`, children: "\uFF0B" }), "Join a Group"] }) }), _jsx("button", { onClick: () => {
                                    setCreateOpen((v) => !v);
                                    setJoinOpen(false);
                                    setCreateError("");
                                }, className: `relative overflow-hidden rounded-xl px-4 py-3 font-semibold text-sm transition-all duration-300 border-2 group
              ${createOpen
                                    ? "bg-primary-500 text-white border-primary-500 shadow-lg shadow-primary-200"
                                    : "bg-white text-primary-600 border-primary-300 hover:bg-primary-50 hover:border-primary-400"}`, children: _jsxs("span", { className: "flex items-center justify-center gap-2", children: [_jsx("span", { className: `transition-transform duration-300 ${createOpen ? "rotate-45" : ""}`, children: "\u2726" }), "Create a Group"] }) })] }), _jsx(AnimatePresence, { children: joinOpen && (_jsx(motion.div, { initial: { opacity: 0, height: 0, marginBottom: 0 }, animate: { opacity: 1, height: "auto", marginBottom: 12 }, exit: { opacity: 0, height: 0, marginBottom: 0 }, transition: { duration: 0.3, ease: "easeInOut" }, className: "overflow-hidden", children: _jsxs("div", { className: "bg-white border-2 border-secondary-300 rounded-xl p-5 shadow-sm", children: [_jsx("p", { className: "text-gray-500 text-xs font-medium mb-3 uppercase tracking-widest", children: "Enter a group ID to join" }), _jsxs("div", { className: "flex gap-2", children: [_jsx("input", { ref: joinInputRef, type: "number", placeholder: "Group ID", value: joinId, onChange: (e) => setJoinId(e.target.value), onKeyDown: (e) => handleKeyDown(e, handleJoin), className: "flex-1 border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-secondary-400 text-gray-900 placeholder-gray-400" }), _jsx("button", { onClick: handleJoin, disabled: joinLoading, className: "px-5 py-2.5 bg-secondary-500 text-white rounded-lg hover:bg-secondary-600 font-semibold disabled:bg-gray-300 transition-all active:scale-95 text-sm whitespace-nowrap", children: joinLoading ? "Joining…" : "Join →" })] }), joinError && (_jsx(motion.p, { initial: { opacity: 0 }, animate: { opacity: 1 }, className: "text-red-500 text-xs mt-2", children: joinError }))] }) }, "join-panel")) }), _jsx(AnimatePresence, { children: createOpen && (_jsx(motion.div, { initial: { opacity: 0, height: 0, marginBottom: 0 }, animate: { opacity: 1, height: "auto", marginBottom: 12 }, exit: { opacity: 0, height: 0, marginBottom: 0 }, transition: { duration: 0.3, ease: "easeInOut" }, className: "overflow-hidden", children: _jsxs("div", { className: "bg-white border-2 border-primary-300 rounded-xl p-5 shadow-sm", children: [_jsx("p", { className: "text-gray-500 text-xs font-medium mb-3 uppercase tracking-widest", children: "Name your new group" }), _jsxs("div", { className: "flex flex-col gap-2", children: [_jsxs("div", { className: "flex gap-2", children: [_jsx("input", { ref: createInputRef, type: "text", placeholder: "Group name", value: createName, onChange: (e) => setCreateName(e.target.value), onKeyDown: (e) => handleKeyDown(e, handleCreate), className: "flex-1 border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary-400 text-gray-900 placeholder-gray-400" }), _jsx("button", { onClick: handleCreate, disabled: createLoading, className: "px-5 py-2.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 font-semibold disabled:bg-gray-300 transition-all active:scale-95 text-sm whitespace-nowrap", children: createLoading ? "Creating…" : "Create →" })] }), _jsx("input", { type: "text", placeholder: "Group motto (optional)", value: createMotto, onChange: (e) => setCreateMotto(e.target.value), onKeyDown: (e) => handleKeyDown(e, handleCreate), className: "w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary-400 text-gray-900 placeholder-gray-400" })] }), createError && (_jsx(motion.p, { initial: { opacity: 0 }, animate: { opacity: 1 }, className: "text-red-500 text-xs mt-2", children: createError }))] }) }, "create-panel")) })] })] }));
};
export default Groups;
