import { type BenefitType, SelectedPage } from "@/shared/types";
import { LinkIcon, UserGroupIcon, ChartBarIcon } from "@heroicons/react/24/solid";
import { motion, AnimatePresence } from "framer-motion";
import { HText } from "@/shared/HText";
import Benefit from "./Benefit";
import ActionButton from "@/shared/ActionButton";
import ImSoccer from "@/assets/IMSOCCER.png";
import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "@/lib/config";
import { TokenService } from "@/utils/auth";


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

const RANK_MEDALS: Record<number, string> = { 1: "🥇", 2: "🥈", 3: "🥉" };

type LeaderboardEntry = {
  rank: number;
  user: string;
  score: number;
};

type Group = {
  id: number;
  name: string;
  motto: string | null;
};

type Props = {
    icon: ReactNode;  // ✅ add this line
    title: string;
    description: string;
    setSelectedPage: (value: SelectedPage) => void;
    linkTo?: SelectedPage | string;
}

const Benefits = ({ setSelectedPage }: Props) => {
  const navigate = useNavigate();
  const isAuthenticated = !!TokenService.getAccessToken();

  const [defaultGroup, setDefaultGroup] = useState<Group | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loadingGroup, setLoadingGroup] = useState(true);
  const [noGroups, setNoGroups] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchDefaultGroup();
  }, []);

  const fetchDefaultGroup = async () => {
    const token = TokenService.getAccessToken();
    try {
      const res = await fetch(`${API_URL}/groups/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      const groups: Group[] = data.groups || [];
      if (groups.length === 0) {
        setNoGroups(true);
        setLoadingGroup(false);
        return;
      }
      const first = groups[0];
      setDefaultGroup(first);
      await fetchLeaderboard(first.id);
    } catch {
      setLoadingGroup(false);
    }
  };

  const fetchLeaderboard = async (groupId: number) => {
    const token = TokenService.getAccessToken();
    try {
      const res = await fetch(`${API_URL}/groups/get_leaderboard/${groupId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setLeaderboard((data.leaderboard || []).slice(0, 5));
    } catch {
      setLeaderboard([]);
    } finally {
      setLoadingGroup(false);
    }
  };

  // ── Logged-in: show group leaderboard ──
  if (isAuthenticated) {
    return (
      <section
        id="benefits"
        className="hidden md:block w-full py-16 md:py-20 bg-gray-20"
      >
        <div className="mx-auto w-5/6">
          <motion.div onViewportEnter={() => setSelectedPage(SelectedPage.Home)}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5 }}
            >
              {/* Header row */}
              <div className="flex items-end justify-between mb-6">
                <div>
                  <HText>Your Group</HText>
                  {defaultGroup && (
                    <p className="mt-1 text-sm text-white opacity-70">
                      {defaultGroup.motto || "Compete with your crew"}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  {defaultGroup && (
                    <button
                      onClick={() =>
                        navigate(`/groups/${defaultGroup.id}/leaderboard`, {
                          state: { groupName: defaultGroup.name },
                        })
                      }
                      className="text-sm font-bold text-primary-500 hover:text-primary-300 underline transition"
                    >
                      Full leaderboard →
                    </button>
                  )}
                  <button
                    onClick={() => navigate("/groups")}
                    className="text-sm font-semibold text-gray-400 hover:text-white transition"
                  >
                    All groups
                  </button>
                </div>
              </div>

              {/* Content */}
              {loadingGroup ? (
                <div className="flex flex-col gap-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="h-14 rounded-xl bg-gray-700 animate-pulse opacity-50"
                    />
                  ))}
                </div>
              ) : noGroups ? (
                <div className="flex flex-col items-center justify-center py-16 gap-4 border-2 border-dashed border-gray-600 rounded-2xl">
                  <p className="text-4xl">🏃</p>
                  <p className="text-white font-semibold text-base">
                    You're not in any groups yet
                  </p>
                  <p className="text-gray-400 text-sm text-center max-w-xs">
                    Join or create a group to compete with friends and track your progress together.
                  </p>
                  <button
                    onClick={() => navigate("/groups")}
                    className="mt-2 px-6 py-2.5 bg-primary-500 text-white rounded-xl font-bold text-sm hover:bg-primary-600 transition active:scale-95"
                  >
                    Go to Groups →
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <AnimatePresence>
                    {leaderboard.map((entry, index) => {
                      const isTop3 = entry.rank <= 3;
                      const medal = RANK_MEDALS[entry.rank];
                      return (
                        <motion.div
                          key={entry.user}
                          initial={{ opacity: 0, x: -15 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.35, delay: index * 0.08 }}
                          className={`flex items-center justify-between px-5 py-3.5 rounded-xl border-2 cursor-pointer transition-all group
                            ${isTop3
                              ? "border-yellow-400 bg-yellow-50/10 hover:bg-yellow-50/20"
                              : "border-gray-600 bg-white/5 hover:bg-white/10"
                            }`}
                          onClick={() =>
                            navigate(`/groups/${defaultGroup!.id}/leaderboard`, {
                              state: { groupName: defaultGroup!.name },
                            })
                          }
                        >
                          <div className="flex items-center gap-4">
                            <span className="w-7 text-center text-base">
                              {medal || (
                                <span className="text-xs font-bold text-gray-400">
                                  #{entry.rank}
                                </span>
                              )}
                            </span>
                            <p className={`font-bold text-base ${isTop3 ? "text-yellow-300" : "text-white"}`}>
                              {entry.user}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`font-bold text-sm ${isTop3 ? "text-yellow-400" : "text-primary-400"}`}>
                              {entry.score} pts
                            </span>
                            <span className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                              →
                            </span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>
    );
  }

  // ── Logged-out: show original About section ──
  return (
    <section id="benefits" className="hidden md:block w-full min-h-full py-16 md:py-20 bg-gray-20">
      <div className="mx-auto w-5/6">
        <motion.div onViewportEnter={() => setSelectedPage(SelectedPage.Home)}>

          {/* Header */}
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

          {/* Benefit Cards */}
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

          {/* Graphic + Description */}
          <div className="mt-16 md:mt-28 md:flex md:items-center md:justify-between md:gap-20">
            <div className="flex justify-center md:basis-3/5">
              <img
                className="w-full max-w-xs sm:max-w-sm md:max-w-md"
                alt="benefits-page-graphic"
                src={ImSoccer}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
            <div className="mt-10 md:mt-0 md:basis-2/5">
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