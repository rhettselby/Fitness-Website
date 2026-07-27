import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { SelectedPage } from "@/shared/types";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import ContactUsPageGraphic from "@/assets/ContactUsPageGraphic.png";
import { API_URL } from "@/lib/config";
import { TokenService } from "@/utils/auth";
import { useNavigate } from "react-router-dom";
const ContactUs = ({ setSelectedPage }) => {
    const inputStyles = `mb-5 w-full rounded-lg bg-primary-300 px-5 py-3 placeholder-white text-black`;
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, } = useForm();
    const onSubmit = async (data) => {
        try {
            const response = await fetch(`${API_URL}/users/api/register-jwt/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: data.username,
                    password: data.password,
                    email: data.email || "",
                }),
            });
            const result = await response.json();
            if (result.success) {
                TokenService.setTokens(result.access, result.refresh);
                TokenService.setUser(result.user);
                navigate("/profile");
            }
            else {
                alert(result.error || "Registration failed");
            }
        }
        catch (err) {
            console.error("Error submitting form:", err);
            alert("Network error. Please try again.");
        }
    };
    return (_jsx("section", { id: "contactus", className: "w-full bg-gray-20 py-16 md:py-24", children: _jsx("div", { className: "mx-auto w-5/6", children: _jsxs(motion.div, { onViewportEnter: () => setSelectedPage(SelectedPage.ContactUs), children: [_jsxs(motion.div, { className: "w-full md:w-3/5", initial: "hidden", whileInView: "visible", viewport: { once: true, amount: 0.5 }, transition: { duration: 2 }, variants: {
                            hidden: { opacity: 0, x: -50 },
                            visible: { opacity: 1, x: 0 },
                        }, children: [_jsxs("h1", { className: "text-2xl sm:text-3xl font-bold font-montserrat", children: [_jsx("span", { className: "text-primary-500", children: "Join Now " }), _jsx("span", { className: "text-white", children: "To Start Tracking Workouts" })] }), _jsx("p", { className: "my-4 md:my-5 text-sm sm:text-base", children: "Create an account to compete with your Friends!" })] }), _jsxs("div", { className: "mt-8 md:mt-10 md:flex md:items-center md:justify-between md:gap-8", children: [_jsx(motion.div, { className: "basis-3/5", initial: "hidden", whileInView: "visible", viewport: { once: true, amount: 0.5 }, transition: { duration: 2 }, variants: {
                                    hidden: { opacity: 0, y: 50 },
                                    visible: { opacity: 1, y: 0 },
                                }, children: _jsxs("form", { onSubmit: handleSubmit(onSubmit), children: [_jsx("input", { className: inputStyles, type: "text", placeholder: "Username", ...register("username", {
                                                required: true,
                                                minLength: 3,
                                                maxLength: 150,
                                            }) }), errors.username && (_jsxs("p", { className: "mt-1 mb-3 text-primary-500 text-sm", children: [errors.username.type === "required" && "Username is required.", errors.username.type === "minLength" && "Username must be at least 3 characters.", errors.username.type === "maxLength" && "Max length is 150 characters."] })), _jsx("input", { className: inputStyles, type: "email", placeholder: "Email", ...register("email", {
                                                required: true,
                                                pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            }) }), errors.email && (_jsxs("p", { className: "mt-1 mb-3 text-primary-500 text-sm", children: [errors.email.type === "required" && "Email is required.", errors.email.type === "pattern" && "Invalid email address."] })), _jsx("input", { className: inputStyles, type: "password", placeholder: "Password", ...register("password", {
                                                required: true,
                                                minLength: 8,
                                            }) }), errors.password && (_jsxs("p", { className: "mt-1 mb-3 text-primary-500 text-sm", children: [errors.password.type === "required" && "Password is required.", errors.password.type === "minLength" && "Password must be at least 8 characters."] })), _jsx("button", { type: "submit", className: "mt-5 w-full sm:w-auto rounded-lg bg-accent-500 text-white px-20 py-3 font-bold transition duration-300 hover:bg-accent-600", children: "Register" })] }) }), _jsx(motion.div, { className: "hidden md:flex md:mt-0 md:basis-2/5 justify-center", initial: "hidden", whileInView: "visible", viewport: { once: true, amount: 0.3 }, transition: { duration: 0.5 }, variants: {
                                    hidden: { opacity: 0 },
                                    visible: { opacity: 1 },
                                }, children: _jsx("img", { className: "w-full max-w-md object-contain", alt: "contact-us-page-graphic", src: ContactUsPageGraphic }) })] })] }) }) }));
};
export default ContactUs;
