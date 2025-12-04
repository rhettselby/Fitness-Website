import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import useMediaQuery from "@/hooks/useMediaQuery";
import ActionButton from "@/shared/ActionButton";
import { SelectedPage } from "@/shared/types";
import HomePageText from "@/assets/HomePageText.png";
import HomePageGraphic from "@/assets/HomePageGraphic.png";
import SponsorRedBull from "@/assets/SponsorRedBull.png";
import SponsorForbes from "@/assets/SponsorForbes.png";
import SponsorFortune from "@/assets/SponsorFortune.png";
import AnchorLink from "react-anchor-link-smooth-scroll";
import { motion } from "framer-motion";
const Home = ({ setSelectedPage }) => {
    const isAboveMediumScreen = useMediaQuery("(min-width:1060px)");
    return (_jsxs("section", { id: "home", className: "gap-16 bg-gray-20 py-10 md:h-full md:pb-0", children: [_jsxs(motion.div, { className: "md:flex mx-auto w-5/6 items-center justify-center md:h-5/6", onViewportEnter: () => setSelectedPage(SelectedPage.Home), children: [_jsxs("div", { className: "z-10 mt-32 md:basis-3/5", children: [_jsxs(motion.div, { className: "md:-mt-20", initial: "hidden", whileInView: "visible", viewport: { once: true, amount: 0.5 }, transition: { duration: 2 }, variants: {
                                    hidden: { opacity: 0, x: -50 },
                                    visible: { opacity: 1, x: 0 },
                                }, children: [_jsx("div", { className: "relative", children: _jsx("div", { className: "before:absolute before:-top-20 before:-left-20 before:z-[-1] md:before:content-evolvetext", children: _jsx("img", { alt: "home-page-text", src: HomePageText, className: "w-full max-w-md", onError: (e) => {
                                                    console.error("Failed to load HomePageText:", HomePageText);
                                                    e.currentTarget.style.display = 'none';
                                                } }) }) }), _jsx("p", { className: "mt-8 text-sm", children: "Welcome to Rhett's Fitness Community. Log your workouts every day!" })] }), _jsxs(motion.div, { className: "mt-8 flex items-center gap-8", initial: "hidden", whileInView: "visible", viewport: { once: true, amount: 0.5 }, transition: { delay: 0.1, duration: 2 }, variants: {
                                    hidden: { opacity: 0, x: -50 },
                                    visible: { opacity: 1, x: 0 },
                                }, children: [_jsx(ActionButton, { setSelectedPage: setSelectedPage, children: "Join Now" }), _jsx(AnchorLink, { className: "text-sm font-bold text-primary-500 underline", onClick: () => setSelectedPage(SelectedPage.ContactUs), href: `#${SelectedPage.ContactUs}`, children: _jsx("p", { children: "Learn More" }) })] })] }), _jsx("div", { className: "flex basis-3/5 justify-center md:z-10 md:ml-40 md:mt-16 md:justify-items-end w-2/3 h-2/3", children: _jsx("img", { alt: "home-page-graphic", src: HomePageGraphic, className: "w-full max-w-md", onError: (e) => {
                                console.error("Failed to load HomePageGraphic:", HomePageGraphic);
                                e.currentTarget.style.display = 'none';
                            } }) })] }), isAboveMediumScreen && (_jsx("div", { className: "h-[150px] w-full bg-primary-100 py-10", children: _jsx("div", { className: "mx-auto w-5/6", children: _jsxs("div", { className: "flex w-3/5 items-center justify-between gap-8", children: [_jsx("img", { alt: "redbull-sponsor", src: SponsorRedBull, className: "h-12 w-auto object-contain", onError: (e) => {
                                    console.error("Failed to load SponsorRedBull:", SponsorRedBull);
                                    e.currentTarget.style.display = 'none';
                                } }), _jsx("img", { alt: "forbes-sponsor", src: SponsorForbes, className: "h-12 w-auto object-contain", onError: (e) => {
                                    console.error("Failed to load SponsorForbes:", SponsorForbes);
                                    e.currentTarget.style.display = 'none';
                                } }), _jsx("img", { alt: "fortune-sponsor", src: SponsorFortune, className: "h-12 w-auto object-contain", onError: (e) => {
                                    console.error("Failed to load SponsorFortune:", SponsorFortune);
                                    e.currentTarget.style.display = 'none';
                                } })] }) }) }))] }));
};
export default Home;
