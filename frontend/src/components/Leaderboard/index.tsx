import { SelectedPage } from "@/shared/types";
import { motion } from "framer-motion";
import Class from "./Class";
import { useEffect, useState } from "react";
import { API_URL } from "@/lib/config";
import { TokenService } from "@/utils/auth";

type LeaderboardUser = {
  username: string;
  count: number;
  bio?: string | null;
  location?: string | null;
};

type Props = {
  setSelectedPage: (value: SelectedPage) => void;
};

const Leaderboard = ({ setSelectedPage }: Props) => {
  const [leaders, setLeaders] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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
              <h1 className="font-montserrat text-2xl sm:text-3xl font-bold text-gray-900">
                Weekly Leaderboard 🏆
              </h1>
              <p className="py-4 md:py-5 text-gray-900 font-semibold text-sm sm:text-base">
                The top 5 members with the most workouts this week!
              </p>
            </div>
          </motion.div>

          {/* ── Cards ── */}
          <div className="mt-6 md:mt-10">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <p className="text-lg">Loading leaderboard...</p>
              </div>
            ) : leaders.length === 0 ? (
              <div className="flex items-center justify-center py-16">
                <p className="text-lg text-center">
                  No workouts logged this week yet. Be the first!
                </p>
              </div>
            ) : (
              <>
                {/* Mobile: 2-col grid */}
                <div className="grid grid-cols-2 gap-4 sm:hidden">
                  {leaders.map((user, index) => (
                    <Class
                      key={`${user.username}-${index}`}
                      name={`#${index + 1} ${user.username}`}
                      description={`${user.count} workout${user.count !== 1 ? "s" : ""}`}
                      image=""
                      bio={user.bio}
                      location={user.location}
                      rank={index + 1}
                    />
                  ))}
                </div>

                {/* sm+: horizontal scroll row (original behaviour) */}
                <div className="hidden sm:flex justify-center overflow-x-auto pb-2">
                  <ul className="inline-flex whitespace-nowrap gap-3">
                    {leaders.map((user, index) => (
                      <Class
                        key={`${user.username}-${index}`}
                        name={`#${index + 1} ${user.username}`}
                        description={`${user.count} workout${user.count !== 1 ? "s" : ""}`}
                        image=""
                        bio={user.bio}
                        location={user.location}
                        rank={index + 1}
                      />
                    ))}
                  </ul>
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