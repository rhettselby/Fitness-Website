import { SelectedPage } from "@/shared";
import type { JSX } from "react";
import AnchorLink from "react-anchor-link-smooth-scroll";
import {motion} from "framer-motion"

type Props = {
    icon: React.ReactNode;
    title: string;
    description: string;
    setSelectedPage: (value:SelectedPage) => void;
}

const childVariant = {
    hidden: {opacity: 0, scale: 0.9 },
    visible: {opacity: 1, scale: 1 }
}

const Benefit = ({icon, title, description, setSelectedPage}: Props) => {
    return (
        <motion.div 
        variants={childVariant}
        className = "mt-5 rounded-md border-2 border-gray-100 bg-gray-50 px-5 py-16 text-center"> 
            <div className = "mb-4 flex justify-center">
                <div className="rounded-full border-2 border-primary-500 bg-primary-500 p-4">
                    {icon}
                </div>
            </div>
            <h4 className="font-bold text-white"> {title}</h4>
            <p className="my-3 text-gray-100"> {description} </p>
            <AnchorLink
                className="text-sm font-bold text-accent-500 underline hover:text-accent-400"
                onClick={() => setSelectedPage(SelectedPage.ContactUs)}
                href={`#${SelectedPage.ContactUs}`}
            >
            <p>Learn More</p>
            </AnchorLink>
        
        
        </motion.div>
    )
}

export default Benefit