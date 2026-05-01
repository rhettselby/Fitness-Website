import { type BenefitType, SelectedPage } from "@/shared/types";
import { LinkIcon, UserGroupIcon, ChartBarIcon } from "@heroicons/react/24/solid";
import { motion, AnimatePresence } from "framer-motion";
import { HText } from "@/shared/HText";
import Benefit from "./Benefit";
import ActionButton from "@/shared/ActionButton";
import ImSoccer from "@/assets/IMSOCCER.png";
import { useEffect, useState } from "react";
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
  setSelectedPage: (value: SelectedPage) => void;
};

/* ── Pyramid card ── */
const rankAccent = (rank: number) => {
  if (rank === 1) return { border: "border-yellow-400", glow: "shadow-yellow-300", bg: "from-yellow-50 to-amber-100",   text: "text-yellow-700" };
  if (rank === 2) return { border: "border-gray-400",   glow: "shadow-gray-300",   bg: "from-gray-50 to-slate-100",    text: "text-gray-600"   };
  if (rank === 3) return { border: "border-amber-600",  glow: "shadow-amber-300",  bg: "from-amber-50 to-orange-100",  text: "text-amber-700"  };
  return            { border: "border-slate-400",       glow: "shadow-slate-300",  bg: "from-slate-100 to-slate-200",  text: "text-slate-600"  };
};

