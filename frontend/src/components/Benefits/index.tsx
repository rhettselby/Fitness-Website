import { type BenefitType, SelectedPage } from "@/shared/types";
import { LinkIcon, UserGroupIcon, ChartBarIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import { HText } from "@/shared/HText";
import Benefit from "./Benefit";
import ActionButton from "@/shared/ActionButton";
import ImSoccer from "@/assets/IMSOCCER.png";

const benefits: Array<BenefitType> = [
  {
    icon: <LinkIcon className="h-6 w-6" />,
    title: "Connect your devices",
    description: "Pair your Whoop, Oura, or Strava using 'Connect'",
    linkTo: "/connect",
  },
  {
    icon: <ChartBarIcon className="h-6 w-6" />,
    title: "Track each workout",
    description: "View all of your workouts and more under 'Profile'",
    linkTo: "/profile",
  },
  {
    icon: <UserGroupIcon className="h-6 w-6" />,
    title: "Join the community",
    description: "Check out 'Leaderboard' for friendly competition",
    linkTo: SelectedPage.Leaderboard,
  },
];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2 } },
};

type Props = {
  setSelectedPage: (value: SelectedPage) => void;
};

const Benefits = ({ setSelectedPage }: Props) => {
  return (
    <section id="benefits" className="w-full min-h-full py-16 md:py-20 bg-gray-20">
      <div className="mx-auto w-5/6">
        <motion.div onViewportEnter={() => setSelectedPage(SelectedPage.Home)}>

          {/* ── Header ── */}
          <motion.div
            className="md:my-5 md:w-3/5"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 2 }}
            variants={{
              hidden: { opacity: 0, x: -50 },
              visible: { opacity: 1, x: 0 },
            }}
          >
            <HText>About</HText>
            <p className="my-4 md:my-5 text-sm text-white">
              Why join the Fitness Community?
            </p>
          </motion.div>

          {/* ── Benefit Cards ── */}
          <motion.div
            className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={container}
          >
            {benefits.map((benefit: BenefitType) => (
              <Benefit
                key={benefit.title}
                icon={benefit.icon}
                title={benefit.title}
                description={benefit.description}
                setSelectedPage={setSelectedPage}
                linkTo={benefit.linkTo}
              />
            ))}
          </motion.div>

          {/* ── Graphic + Description ── */}
          <div className="mt-16 md:mt-28 md:flex md:items-center md:justify-between md:gap-20">

            {/* Graphic */}
            <div className="flex justify-center md:basis-3/5">
              <img
                className="w-full max-w-xs sm:max-w-sm md:max-w-md"
                alt="benefits-page-graphic"
                src={ImSoccer}
                onError={(e) => {
                  console.error("Failed to load ImSoccer");
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>

            {/* Description */}
            <div className="mt-10 md:mt-0 md:basis-2/5">
              {/* Title */}
              <div className="relative">
                <div className="before:absolute before:-top-20 before:-left-20 before:z-[-1] md:w-3/5">
                  <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 2 }}
                    variants={{
                      hidden: { opacity: 0, x: 50 },
                      visible: { opacity: 1, x: 0 },
                    }}
                  >
                    <HText>
                      A strong community of members getting{" "}
                      <span className="text-primary-500">Fit</span>
                    </HText>
                  </motion.div>
                </div>
              </div>

              {/* Body text */}
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
                <p className="my-5 text-white" />
                <p className="mb-5 text-white" />
              </motion.div>

              {/* Button */}
              <div className="relative mt-10 md:mt-16">
                <div className="before:absolute before:-bottom-20 before:right-40 before:z-[-1]">
                  <ActionButton setSelectedPage={setSelectedPage}>
                    Join Now
                  </ActionButton>
                </div>
              </div>
            </div>
          </div>

        </motion.div>
      </div>
    </section>
  );
};

export default Benefits;