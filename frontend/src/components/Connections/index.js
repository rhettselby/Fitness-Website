import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import Navbar from "@/components/navbar";
import { SelectedPage } from "@/shared/types";
import WearablesSettings from "@/components/WearablesSettings/WearablesSettings";
const ConnectionsPage = () => {
    const [selectedPage, setSelectedPage] = useState(SelectedPage.Connect);
    return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx(Navbar, { isTopOfPage: false, selectedPage: selectedPage, setSelectedPage: setSelectedPage }), _jsx("div", { className: "pt-20 pb-12 md:pt-24 md:pb-16", children: _jsxs("div", { className: "max-w-4xl mx-auto px-4 sm:px-6", children: [_jsx("h1", { className: "text-3xl md:text-4xl font-bold text-primary-500 mb-6 md:mb-8", children: "Connect Your Devices" }), _jsx(WearablesSettings, {})] }) })] }));
};
export default ConnectionsPage;
