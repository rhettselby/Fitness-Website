import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import Navbar from "@/components/navbar";
import Home from "@/components/Home";
import { SelectedPage } from "@/shared/types";
import Benefits from "@/components/Benefits";
import Leaderboard from "@/components/Leaderboard";
import ContactUs from "@/components/ContactUs";
import Footer from "@/components/footer";
import "@/app/App.css";
const HomePage = () => {
    const [selectedPage, setSelectedPage] = useState(SelectedPage.Home);
    const [isTopOfPage, setIsTopOfPage] = useState(true);
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY === 0) {
                setIsTopOfPage(true);
                setSelectedPage(SelectedPage.Home);
            }
            else {
                setIsTopOfPage(false);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);
    // Handle hash navigation when coming from other pages
    useEffect(() => {
        const hash = window.location.hash.slice(1); // Remove the # symbol
        if (hash) {
            // Wait for page to render, then scroll to section
            setTimeout(() => {
                const element = document.getElementById(hash);
                if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                    const hashAsSelectedPage = hash;
                    if (Object.values(SelectedPage).includes(hashAsSelectedPage)) {
                        setSelectedPage(hashAsSelectedPage);
                    }
                }
            }, 100);
        }
    }, []);
    return (_jsxs("div", { className: "app bg-gray-50", children: [_jsx(Navbar, { isTopOfPage: isTopOfPage, selectedPage: selectedPage, setSelectedPage: setSelectedPage }), _jsx(Home, { setSelectedPage: setSelectedPage }), _jsx(Benefits, { setSelectedPage: setSelectedPage }), _jsx(Leaderboard, { setSelectedPage: setSelectedPage }), _jsx(ContactUs, { setSelectedPage: setSelectedPage }), _jsx(Footer, {})] }));
};
export default HomePage;
