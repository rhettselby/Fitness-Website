import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { SelectedPage } from "@/shared/types";
import { HomeModernIcon, UserGroupIcon, AcademicCapIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import { HText } from "@/shared/HText";
import Benefit from "./Benefit";
import ActionButton from "@/shared/ActionButton";
import BenefitsPageGraphic from "@/assets/BenefitsPageGraphic.png";
const benefits = [
    { icon: _jsx(HomeModernIcon, { className: "h-6 w-6" }),
        title: "State of the Art Facilities",
        description: "We got some awesome facilities", },
    { icon: _jsx(UserGroupIcon, { className: "h-6 w-6" }),
        title: "Many diverse classes offered",
        description: "We got some awesome classes", },
    { icon: _jsx(AcademicCapIcon, { className: "h-6 w-6" }),
        title: "Expert and Pro Trainers",
        description: "We got some awesome trainers", },
];
const container = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.2 }
    }
};
const Benefits = ({ setSelectedPage }) => {
    return _jsx("section", { id: "benefits", className: "mx-auto min-h-full w-5/6 py-20", children: _jsxs(motion.div, { onViewportEnter: () => setSelectedPage(SelectedPage.Home), children: [_jsxs(motion.div, { className: "md:my-5 md:w-3/5", initial: "hidden", whileInView: "visible", viewport: { once: true, amount: 0.5 }, transition: { duration: 2 }, variants: {
                        hidden: { opacity: 0, x: -50 },
                        visible: { opacity: 1, x: 0 },
                    }, children: [_jsx(HText, { children: "About" }), _jsx("p", { className: "my-5 text-sm", children: "Why join the Fitness Community?" })] }), _jsx(motion.div, { className: "mt-5 md:flex items-center justify-between gap-8", initial: "hidden", whileInView: "visible", viewport: { once: true, amount: 0.5 }, variants: container, children: benefits.map((benefit) => (_jsx(Benefit, { icon: benefit.icon, title: benefit.title, description: benefit.description, setSelectedPage: setSelectedPage }, benefit.title))) }), _jsxs("div", { className: "mt-16 items-center justify-between gap-20 md:mt-28 md:flex", children: [_jsx("div", { className: "flex justify-center md:basis-3/5", children: _jsx("img", { className: "w-full max-w-md", alt: "benefits-page-graphic", src: BenefitsPageGraphic, onError: (e) => {
                                    console.error("Failed to load BenefitsPageGraphic:", BenefitsPageGraphic);
                                    e.currentTarget.style.display = 'none';
                                } }) }), _jsxs("div", { className: "md:basis-2/5", children: [_jsx("div", { className: "relative", children: _jsx("div", { className: "before:absolute before:-top-20 before:-left-20 before:z-[-1] before:content-abstractwaves md:w-3/5", children: _jsx(motion.div, { initial: "hidden", whileInView: "visible", viewport: { once: true, amount: 0.5 }, transition: { duration: 2 }, variants: {
                                                hidden: { opacity: 0, x: 50 },
                                                visible: { opacity: 1, x: 0 }
                                            }, children: _jsxs(HText, { children: ["A strong community of members getting ", " ", _jsx("span", { className: "text-primary-500", children: "Fit" })] }) }) }) }), _jsxs(motion.div, { initial: "hidden", whileInView: "visible", viewport: { once: true, amount: 0.5 }, transition: { duration: 2 }, variants: {
                                        hidden: { opacity: 0, x: -50 },
                                        visible: { opacity: 1, x: 0 },
                                    }, children: [_jsx("p", { className: "my-5", children: "Fill this with something useful" }), _jsx("p", { className: "mb-5", children: "Fill this with something useful" })] }), _jsx("div", { className: "relative mt-16", children: _jsx("div", { className: "before:absolute before:-bottom-20 before:right-40 before:z-[-1] before:content-sparkles", children: _jsx(ActionButton, { setSelectedPage: setSelectedPage, children: "Join Now" }) }) })] })] })] }) });
};
export default Benefits;
