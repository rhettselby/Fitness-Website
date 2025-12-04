import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { SelectedPage } from "@/shared/types";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import ContactUsPageGraphic from "@/assets/ContactUsPageGraphic.png";
import HText from "@/shared/HText";
const ContactUs = ({ setSelectedPage }) => {
    const inputStyles = `mb-5 w-full rounded-lg bg-primary-300 px-5 py-3 placeholder-white`;
    const { register, handleSubmit, formState: { errors }, reset, } = useForm();
    const onSubmit = async (data) => {
        try {
            const response = await fetch("/users/api/register/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include',
                body: JSON.stringify({
                    username: data.username,
                    password: data.password,
                    email: data.email || "",
                }),
            });
            const result = await response.json();
            console.log("Server response:", result);
            if (result.success) {
                alert("User registered successfully! You are now logged in.");
                reset();
                // Reload page to update navbar with login status
                window.location.reload();
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
    return (_jsx("section", { id: "contactus", className: "mx-auto w-5/6 pt-24 pb-32", children: _jsxs(motion.div, { onViewportEnter: () => setSelectedPage(SelectedPage.ContactUs), children: [_jsxs(motion.div, { className: "md:w-3/5", initial: "hidden", whileInView: "visible", viewport: { once: true, amount: 0.5 }, transition: { duration: 2 }, variants: {
                        hidden: { opacity: 0, x: -50 },
                        visible: { opacity: 1, x: 0 },
                    }, children: [_jsxs(HText, { children: [_jsxs("span", { className: "text-primary-500", children: ["Join Now", " "] }), "To Start Tracking Workouts"] }), _jsx("p", { className: "my-5", children: "Create an account to compete with your Friends!" })] }), _jsxs("div", { className: "mt-10 items-center justify-between gap-8 md:flex", children: [_jsx(motion.div, { className: "mt-10 basis-3/5", initial: "hidden", whileInView: "visible", viewport: { once: true, amount: 0.5 }, transition: { duration: 2 }, variants: {
                                hidden: { opacity: 0, y: 50 },
                                visible: { opacity: 1, y: 0 },
                            }, children: _jsxs("form", { onSubmit: handleSubmit(onSubmit), children: [_jsx("input", { className: inputStyles, type: "text", placeholder: "Username", ...register("username", {
                                            required: true,
                                            minLength: 3,
                                            maxLength: 150,
                                        }) }), errors.username && (_jsxs("p", { className: "mt-1 text-primary-500", children: [errors.username.type === "required" && "Username is required.", errors.username.type === "minLength" && "Username must be at least 3 characters.", errors.username.type === "maxLength" && "Max length is 150 characters"] })), _jsx("input", { className: inputStyles, type: "email", placeholder: "Email", ...register("email", {
                                            required: true,
                                            pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        }) }), errors.email && (_jsxs("p", { className: "mt-1 text-primary-500", children: [errors.email.type === "required" && "Email is required.", errors.email.type === "pattern" && "Invalid email address"] })), _jsx("input", { className: inputStyles, type: "password", placeholder: "Password", ...register("password", {
                                            required: true,
                                            minLength: 8,
                                        }) }), errors.password && (_jsxs("p", { className: "mt-1 text-primary-500", children: [errors.password.type === "required" && "Password is required.", errors.password.type === "minLength" && "Password must be at least 8 characters."] })), _jsx("button", { type: "submit", className: "mt-5 rounded-lg bg-secondary-500 px-20 py-3 transition duration-500 hover:text-white", children: "Register" })] }) }), _jsx(motion.div, { className: "mt-16 flex justify-center md:mt-0 md:basis-2/5", initial: "hidden", whileInView: "visible", viewport: { once: true, amount: 0.3 }, transition: { duration: 0.5 }, variants: {
                                hidden: { opacity: 0 },
                                visible: { opacity: 1 },
                            }, children: _jsx("img", { className: "w-full max-w-md object-contain", alt: "contact-us-page-graphic", src: ContactUsPageGraphic }) })] })] }) }));
};
export default ContactUs;
