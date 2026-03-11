import { SelectedPage } from "@/shared/types";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import ContactUsPageGraphic from "@/assets/ContactUsPageGraphic.png";
import { API_URL } from "@/lib/config";
import { TokenService } from "@/utils/auth";
import { useNavigate } from "react-router-dom";

type FormValues = {
  username: string;
  email: string;
  password: string;
};

type Props = {
  setSelectedPage: (value: SelectedPage) => void;
};

const ContactUs = ({ setSelectedPage }: Props) => {
  const inputStyles = `mb-5 w-full rounded-lg bg-primary-300 px-5 py-3 placeholder-white text-black`;
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
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
      } else {
        alert(result.error || "Registration failed");
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      alert("Network error. Please try again.");
    }
  };

  return (
    <section id="contactus" className="w-full bg-gray-20 py-16 md:py-24">
      <div className="mx-auto w-5/6">
        <motion.div onViewportEnter={() => setSelectedPage(SelectedPage.ContactUs)}>

          {/* ── Header ── */}
          <motion.div
            className="w-full md:w-3/5"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 2 }}
            variants={{
              hidden: { opacity: 0, x: -50 },
              visible: { opacity: 1, x: 0 },
            }}
          >
            <h1 className="text-2xl sm:text-3xl font-bold font-montserrat">
              <span className="text-primary-500">Join Now </span>
              <span className="text-white">To Start Tracking Workouts</span>
            </h1>
            <p className="my-4 md:my-5 text-sm sm:text-base">
              Create an account to compete with your Friends!
            </p>
          </motion.div>

          {/* ── Form + Image ── */}
          <div className="mt-8 md:mt-10 md:flex md:items-center md:justify-between md:gap-8">

            {/* Form */}
            <motion.div
              className="basis-3/5"
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
                  type="text"
                  placeholder="Username"
                  {...register("username", {
                    required: true,
                    minLength: 3,
                    maxLength: 150,
                  })}
                />
                {errors.username && (
                  <p className="mt-1 mb-3 text-primary-500 text-sm">
                    {errors.username.type === "required" && "Username is required."}
                    {errors.username.type === "minLength" && "Username must be at least 3 characters."}
                    {errors.username.type === "maxLength" && "Max length is 150 characters."}
                  </p>
                )}

                <input
                  className={inputStyles}
                  type="email"
                  placeholder="Email"
                  {...register("email", {
                    required: true,
                    pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  })}
                />
                {errors.email && (
                  <p className="mt-1 mb-3 text-primary-500 text-sm">
                    {errors.email.type === "required" && "Email is required."}
                    {errors.email.type === "pattern" && "Invalid email address."}
                  </p>
                )}

                <input
                  className={inputStyles}
                  type="password"
                  placeholder="Password"
                  {...register("password", {
                    required: true,
                    minLength: 8,
                  })}
                />
                {errors.password && (
                  <p className="mt-1 mb-3 text-primary-500 text-sm">
                    {errors.password.type === "required" && "Password is required."}
                    {errors.password.type === "minLength" && "Password must be at least 8 characters."}
                  </p>
                )}

                <button
                  type="submit"
                  className="mt-5 w-full sm:w-auto rounded-lg bg-accent-500 text-white px-20 py-3 font-bold transition duration-300 hover:bg-accent-600"
                >
                  Register
                </button>
              </form>
            </motion.div>

            {/* Image — hidden on mobile, visible md+ */}
            <motion.div
              className="hidden md:flex md:mt-0 md:basis-2/5 justify-center"
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
      </div>
    </section>
  );
};

export default ContactUs;