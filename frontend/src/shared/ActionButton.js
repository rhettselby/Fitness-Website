import { jsx as _jsx } from "react/jsx-runtime";
import AnchorLink from "react-anchor-link-smooth-scroll";
import { SelectedPage } from "./types";
const ActionButton = ({ children, setSelectedPage }) => {
    return (_jsx(AnchorLink, { className: "rounded-md bg-accent-500 text-gray-900 px-10 py-2 hover:bg-accent-600 hover:text-white font-bold transition duration-300", onClick: () => setSelectedPage(SelectedPage.ContactUs), href: `#${SelectedPage.ContactUs}`, children: children }));
};
export default ActionButton;
