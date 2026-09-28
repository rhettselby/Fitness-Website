import { SelectedPage } from "@/shared/types";
import { motion } from "framer-motion";
import Class from "./Class";
import { useEffect, useState } from "react";
import { API_URL } from "@/lib/config";
import { TokenService } from "@/utils/auth";
import HistoryNav from "@/components/LeaderboardHistory/HistoryNav";
import { useLeaderboardHistory } from "@/hooks/useLeaderboardHistory";

type LeaderboardUser = {
  username: string;
  score: number;
  bio?: string | null;
  location?: string | null;
};

type Card = {
  key: string;
  rank: number;
  name: string;
  description: string;
  bio?: string | null;
  location?: string | null;
};

type Props = {
  setSelectedPage: (value: SelectedPage) => void;
};

const Leaderboard = ({ setSelectedPage }: Props) => {
  const [leaders, setLeaders] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  // History endpoints need a login, so the History button only shows to signed-in users.
  const history = useLeaderboardHistory("/api/leaderboard/history");
  const loggedIn = !!TokenService.getAccessToken();

  useEffect(() => {
    setLoading(true);
    const token = TokenService.getAccessToken();

    fetch(`${API_URL}/api/leaderboard/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data.leaderboard && Array.isArray(data.leaderboard)) {
          setLeaders(data.leaderboard.slice(0, 5));
        } else {
          setLeaders([]);
        }
      })
      .catch(() => setLeaders([])
      )
      .finally(() => setLoading(false));
  }, []);

  // Live and past weeks render through the same cards; past weeks carry no bio/location.
  const cards: Card[] = history.open
    ? (history.week?.leaderboard ?? []).slice(0, 5).map((entry) => ({
        key: entry.user,
        rank: entry.rank,
        name: `#${entry.rank} ${entry.user}`,
        description: `${entry.score} pts`,
      }))
    : leaders.map((user, index) => ({
        key: user.username,
        rank: index + 1,
        name: `#${index + 1} ${user.username}`,
        description: `${user.score} pts`,
        bio: user.bio,
        location: user.location,
      }));

  const cardElements = cards.map((card) => (
    <Class
      key={card.key}
      name={card.name}
      description={card.description}
      image=""
      bio={card.bio}
      location={card.location}
      rank={card.rank}
    />
  ));

  const showLoading = history.open ? history.loading : loading;

  return (
    <section id="leaderboard" className="w-full bg-primary-100 py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div onViewportEnter={() => setSelectedPage(SelectedPage.Leaderboard)}>

          {/* ── Header ── */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: 0.1, duration: 2 }}
            variants={{
              hidden: { opacity: 0, x: 50 },
              visible: { opacity: 1, x: 0 },
            }}
          >
            <div className="w-full flex flex-col items-center text-center">
              <div className="flex flex-wrap items-center justify-center gap-3">
                <h1 className="font-montserrat text-2xl sm:text-3xl font-bold text-gray-900">
                  Weekly Leaderboard 🏆
                </h1>
                {loggedIn && <HistoryNav history={history} />}
              </div>
              <p className="py-4 md:py-5 text-gray-900 font-semibold text-sm sm:text-base">
                {history.open
                  ? "The top 5 members from that week."
                  : "The top 5 members with the most points this week!"}
              </p>

              {/* Scoring breakdown */}
              <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-2">
                {[
                  { label: "🏃 Cardio", value: "100 pts + 1pt/min" },
                  { label: "🏋️ Gym",    value: "100 pts" },
                  { label: "⚽ Sport",  value: "50 pts" },
                  { label: "📸 Photo verified", value: "+50 pts" },
                  { label: "⌚ Wearable intensity", value: "bonus pts" },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="flex items-center gap-1.5 bg-white/70 border border-primary-300 rounded-full px-3 py-1 text-xs font-medium text-gray-700 shadow-sm"
                  >
                    <span>{label}</span>
                    <span className="font-extrabold text-primary-500">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ── Cards ── */}
          <div className="mt-6 md:mt-10">
            {showLoading ? (
              <div className="flex items-center justify-center py-16">
                <p className="text-lg">Loading leaderboard...</p>
              </div>
            ) : history.open && history.error ? (
              <div className="flex items-center justify-center py-16">
                <p className="text-lg text-center text-red-500">{history.error}</p>
              </div>
            ) : cards.length === 0 ? (
              <div className="flex items-center justify-center py-16">
                <p className="text-lg text-center">
                  {history.open
                    ? "No history yet — the first week is saved on Monday."
                    : "No workouts logged this week yet. Be the first!"}
                </p>
              </div>
            ) : (
              <>
                {/* Mobile: 2-col grid */}
                <div className="grid grid-cols-2 gap-4 sm:hidden">{cardElements}</div>

                {/* sm+: horizontal scroll row (original behaviour) */}
                <div className="hidden sm:flex justify-center overflow-x-auto pb-2">
                  <ul className="inline-flex whitespace-nowrap gap-3">{cardElements}</ul>
                </div>
              </>
            )}
          </div>

        </motion.div>
      </div>
    </section>
  );
};

export default Leaderboard;
