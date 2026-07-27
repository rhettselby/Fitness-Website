import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
const Class = ({ name, description, bio, location }) => {
    const [expanded, setExpanded] = useState(false);
    const hasExtra = !!(bio || location);
    return (_jsxs("li", { className: "relative w-[160px] sm:w-[220px] md:w-[280px] flex-shrink-0", onClick: () => hasExtra && setExpanded((v) => !v), onMouseLeave: () => setExpanded(false), children: [_jsxs("div", { className: "flex flex-col items-center justify-center h-[160px] sm:h-[220px] md:h-[280px] w-full bg-gray-200 border-2 border-primary-300 rounded-lg shadow-lg", children: [_jsx("div", { className: "text-3xl md:text-4xl font-bold text-primary-500 mb-2", children: "\uD83C\uDFCB\uFE0F" }), _jsx("p", { className: "text-sm md:text-base font-bold text-gray-800 mb-2 px-3 text-center", children: name }), _jsx("p", { className: "text-xs md:text-sm text-gray-600 px-2 text-center", children: description }), hasExtra && (_jsx("p", { className: "mt-2 text-xs text-primary-400 md:hidden", children: "tap for info" }))] }), _jsxs("div", { className: `
          p-4 absolute top-0 left-0 z-30
          flex flex-col items-center justify-center
          h-[160px] sm:h-[220px] md:h-[280px] w-full
          whitespace-normal bg-primary-500 text-center text-white
          rounded-lg border-2 border-primary-300
          transition-opacity duration-300
          ${expanded ? "opacity-90" : "opacity-0"}
          md:hover:opacity-90
        `, children: [_jsx("p", { className: "text-base font-bold mb-1", children: name }), _jsx("p", { className: "mb-2 text-sm", children: description }), hasExtra && (_jsxs("div", { className: "mt-2 pt-2 border-t border-white/30 w-full", children: [bio && (_jsxs("p", { className: "text-xs mb-1 px-2", children: [_jsx("span", { className: "font-semibold", children: "Bio:" }), " ", bio] })), location && (_jsxs("p", { className: "text-xs px-2", children: [_jsx("span", { className: "font-semibold", children: "Location:" }), " ", location] }))] }))] })] }));
};
export default Class;
