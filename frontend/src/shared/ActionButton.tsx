import React from "react";
import AnchorLink from "react-anchor-link-smooth-scroll"
import { SelectedPage } from "./types";

type Props = {
    children: React.ReactNode;
    setSelectedPage:(value:SelectedPage)=>void
}

const ActionButton = ({ children, setSelectedPage }: Props) => {
    return (
        <AnchorLink
            className="rounded-md bg-accent-500 text-gray-900 px-10 py-2 hover:bg-accent-600 hover:text-white font-bold transition duration-300"
            onClick={() => setSelectedPage(SelectedPage.ContactUs)}
            href = {`#${SelectedPage.ContactUs}`}
        >
            {children}
        </AnchorLink>
    )
}

export default ActionButton