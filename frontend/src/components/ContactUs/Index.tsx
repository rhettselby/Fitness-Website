import { SelectedPage } from "@/shared/types";
import {useForm} from "react-hook-form"
import { motion } from "framer-motion"
import ContactUsPageGraphic from "@/assets/ContactUsPageGraphic.png"
import HText from "@/shared/HText";



type Props = {
    setSelectedPage: (value: SelectedPage) => void;
}

const ContactUs = ({setSelectedPage}: Props) => {
    const inputStyles = `mb-5 w-full rounded-lg bg-primary-300 px-5 py-3 placeholder-white`;

    const {
        register,
        trigger,
        formState: { errors }
    } = useForm();

    const onSubmit = async (e: any) => {
        const isValid = await trigger();
        if (!isValid) {
            e.preventDefault();
        }
    }

    return (
       <section id="contactus" className = "mx-auto w-5/6 pt-24 pb-32">
            <motion.div onViewportEnter = {() => setSelectedPage(SelectedPage.ContactUs)}>
                {/* Header */ }
                <motion.div
                    className = "md:w-3/5"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 2 }}
                    variants={{
                        hidden: { opacity: 0, x: -50 },
                        visible: { opacity: 1, x: 0 },
                    }}
                >
                    <HText>
                        <span className = "text-primary-500">
                            Join Now
                        </span>
                        To Get in Shape
                    </HText>
                    <p className = "my-5">
                        Put some relevant information here
                    </p>
                </motion.div>

                {/* Form and Image */ }
                <div className = "mt-10 items-center justify-between gap-8 md:flex">
                    <motion.div 
                        className = "mt-10 basis-3/5"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 2 }}
                        variants={{
                            hidden: { opacity: 0, y: 50 },
                            visible: { opacity: 1, y: 0 },
                        }}
                    >
                        <form 
                            target = "_blank"
                            onSubmit={onSubmit}
                            action="https://formsubmit.co/c2a377ba8c8e3d2d35a7b63a29fb4760"
                            method="POST"
                        >
                            <input
                                className={inputStyles}
                                type = "text"
                                placeholder = "name"
                                {...register("name", {
                                    required: true,
                                    maxLength: 100,

                                })}
                            />
                            {errors.name && (
                                <p
                                className = "mt-1 text-primary-500">
                                {errors.name.type === "required" && "This field is required."}
                                {errors.name.type === "maxLength" && "Max length is 100 characters"}
                                    
                                </p>
                            )}

                            <input
                                className={inputStyles}
                                type = "email"
                                placeholder = "EMAIL"
                                {...register("email", {
                                    required: true,
                                    pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.0]+\.[A-Z]{2,}$/i,

                                })}
                            />
                            {errors.email && (
                                <p
                                className = "mt-1 text-primary-500">
                                {errors.email.type === "required" && "This field is required."}
                                {errors.email.type === "pattern" && "Invalid email adress"}
                                    
                                </p>
                            )}

                            <textarea
                                className={inputStyles}
                                rows={4}
                                cols = {50}
                                placeholder = "MESSAGE"
                                {...register("message", {
                                    required: true,
                                    maxLength: 2000,

                                })}
                            />
                            {errors.message && (
                                <p
                                className = "mt-1 text-primary-500">
                                {errors.message.type === "required" && "This field is required."}
                                {errors.message.type === "maxLength" && "Max length is 100 characters"}
                                    
                                </p>
                            )}

                            <button 
                                type = "submit"
                                className = "mt-5 rounded-lg bg-secondary-500 px-20 py-3 transition duration-500 hover:text-white">
                                Submit
                            </button>

                        </form>
                    </motion.div>

                    <motion.div 
                        className="mt-16 flex justify-center md:mt-0 md:basis-2/5"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.5 }}
                        variants={{
                            hidden: { opacity: 0 },
                            visible: { opacity: 1 },
                        }}
                    >
                        <img 
                            className="w-full max-w-md object-contain" 
                            alt="contact-us-page-graphic"
                            src={ContactUsPageGraphic}
                        />
                    </motion.div>

                </div>
            </motion.div>
       </section>
            
    )
}

export default ContactUs