import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { SelectedPage } from "@/shared";
import AnchorLink from "react-anchor-link-smooth-scroll";
import { motion } from "framer-motion";
const childVariant = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 }
};
const Benefit = ({ icon, title, description, setSelectedPage }) => {
    return (_jsxs(motion.div, { variants: childVariant, className: "mt-5 rounded-md border-2 border-gray-100 px-5 py-16 text-center", children: [_jsx("div", { className: "mb-4 flex justify-center", children: _jsx("div", { className: "rounded-full border-2 border-gray-100 bg-primary-100 p-4", children: icon }) }), _jsxs("h4", { className: "font-bold", children: [" ", title] }), _jsxs("p", { className: "my-3", children: [" ", description, " "] }), _jsx(AnchorLink, { className: "text-sm font-bold text-primary-500 underline", onClick: () => setSelectedPage(SelectedPage.ContactUs), href: `#${SelectedPage.ContactUs}`, children: _jsx("p", { children: "Learn More" }) })] }));
};
export default Benefit;
