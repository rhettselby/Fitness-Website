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

  /* ================= SIZE TUNING ================= */
  const RHETT_WIDTH = 1120;
  const RHETT_HEIGHT = 860;

  const KATE_WIDTH = 760;
  const KATE_HEIGHT = 620;

  /* ================= MOTION CALIBRATION ================= */
  const FINAL_KATE_X = -220;  // LEFT
  const FINAL_RHETT_X = 220;  // RIGHT
  const MOTION_DISTANCE = 260; // equal travel

  return (
    <section
      id="home"
      className="relative bg-gray-20 py-10 md:h-full md:pb-0 overflow-hidden"
    >
      <motion.div
        className="relative mx-auto w-11/12 md:flex md:h-5/6"
        onViewportEnter={() => setSelectedPage(SelectedPage.Home)}
      >
        {/* ================= LEFT CONTENT ================= */}
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

        {/* ================= HERO ATHLETES ================= */}
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
            {/* Kate — LEFT, smaller */}
            <motion.img
              src={KateTennis}
              alt="Kate playing tennis"
              className="absolute z-10"
              style={{
                width: KATE_WIDTH,
                height: KATE_HEIGHT,
                objectFit: "contain",
              }}
              initial={{
                opacity: 0,
                x: FINAL_KATE_X - MOTION_DISTANCE,
                y: 120,
              }}
              whileInView={{
                opacity: 1,
                x: FINAL_KATE_X,
                y: 0,
              }}
              viewport={{ once: true }}
              transition={{ duration: 1.6, ease: "easeOut" }}
            />

            {/* Rhett — RIGHT, larger (hero) */}
            <motion.img
              src={RhettSoccer}
              alt="Rhett playing soccer"
              className="absolute z-20"
              style={{
                width: RHETT_WIDTH,
                height: RHETT_HEIGHT,
                objectFit: "contain",
              }}
              initial={{
                opacity: 0,
                x: FINAL_RHETT_X + MOTION_DISTANCE,
                y: 140,
              }}
              whileInView={{
                opacity: 1,
                x: FINAL_RHETT_X,
                y: 0,
              }}
              viewport={{ once: true }}
              transition={{
                duration: 1.6,
                ease: "easeOut",
                delay: 0.15,
              }}
            />
          </div>
        )}
      </motion.div>
    </section>
  );
};

export default Home;