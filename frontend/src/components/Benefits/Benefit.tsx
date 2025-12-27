import { SelectedPage } from "@/shared";
import {motion} from "framer-motion"
import { useNavigate } from "react-router-dom";
import { TokenService } from "@/utils/auth";

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
    const isAuthenticated = !!TokenService.getAccessToken();
    
    // TEMPORARY TEST - hardcode linkTo based on title
    const actualLinkTo = title === "Connect your devices" ? "/connect" 
                       : title === "Track each workout" ? "/profile"
                       : title === "Join the community" ? SelectedPage.Leaderboard
                       : linkTo;
    
    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        console.log("Link clicked - actualLinkTo:", actualLinkTo, "isAuthenticated:", isAuthenticated);
        
        // If not authenticated and trying to go to Connect/Profile, go to Contact Us instead
        if (!isAuthenticated && (actualLinkTo === "/connect" || actualLinkTo === "/profile")) {
            setSelectedPage(SelectedPage.ContactUs);
            const element = document.getElementById("contactus");
            if (element) {
                element.scrollIntoView({ behavior: "smooth" });
            }
            return;
        }
        
        // Otherwise, proceed with normal navigation
        if (actualLinkTo === "/connect") {
            navigate("/connect");
        } else if (actualLinkTo === "/profile") {
            navigate("/profile");
        } else if (actualLinkTo === SelectedPage.Leaderboard) {
            setSelectedPage(SelectedPage.Leaderboard);
            const element = document.getElementById("leaderboard");
            if (element) {
                element.scrollIntoView({ behavior: "smooth" });
            }
        }
    };

    return (
        <motion.div 
            variants={childVariant}
            className="mt-5 rounded-md border-2 border-gray-100 px-5 py-16 text-center flex-1 max-w-sm min-h-[350px]"
        > 
            <div className="mb-4 flex justify-center">
                <div className="rounded-full border-2 border-gray-100 bg-primary-100 p-4">
                    {icon}
                </div>
            </div>
            <h4 className="font-bold">{title}</h4>
            <p className="my-3">{description}</p>
            
            <button
                className="text-sm font-bold text-primary-500 underline hover:text-primary-300 cursor-pointer bg-transparent border-none"
                onClick={handleClick}
            >
                Learn More
            </button>
        </motion.div>
    )
}

export default Benefit