const PyramidCard = ({
  entry,
  revealed,
  size = "md",
}: {
  entry: LeaderboardEntry | null;
  revealed: boolean;
  size?: "sm" | "md" | "lg";
}) => {
  const sizeClasses = {
    sm: "w-24 h-28 sm:w-28 sm:h-32 text-xs",
    md: "w-28 h-32 sm:w-32 sm:h-36 text-xs sm:text-sm",
    lg: "w-32 h-36 sm:w-40 sm:h-44 text-sm sm:text-base",
  };
  const accent = entry ? rankAccent(entry.rank) : rankAccent(99);

  return (
    <div className={`${sizeClasses[size]} relative`} style={{ perspective: "800px" }}>
      <motion.div
        className="w-full h-full relative"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: revealed ? 0 : 180 }}
        initial={{ rotateY: 180 }}
        transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Back face */}
        <div
          className="absolute inset-0 rounded-2xl border-2 border-gray-300 bg-gradient-to-br from-gray-200 to-gray-300 flex flex-col items-center justify-center overflow-hidden"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div className="flex flex-col items-center gap-1 opacity-40 blur-[3px] select-none pointer-events-none">
            <div className="w-10 h-10 rounded-full bg-gray-500" />
            <div className="w-16 h-2 rounded bg-gray-500 mt-1" />
            <div className="w-10 h-2 rounded bg-gray-400 mt-1" />
          </div>
          <span className="absolute bottom-2 text-gray-400 text-lg">?</span>
        </div>
        {/* Front face */}
        <div
          className={`absolute inset-0 rounded-2xl border-2 ${accent.border} bg-gradient-to-br ${accent.bg} flex flex-col items-center justify-center gap-1 shadow-lg ${accent.glow} p-2`}
          style={{ backfaceVisibility: "hidden" }}
        >
          {entry && (
            <>
              {RANK_MEDALS[entry.rank] ? (
                <span className="text-2xl sm:text-3xl leading-none">{RANK_MEDALS[entry.rank]}</span>
              ) : (
                <span className={`font-black text-lg sm:text-xl ${accent.text}`}>#{entry.rank}</span>
              )}
              <p className="font-bold text-gray-900 text-center leading-tight break-all px-1" style={{ fontSize: "clamp(0.65rem, 2vw, 0.85rem)" }}>
                {entry.user}
              </p>
              <p className={`font-semibold ${accent.text} text-center`} style={{ fontSize: "clamp(0.6rem, 1.5vw, 0.75rem)" }}>
                {entry.score} pts
              </p>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

const Benefits = ({ setSelectedPage }: Props) => {
  const navigate = useNavigate();
  const isAuthenticated = !!TokenService.getAccessToken();

  const [defaultGroup, setDefaultGroup] = useState<Group | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loadingGroup, setLoadingGroup] = useState(true);
  const [noGroups, setNoGroups] = useState(false);
  const [revealedCount, setRevealedCount] = useState(0);

  useEffect(() => {
    const token = TokenService.getAccessToken();
    if (!token) {
      setLoadingGroup(false);
      return;
    }
    fetchDefaultGroup();
  }, []);

  useEffect(() => {
    if (loadingGroup || leaderboard.length === 0) return;
    const order = [6, 5, 4, 3, 2, 1].filter((r) =>
      leaderboard.some((e) => e.rank === r)
    );
    let count = 0;
    const scheduleNext = () => {
      const isLast = count + 1 >= order.length;
      const delay = isLast ? 900 : 400; // fast for all except rank 1
      setTimeout(() => {
        count += 1;
        setRevealedCount(count);
        if (count < order.length) scheduleNext();
      }, delay);
    };
    scheduleNext();
  }, [loadingGroup, leaderboard]);

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
      setDefaultGroup(groups[0]);
      await fetchLeaderboard(groups[0].id);
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
      setLeaderboard(data.leaderboard || []);
    } catch {
      setLeaderboard([]);
    } finally {
      setLoadingGroup(false);
    }
  };

  const fullRevealOrder = [6, 5, 4, 3, 2, 1];
  const presentRanks = new Set(leaderboard.map((e) => e.rank));
  const revealSequence = fullRevealOrder.filter((r) => presentRanks.has(r));
  const isRevealed = (rank: number) => {
    const step = revealSequence.indexOf(rank);
    return step !== -1 && step < revealedCount;
  };
  const entryByRank = (rank: number): LeaderboardEntry | null =>
    leaderboard.find((e) => e.rank === rank) || null;
  const restOfList = leaderboard.filter((e) => e.rank > 6);

  // ── Logged-in: show group pyramid ──
  if (isAuthenticated) {
    return (
      <section id="benefits" className="hidden md:block w-full py-16 md:py-20 bg-gray-900 col-span-full" style={{ gridColumn: "1 / -1" }}>
        <div className="max-w-2xl mx-auto px-4">
          <motion.div onViewportEnter={() => setSelectedPage(SelectedPage.Home)}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5 }}
            >
              {/* Header */}
              <div className="flex items-end justify-between mb-8">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-white">
                    {defaultGroup ? `${defaultGroup.name} 🏆` : "Your Group 🏆"}
                  </h1>
                  {defaultGroup?.motto && (
                    <p className="mt-1 text-sm text-gray-400">{defaultGroup.motto}</p>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  {defaultGroup && (
                    <button
                      onClick={() =>
                        navigate(`/groups/${defaultGroup.id}/leaderboard`, {
                          state: { groupName: defaultGroup.name },
                        })
                      }
                      className="text-sm font-bold text-primary-400 hover:text-primary-300 underline transition"
                    >
                      Full leaderboard →
                    </button>
                  )}
                  <button
                    onClick={() => navigate("/groups")}
                    className="text-sm font-semibold text-gray-500 hover:text-gray-300 transition"
                  >
                    All groups
                  </button>
                </div>
              </div>

              {/* Content */}
              {loadingGroup ? (
                <div className="flex flex-col items-center gap-3">
                  {[3, 2, 1].map((n, i) => (
                    <div key={i} className="flex gap-3">
                      {Array.from({ length: n }).map((_, j) => (
                        <div key={j} className="w-28 h-32 rounded-2xl bg-gray-200 animate-pulse" />
                      ))}
                    </div>
                  ))}
                </div>
              ) : noGroups ? (
                <div className="flex flex-col items-center justify-center py-16 gap-4 border-2 border-dashed border-gray-700 rounded-2xl">
                  <p className="text-4xl">🏃</p>
                  <p className="text-white font-semibold text-base">You're not in any groups yet</p>
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
                <>
                  {/* Pyramid */}
                  <div className="flex flex-col items-center gap-3 mb-10">
                    <div className="flex justify-center">
                      <PyramidCard entry={entryByRank(1)} revealed={isRevealed(1)} size="lg" />
                    </div>
                    {leaderboard.length >= 2 && (
                      <div className="flex justify-center gap-3">
                        {[2, 3].map((rank) => (
                          <PyramidCard key={rank} entry={entryByRank(rank)} revealed={isRevealed(rank)} size="md" />
                        ))}
                      </div>
                    )}
                    {leaderboard.length >= 4 && (
                      <div className="flex justify-center gap-3">
                        {[4, 5, 6].map((rank) => (
                          <PyramidCard key={rank} entry={entryByRank(rank)} revealed={isRevealed(rank)} size="sm" />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Rest of list */}
                  <AnimatePresence>
                    {restOfList.length > 0 && revealedCount >= Math.min(leaderboard.length, 6) && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-gray-900 border-2 border-gray-700 rounded-2xl p-5 shadow-sm"
                      >
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">The Rest</h3>
                        <div className="flex flex-col gap-2">
                          {restOfList.map((entry, i) => (
                            <motion.div
                              key={entry.user}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.08 }}
                              className="flex items-center justify-between px-4 py-2.5 rounded-xl border-2 border-gray-700 bg-gray-800"
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-xs font-bold text-gray-500 w-5">#{entry.rank}</span>
                                <p className="font-semibold text-gray-100 text-sm">{entry.user}</p>
                              </div>
                              <span className="text-xs font-semibold text-primary-400">{entry.score} pts</span>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>
    );
  }

  // ── Logged-out: original About section ──
  return (
    <section id="benefits" className="hidden md:block w-full min-h-full py-16 md:py-20 bg-gray-20">
      <div className="mx-auto w-5/6">
        <motion.div onViewportEnter={() => setSelectedPage(SelectedPage.Home)}>
          <motion.div
            className="md:my-5 md:w-3/5"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 2 }}
            variants={{ hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0 } }}
          >
            <HText>About</HText>
            <p className="my-4 md:my-5 text-sm text-white">
              Why join the Fitness Community?
            </p>
          </motion.div>

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

          <div className="mt-16 md:mt-28 md:flex md:items-center md:justify-between md:gap-20">
            <div className="flex justify-center md:basis-3/5">
              <img
                className="w-full max-w-xs sm:max-w-sm md:max-w-md"
                alt="benefits-page-graphic"
                src={ImSoccer}
                onError={(e) => { e.currentTarget.style.display = "none"; }}
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
                    variants={{ hidden: { opacity: 0, x: 50 }, visible: { opacity: 1, x: 0 } }}
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
                variants={{ hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0 } }}
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