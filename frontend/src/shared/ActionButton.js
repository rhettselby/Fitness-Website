import { jsx as _jsx } from "react/jsx-runtime";
import AnchorLink from "react-anchor-link-smooth-scroll";
import { SelectedPage } from "./types";
const ActionButton = ({ children, setSelectedPage }) => {
    return (_jsx(AnchorLink, { className: "rounded-md bg-secondary-500 px-10 py-2 hover:bg-primary-500 hover:text-white", onClick: () => setSelectedPage(SelectedPage.ContactUs), href: `#${SelectedPage.ContactUs}`, children: children }));
};
export default ActionButton;
