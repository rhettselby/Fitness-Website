import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
const Class = ({ name, description, bio, location, rank }) => {
    const [expanded, setExpanded] = useState(false);
    const getEmoji = () => {
        if (rank === 1)
            return "🥇";
        if (rank === 2)
            return "🥈";
        if (rank === 3)
            return "🥉";
        return "🏋️";
    };
    const hasExtra = !!(bio || location);
    return (_jsxs("li", { className: "relative w-[160px] sm:w-[200px] md:w-[220px] flex-shrink-0", 
        // Toggle expanded on touch; close on mouse-leave for desktop
        onClick: () => hasExtra && setExpanded((v) => !v), onMouseLeave: () => setExpanded(false), children: [_jsxs("div", { className: "flex flex-col items-center justify-center h-[180px] sm:h-[200px] md:h-[220px] w-full bg-gray-200 border-2 border-primary-300 rounded-lg shadow-lg", children: [_jsx("div", { className: "text-3xl md:text-4xl font-bold text-primary-500 mb-2", children: getEmoji() }), _jsx("p", { className: "text-sm md:text-base font-bold text-gray-800 mb-1 px-3 text-center", children: name }), _jsx("p", { className: "text-sm md:text-base font-extrabold text-primary-500", children: description }), hasExtra && (_jsx("p", { className: "mt-2 text-xs text-primary-400 md:hidden", children: "tap for info" }))] }), _jsxs("div", { className: `
          p-4 absolute top-0 left-0 z-30
          flex flex-col items-center justify-center
          h-[180px] sm:h-[200px] md:h-[220px] w-full
          whitespace-normal bg-primary-500 text-center text-white
          rounded-lg border-2 border-primary-300
          transition-opacity duration-300
          ${expanded ? "opacity-90" : "opacity-0"}
          md:hover:opacity-90
        `, children: [_jsx("p", { className: "text-base font-bold mb-1", children: name }), _jsx("p", { className: "mb-2 text-sm", children: description }), hasExtra && (_jsxs("div", { className: "mt-2 pt-2 border-t border-white/30 w-full", children: [bio && (_jsxs("p", { className: "text-xs mb-1 px-2", children: [_jsx("span", { className: "font-semibold", children: "Bio:" }), " ", bio] })), location && (_jsxs("p", { className: "text-xs px-2", children: [_jsx("span", { className: "font-semibold", children: "Location:" }), " ", location] }))] }))] })] }));
};
export default Class;
