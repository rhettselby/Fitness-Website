import { SelectedPage, type ClassType } from "@/shared/types";
import HText from "@/shared/HText";
import image1 from "@/assets/image1.png";
import image2 from "@/assets/image2.png";
import image3 from "@/assets/image3.png";
import image4 from "@/assets/image4.png";
import image5 from "@/assets/image5.png";
import image6 from "@/assets/image6.png";
import { motion } from "framer-motion";
import Class from "./Class";



const classes: Array<ClassType> =[
    {
        name: "Weight Training Classes",
        description: " Left Blank",
        image: image1,
    
    },

    {
        name: "Fitness Training Classes",
        image: image2,
    },

    {
        name: "Adventure Training Classes",
        description: " Left Blank",
        image: image3,
    
    },

    {
        name: "AB Core Training Classes",
        image: image4,
    
    },

    {
        name: "Yoga Classes",
        description: " Left Blank",
        image: image5,
    
    },

    {
        name: "Training Classes",
        description: " Left Blank",
        image: image6,
    
    }

]




type Props ={
    setSelectedPage: (value: SelectedPage) => void;
}

const OurClasses = ({setSelectedPage}: Props) => {
    return (

        <section id="ourclasses" className="w-full bg-primary-100 py-40">
            <motion.div
                onViewportEnter={() => setSelectedPage(SelectedPage.OurClasses)}
            >
                    <motion.div initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ delay: 0.1, duration: 2 }}
                        variants={{
                             hidden: { opacity: 0, x: -50 },
                            visible: { opacity: 1, x: 0 },
                        }}
                    >
                        <div className= "md:w-3/5" >
                            <HText>
                                Our Classes
                            </HText>
                            <p className="py-5">
                                Fill in with information about our classes.
                            </p>
                        </div>

                    </motion.div>
                    <div className="mt-10 h-[350px] w-full overflow-x-auto overflow-y-hidden">
                        <ul className="w-[2800px] whitespace-nowrap">
                            {classes.map((item: ClassType, index) => (
                                <Class
                                    key = {`${item.name}-${index}`}
                                    name = {item.name}
                                    description={item.description}
                                    image = {item.image}
                                />
                            ))}

                        </ul>
                    </div>

            </motion.div>
        </section>

    )
}

export default OurClasses