import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { API_URL } from "@/lib/config";
import { TokenService } from "@/utils/auth";
import { motion, AnimatePresence } from "framer-motion";

type LeaderboardEntry = {
  rank: number;
  user: string;
  score: number;
};

// Pyramid layout: bottom row (ranks 4,5,6), middle row (ranks 2,3), top (rank 1)
// Reveal order: bottom-left → bottom-right → bottom-center → middle-left → middle-right → top
const PYRAMID_ROWS = [
  { ranks: [4, 5, 6], revealOrder: [0, 2, 1] }, // bottom row: reveal left, right, center
  { ranks: [2, 3],    revealOrder: [0, 1] },      // middle row
  { ranks: [1],       revealOrder: [0] },          // top
];

const RANK_MEDALS: Record<number, string> = { 1: "🥇", 2: "🥈", 3: "🥉" };

const REVEAL_DELAY_MS = 1200; // ms between each card reveal

const rankAccent = (rank: number) => {
  if (rank === 1) return { border: "border-yellow-400", glow: "shadow-yellow-300", bg: "from-yellow-50 to-amber-100", text: "text-yellow-700" };
  if (rank === 2) return { border: "border-gray-400",   glow: "shadow-gray-300",   bg: "from-gray-50 to-slate-100",  text: "text-gray-600"   };
  if (rank === 3) return { border: "border-amber-600",  glow: "shadow-amber-300",  bg: "from-amber-50 to-orange-100",text: "text-amber-700"  };
  return            { border: "border-primary-200",     glow: "shadow-primary-100",bg: "from-primary-50 to-teal-50", text: "text-primary-600" };
};

/* ── Single pyramid card ── */
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
    <div
      className={`${sizeClasses[size]} relative`}
      style={{ perspective: "800px" }}
    >
      <motion.div
        className="w-full h-full relative"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: revealed ? 0 : 180 }}
        initial={{ rotateY: 180 }}
        transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* ── Back face (blurred silhouette) ── */}
        <div
          className="absolute inset-0 rounded-2xl border-2 border-gray-300 bg-gradient-to-br from-gray-200 to-gray-300 flex flex-col items-center justify-center overflow-hidden"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          {/* blurred ghost silhouette */}
          <div className="flex flex-col items-center gap-1 opacity-40 blur-[3px] select-none pointer-events-none">
            <div className="w-10 h-10 rounded-full bg-gray-500" />
            <div className="w-16 h-2 rounded bg-gray-500 mt-1" />
            <div className="w-10 h-2 rounded bg-gray-400 mt-1" />
          </div>
          <span className="absolute bottom-2 text-gray-400 text-lg">?</span>
        </div>

        {/* ── Front face ── */}
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

