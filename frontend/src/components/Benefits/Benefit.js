import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { SelectedPage } from "@/shared";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { TokenService } from "@/utils/auth";
const childVariant = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 }
};
const Benefit = ({ icon, title, description, setSelectedPage, linkTo }) => {
    const navigate = useNavigate();
    const isAuthenticated = !!TokenService.getAccessToken();
    // TEMPORARY TEST - hardcode linkTo based on title
    const actualLinkTo = title === "Connect your devices" ? "/connect"
        : title === "Track each workout" ? "/profile"
            : title === "Join the community" ? SelectedPage.Leaderboard
                : linkTo;
    const handleClick = (e) => {
        e.preventDefault();
        console.log("Link clicked - actualLinkTo:", actualLinkTo, "isAuthenticated:", isAuthenticated);
        // If not authenticated and trying to go to Connect/Profile, go to Contact Us instead
        if (!isAuthenticated && (actualLinkTo === "/connect" || actualLinkTo === "/profile")) {
            setSelectedPage(SelectedPage.ContactUs);
            const element = document.getElementById("contactus");
            if (element) {
                element.scrollIntoView({ behavior: "smooth" });
            }
            return;
        }
        // Otherwise, proceed with normal navigation
        if (actualLinkTo === "/connect") {
            navigate("/connect");
        }
        else if (actualLinkTo === "/profile") {
            navigate("/profile");
        }
        else if (actualLinkTo === SelectedPage.Leaderboard) {
            setSelectedPage(SelectedPage.Leaderboard);
            const element = document.getElementById("leaderboard");
            if (element) {
                element.scrollIntoView({ behavior: "smooth" });
            }
        }
    };
    return (_jsxs(motion.div, { variants: childVariant, className: "mt-5 rounded-md border-2 border-gray-100 px-5 py-16 text-center flex-1 max-w-sm min-h-[350px]", children: [_jsx("div", { className: "mb-4 flex justify-center", children: _jsx("div", { className: "rounded-full border-2 border-gray-100 bg-primary-100 p-4", children: icon }) }), _jsx("h4", { className: "font-bold", children: title }), _jsx("p", { className: "my-3", children: description }), _jsx("button", { className: "text-sm font-bold text-primary-500 underline hover:text-primary-300 cursor-pointer bg-transparent border-none", onClick: handleClick, children: "Learn More" })] }));
};
export default Benefit;
