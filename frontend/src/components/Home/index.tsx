import useMediaQuery from "@/hooks/useMediaQuery";
import ActionButton from "@/shared/ActionButton";
import { SelectedPage } from "@/shared/types";
import AnchorLink from "react-anchor-link-smooth-scroll";
import { motion } from "framer-motion";

import RhettSoccer from "@/assets/RhettSoccer.png";
import KateTennis from "@/assets/KateTennis.png";

type Props = {
  setSelectedPage: (value: SelectedPage) => void;
};

const Home = ({ setSelectedPage }: Props) => {
  const isAboveMediumScreen = useMediaQuery("(min-width:1060px)");

  return (
    <section
      id="home"
      className="relative bg-gray-20 py-10 md:h-full md:pb-0 overflow-hidden"
    >
      <motion.div
        className="relative mx-auto w-11/12 md:flex md:h-5/6 md:items-center"
        onViewportEnter={() => setSelectedPage(SelectedPage.Home)}
      >
        {/* ================= LEFT SIDE ================= */}
        <div className="z-10 md:basis-2/5 flex flex-col items-center justify-center text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 2 }}
            variants={{
              hidden: { opacity: 0, x: -50 },
              visible: { opacity: 1, x: 0 },
            }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-relaxed mb-4 md:mb-6">
              Welcome to<br />Rhett's Fitness<br />Community
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl text-white font-medium">
              Log your workouts every day!
            </p>
          </motion.div>

          <motion.div
            className="mt-6 md:mt-8 flex items-center gap-6 md:gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: 0.1, duration: 2 }}
            variants={{
              hidden: { opacity: 0, x: -50 },
              visible: { opacity: 1, x: 0 },
            }}
          >
            <ActionButton setSelectedPage={setSelectedPage}>
              Join Now
            </ActionButton>

            <AnchorLink
              className="text-base md:text-lg font-bold text-primary-500 underline hover:text-primary-300 transition"
              onClick={() => setSelectedPage(SelectedPage.ContactUs)}
              href={`#${SelectedPage.ContactUs}`}
            >
              <p>Learn More</p>
            </AnchorLink>
          </motion.div>
        </div>

        {/* ================= HERO ATHLETES — DESKTOP ================= */}
        {isAboveMediumScreen && (
          <div
            className="
              absolute right-0 top-1/2
              flex items-center justify-center
              -translate-y-1/2
              w-3/5
              pr-12
            "
          >
            {/* Kate — LEFT, SMALLER */}
            <motion.img
              src={KateTennis}
              alt="Kate playing tennis"
              className="absolute z-10"
              style={{ objectFit: "contain" }}
              initial={{ opacity: 0, x: -140, y: 120, scale: 0.78 }}
              whileInView={{ opacity: 1, x: -90, y: 0, scale: 0.78 }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, ease: "easeOut" }}
            />
            {/* Rhett — RIGHT, LARGER */}
            <motion.img
              src={RhettSoccer}
              alt="Rhett playing soccer"
              className="absolute z-20"
              style={{ objectFit: "contain" }}
              initial={{ opacity: 0, x: 140, y: 140, scale: 1.15 }}
              whileInView={{ opacity: 1, x: 90, y: 0, scale: 1.15 }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, ease: "easeOut", delay: 0.1 }}
            />
          </div>
        )}

        {/* ================= HERO ATHLETES — MOBILE ================= */}
        {!isAboveMediumScreen && (
          <div className="relative flex justify-center items-end mt-8 h-52 w-full">
            {/* Kate — far left */}
            <motion.img
              src={KateTennis}
              alt="Kate playing tennis"
              className="z-10 h-40 w-auto object-contain"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
            {/* Rhett — far right, slightly taller */}
            <motion.img
              src={RhettSoccer}
              alt="Rhett playing soccer"
              className="z-20 h-48 w-auto object-contain"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.1 }}
            />
          </div>
        )}
      </motion.div>
    </section>
  );
};

export default Home;