/* ── Main component ── */
const GroupLeaderboard = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const groupName = (location.state as { groupName?: string })?.groupName || `Group ${id}`;

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // revealedCount tracks how many cards have been flipped so far
  const [revealedCount, setRevealedCount] = useState(0);
  const [replayKey, setReplayKey] = useState(0);

  useEffect(() => {
    const token = TokenService.getAccessToken();
    if (!token) { navigate("/"); return; }
    fetchLeaderboard();
  }, [id]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    setError("");
    const token = TokenService.getAccessToken();
    try {
      const res = await fetch(`${API_URL}/groups/get_leaderboard/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setLeaderboard(data.leaderboard || []);
    } catch {
      setError("Failed to load leaderboard. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Start the sequential reveal once data is loaded
  useEffect(() => {
    if (loading || leaderboard.length === 0) return;
    setRevealedCount(0);
    const order = [4, 6, 5, 2, 3, 1].filter((r) =>
      leaderboard.some((e) => e.rank === r)
    );
    const pyramidTotal = order.length;
    let count = 0;
    const interval = setInterval(() => {
      count += 1;
      setRevealedCount(count);
      if (count >= pyramidTotal) clearInterval(interval);
    }, REVEAL_DELAY_MS);
    return () => clearInterval(interval);
  }, [loading, leaderboard, replayKey]);

  // Reveal only ranks that actually exist, in bottom-up dramatic order
  const fullRevealOrder = [4, 6, 5, 2, 3, 1];
  const presentRanks = new Set(leaderboard.map((e) => e.rank));
  const revealSequence = fullRevealOrder.filter((r) => presentRanks.has(r));

  const isRevealed = (rank: number) => {
    const step = revealSequence.indexOf(rank);
    return step !== -1 && step < revealedCount;
  };

  const entryByRank = (rank: number): LeaderboardEntry | null =>
    leaderboard.find((e) => e.rank === rank) || null;

  const restOfList = leaderboard.filter((e) => e.rank > 6);

  return (
    <section className="w-full bg-primary-100 min-h-screen py-20 px-4">
      <button
        onClick={() => navigate("/groups")}
        className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-primary-500 transition mb-8"
      >
        ← Back to Groups
      </button>

      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h1 className="font-montserrat text-3xl sm:text-4xl font-bold text-gray-900">
            {groupName} 🏆
          </h1>
          <p className="mt-2 text-gray-600 font-medium text-sm sm:text-base">
            Top members ranked by score.
          </p>
          <p className="mt-1 text-gray-400 text-xs">Group ID: {id}</p>
        </motion.div>

        {/* Pyramid */}
        {loading ? (
          <div className="flex flex-col items-center gap-2">
            {[3, 2, 1].map((n, i) => (
              <div key={i} className="flex gap-3">
                {Array.from({ length: n }).map((_, j) => (
                  <div key={j} className="w-28 h-32 rounded-2xl bg-gray-200 animate-pulse" />
                ))}
              </div>
            ))}
          </div>
        ) : error ? (
          <p className="text-red-500 text-sm text-center py-8">{error}</p>
        ) : leaderboard.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-8">No members yet.</p>
        ) : (
          <>
            {/* ── Pyramid ── */}
            <div className="flex flex-col items-center gap-3 mb-10">

              {/* Top -- rank 1 */}
              <div className="flex justify-center">
                <PyramidCard entry={entryByRank(1)} revealed={isRevealed(1)} size="lg" />
              </div>

              {/* Middle -- ranks 2, 3 */}
              {leaderboard.length >= 2 && (
                <div className="flex justify-center gap-3">
                  {[2, 3].map((rank) => (
                    <PyramidCard key={rank} entry={entryByRank(rank)} revealed={isRevealed(rank)} size="md" />
                  ))}
                </div>
              )}

              {/* Bottom -- ranks 4, 5, 6 */}
              {leaderboard.length >= 4 && (
                <div className="flex justify-center gap-3">
                  {[4, 5, 6].map((rank) => (
                    <PyramidCard key={rank} entry={entryByRank(rank)} revealed={isRevealed(rank)} size="sm" />
                  ))}
                </div>
              )}
            </div>

            {/* Replay button */}
            <div className="flex justify-center mb-8">
              <button
                onClick={() => {
                  setRevealedCount(0);
                  setReplayKey((k) => k + 1);
                }}
                className="px-5 py-2 text-sm font-semibold text-primary-600 border-2 border-primary-300 rounded-full hover:bg-primary-200 transition active:scale-95"
              >
                ↺ Replay Reveal
              </button>
            </div>

            {/* Rest of the list (rank 7+) */}
            <AnimatePresence>
              {restOfList.length > 0 && revealedCount >= Math.min(leaderboard.length, 6) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white border-2 border-gray-200 rounded-2xl p-5 shadow-sm"
                >
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
                    The Rest
                  </h3>
                  <div className="flex flex-col gap-2">
                    {restOfList.map((entry, i) => (
                      <motion.div
                        key={entry.user}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="flex items-center justify-between px-4 py-2.5 rounded-xl border-2 border-gray-100 bg-gray-50"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-gray-400 w-5">#{entry.rank}</span>
                          <p className="font-semibold text-gray-800 text-sm">{entry.user}</p>
                        </div>
                        <span className="text-xs font-semibold text-primary-500">{entry.score} pts</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </section>
  );
};

export default GroupLeaderboard;