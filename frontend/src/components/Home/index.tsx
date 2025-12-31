import useMediaQuery from "@/hooks/useMediaQuery";
import ActionButton from "@/shared/ActionButton";
import { SelectedPage } from "@/shared/types";
import AnchorLink from "react-anchor-link-smooth-scroll";
import { motion } from "framer-motion";

import imsoccer from "@/assets/IMSOCCER.png";
import RhettLogo from "@/assets/RhettLogo.png";

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
      className="bg-gray-20 py-10 md:h-full md:pb-0"
    >
      <motion.div
        className="md:flex mx-auto w-11/12 items-center justify-center md:h-5/6"
        onViewportEnter={() => setSelectedPage(SelectedPage.Home)}
      >
        {/* ================= LEFT SIDE ================= */}
        <div className="z-10 mt-32 md:basis-2/5">
          <motion.div
            className="md:-mt-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 2 }}
            variants={{
              hidden: { opacity: 0, x: -50 },
              visible: { opacity: 1, x: 0 },
            }}
          >
            <div className="relative">
              <div className="before:absolute before:-top-20 before:-left-20 before:z-[-1]">
                <img
                  alt="home-page-text"
                  src={imsoccer}
                  className="w-full max-w-md"
                  onError={(e) => {
                    console.error("Failed to load HomePageText:", RhettLogo);
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            </div>
            <p className="mt-8 text-sm text-white">
              Welcome to Rhett's Fitness Community. Log your workouts every day!
            </p>
          </motion.div>

          <motion.div
            className="mt-8 flex items-center gap-8"
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
              className="text-sm font-bold text-primary-500 underline"
              onClick={() => setSelectedPage(SelectedPage.ContactUs)}
              href={`#${SelectedPage.ContactUs}`}
            >
              <p>Learn More</p>
            </AnchorLink>
          </motion.div>
        </div>

        {/* ================= RIGHT SIDE — ATHLETIC HERO ================= */}
        <div className="relative flex flex-col items-center justify-end md:flex-row md:gap-6 md:ml-auto md:mt-16 md:basis-3/5">
          
          {/* PRIMARY — Rhett (Soccer) */}
          <motion.img
            src={RhettSoccer}
            alt="Rhett playing soccer"
            className="w-full h-auto"
            style={{
              maxWidth: "1800px",
              transform: "scale(1.4)",
            }}
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            onError={(e) => {
              console.error("Failed to load RhettSoccer:", RhettSoccer);
              e.currentTarget.style.display = "none";
            }}
          />

          {/* SECONDARY — Kate (Tennis, OVERLAPPING) */}
          <motion.img
            src={KateTennis}
            alt="Kate playing tennis"
            className="w-full h-auto md:-ml-24"
            style={{
              maxWidth: "1600px",
              transform: "scale(1.3)",
            }}
            initial={{ opacity: 0, y: 120 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.7, ease: "easeOut", delay: 0.25 }}
            onError={(e) => {
              console.error("Failed to load KateTennis:", KateTennis);
              e.currentTarget.style.display = "none";
            }}
          />
        </div>
      </motion.div>
    </section>
  );
};

export default Home;