import { jsx as _jsx } from "react/jsx-runtime";
import AnchorLink from "react-anchor-link-smooth-scroll";
import { useNavigate, useLocation } from "react-router-dom";
const Link = ({ page, selectedPage, setSelectedPage }) => {
    const lowerCasePage = page.toLowerCase().replace(/ /g, ""); //converts to lowercase, removes spaces, treated as SelectedPage enum
    const navigate = useNavigate();
    const location = useLocation();
    const isHomePage = location.pathname === "/";
    const handleClick = (e) => {
        setSelectedPage(lowerCasePage);
        // If we're not on the home page, navigate to home with hash, then scroll
        if (!isHomePage) {
            e.preventDefault();
            navigate(`/#${lowerCasePage}`);
            // Scroll after navigation completes
            setTimeout(() => {
                const element = document.getElementById(lowerCasePage);
                if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                }
            }, 100);
        }
    };
    // If on home page, use AnchorLink for smooth scrolling
    if (isHomePage) {
        return (_jsx(AnchorLink, { className: `${selectedPage === lowerCasePage ? "text-primary-500" : ""} transition duration-500 hover:text-primary-300`, href: `#${lowerCasePage}`, onClick: () => setSelectedPage(lowerCasePage), children: page }));
    }
    // If on other pages, use a button that navigates to home page
    return (_jsx("button", { className: `${selectedPage === lowerCasePage ? "text-primary-500" : ""} transition duration-500 hover:text-primary-300 cursor-pointer`, onClick: handleClick, children: page }));
};
export default Link;
