import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { SelectedPage } from "@/shared/types";
import { LinkIcon, UserGroupIcon, ChartBarIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import { HText } from "@/shared/HText";
import Benefit from "./Benefit";
import ActionButton from "@/shared/ActionButton";
import ImSoccer from "@/assets/IMSOCCER.png";
const benefits = [
    {
        icon: _jsx(LinkIcon, { className: "h-6 w-6" }),
        title: "Connect your devices",
        description: "Pair your Whoop, Oura, or Strava using 'Connect'",
        linkTo: "/connect",
    },
    {
        icon: _jsx(ChartBarIcon, { className: "h-6 w-6" }),
        title: "Track each workout",
        description: "View all of your workouts and more under 'Profile'",
        linkTo: "/profile",
    },
    {
        icon: _jsx(UserGroupIcon, { className: "h-6 w-6" }),
        title: "Join the community",
        description: "Check out 'Leaderboard' for friendly competition",
        linkTo: SelectedPage.Leaderboard,
    },
];
const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.2 } },
};
const Benefits = ({ setSelectedPage }) => {
    return (_jsx("section", { id: "benefits", className: "hidden md:block w-full min-h-full py-16 md:py-20 bg-gray-20", children: _jsx("div", { className: "mx-auto w-5/6", children: _jsxs(motion.div, { onViewportEnter: () => setSelectedPage(SelectedPage.Home), children: [_jsxs(motion.div, { className: "md:my-5 md:w-3/5", initial: "hidden", whileInView: "visible", viewport: { once: true, amount: 0.5 }, transition: { duration: 2 }, variants: {
                            hidden: { opacity: 0, x: -50 },
                            visible: { opacity: 1, x: 0 },
                        }, children: [_jsx(HText, { children: "About" }), _jsx("p", { className: "my-4 md:my-5 text-sm text-white", children: "Why join the Fitness Community?" })] }), _jsx(motion.div, { className: "mt-5 grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8", initial: "hidden", whileInView: "visible", viewport: { once: true, amount: 0.3 }, variants: container, children: benefits.map((benefit) => (_jsx(Benefit, { icon: benefit.icon, title: benefit.title, description: benefit.description, setSelectedPage: setSelectedPage, linkTo: benefit.linkTo }, benefit.title))) }), _jsxs("div", { className: "mt-16 md:mt-28 md:flex md:items-center md:justify-between md:gap-20", children: [_jsx("div", { className: "flex justify-center md:basis-3/5", children: _jsx("img", { className: "w-full max-w-xs sm:max-w-sm md:max-w-md", alt: "benefits-page-graphic", src: ImSoccer, onError: (e) => {
                                        console.error("Failed to load ImSoccer");
                                        e.currentTarget.style.display = "none";
                                    } }) }), _jsxs("div", { className: "mt-10 md:mt-0 md:basis-2/5", children: [_jsx("div", { className: "relative", children: _jsx("div", { className: "before:absolute before:-top-20 before:-left-20 before:z-[-1] md:w-3/5", children: _jsx(motion.div, { initial: "hidden", whileInView: "visible", viewport: { once: true, amount: 0.5 }, transition: { duration: 2 }, variants: {
                                                    hidden: { opacity: 0, x: 50 },
                                                    visible: { opacity: 1, x: 0 },
                                                }, children: _jsxs(HText, { children: ["A strong community of members getting", " ", _jsx("span", { className: "text-primary-500", children: "Fit" })] }) }) }) }), _jsxs(motion.div, { initial: "hidden", whileInView: "visible", viewport: { once: true, amount: 0.5 }, transition: { duration: 2 }, variants: {
                                            hidden: { opacity: 0, x: -50 },
                                            visible: { opacity: 1, x: 0 },
                                        }, children: [_jsx("p", { className: "my-5 text-white" }), _jsx("p", { className: "mb-5 text-white" })] }), _jsx("div", { className: "relative mt-10 md:mt-16", children: _jsx("div", { className: "before:absolute before:-bottom-20 before:right-40 before:z-[-1]", children: _jsx(ActionButton, { setSelectedPage: setSelectedPage, children: "Join Now" }) }) })] })] })] }) }) }));
};
export default Benefits;
