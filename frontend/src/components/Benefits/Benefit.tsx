import { SelectedPage } from "@/shared";
import type { JSX } from "react";
import AnchorLink from "react-anchor-link-smooth-scroll";
import {motion} from "framer-motion"
import { useNavigate } from "react-router-dom";


type Props = {
    icon: React.ReactNode;
    title: string;
    description: string;
    setSelectedPage: (value:SelectedPage) => void;
    linkTo?: SelectedPage | string;
}


const childVariant = {
    hidden: {opacity: 0, scale: 0.9 },
    visible: {opacity: 1, scale: 1 }
}

const Benefit = ({icon, title, description, setSelectedPage, linkTo}: Props) => {

    const navigate = useNavigate();
    
    const handleClick = () => {
        if (linkTo === "/connect" || linkTo === "/profile") {
            // It's a route, navigate to it
            navigate(linkTo);
        } else if (linkTo) {
            // It's a section on the page, use anchor link
            setSelectedPage(linkTo as SelectedPage);
        }
    };

    // Check if it's a route (starts with /) or a section
    const isRoute = typeof linkTo === 'string' && linkTo.startsWith('/');

    return (
        <motion.div 
        variants={childVariant}
        className = "mt-5 rounded-md border-2 border-gray-100 px-5 py-16 text-center flex-1 max-w-sm min-h-[350px] "> 
            <div className = "mb-4 flex justify-center">
                <div className="rounded-full border-2 border-gray-100 bg-primary-100 p-4">
                    {icon}
                </div>
            </div>
            <h4 className="font-bold"> {title}</h4>
            <p className="my-3"> {description} </p>
            <AnchorLink
                className="text-sm font-bold text-primary-500 underline"
                onClick={() => setSelectedPage(SelectedPage.ContactUs)}
                href={`#${SelectedPage.ContactUs}`}
            >
            <p>Learn More</p>
            </AnchorLink>
        
        
        </motion.div>
    )
}

export default Benefit
