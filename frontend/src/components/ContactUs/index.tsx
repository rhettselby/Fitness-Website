import { SelectedPage } from "@/shared/types";
import {useForm} from "react-hook-form"
import { motion } from "framer-motion"
import ContactUsPageGraphic from "@/assets/ContactUsPageGraphic.png"
import HText from "@/shared/HText";
import { API_URL } from "@/lib/config";
import { TokenService } from "@/utils/auth";

type FormValues = {
    username: string;
    email: string;
    password: string;
};

type Props = {
    setSelectedPage: (value: SelectedPage) => void;
}

const ContactUs = ({setSelectedPage}: Props) => {
    const inputStyles = `mb-5 w-full rounded-lg bg-primary-300 px-5 py-3 placeholder-white`;

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<FormValues>();

    const onSubmit = async (data: FormValues) => {
        try {
            const response = await fetch(`${API_URL}/users/api/register-jwt/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: data.username,
                    password: data.password,
                    email: data.email || "",
                }),
            });

            const result = await response.json();
            console.log("Server response:", result);

            if (result.success) {
                TokenService.setTokens(result.access, result.refresh);
                TokenService.setUser(result.user);
                // Reload page to update navbar with login status
                window.location.reload();
            } else {
                alert(result.error || "Registration failed");
            }
        } catch (err) {
            console.error("Error submitting form:", err);
            alert("Network error. Please try again.");
        }
    };

    return (
       <section id="contactus" className = "mx-auto w-5/6 pt-24 pb-32">
            <motion.div onViewportEnter = {() => setSelectedPage(SelectedPage.ContactUs)}>
                {/* Header */}
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
                            {" "}
                        </span>
                        To Start Tracking Workouts
                    </HText>
                    <p className = "my-5">
                        Create an account to compete with your Friends!
                    </p>
                </motion.div>

                {/* Form and Image */}
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
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <input
                                className={inputStyles}
                                type = "text"
                                placeholder = "Username"
                                {...register("username", {
                                    required: true,
                                    minLength: 3,
                                    maxLength: 150,
                                })}
                            />
                            {errors.username && (
                                <p className = "mt-1 text-primary-500">
                                    {errors.username.type === "required" && "Username is required."}
                                    {errors.username.type === "minLength" && "Username must be at least 3 characters."}
                                    {errors.username.type === "maxLength" && "Max length is 150 characters"}
                                </p>
                            )}

                            <input
                                className={inputStyles}
                                type = "email"
                                placeholder = "Email"
                                {...register("email", {
                                    required: true,
                                    pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                })}
                            />
                            {errors.email && (
                                <p className = "mt-1 text-primary-500">
                                    {errors.email.type === "required" && "Email is required."}
                                    {errors.email.type === "pattern" && "Invalid email address"}
                                </p>
                            )}

                            <input
                                className={inputStyles}
                                type = "password"
                                placeholder = "Password"
                                {...register("password", {
                                    required: true,
                                    minLength: 8,
                                })}
                            />
                            {errors.password && (
                                <p className = "mt-1 text-primary-500">
                                    {errors.password.type === "required" && "Password is required."}
                                    {errors.password.type === "minLength" && "Password must be at least 8 characters."}
                                </p>
                            )}

                            <button 
                                type = "submit"
                                className = "mt-5 rounded-lg bg-secondary-500 px-20 py-3 transition duration-500 hover:text-white">
                                Register
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