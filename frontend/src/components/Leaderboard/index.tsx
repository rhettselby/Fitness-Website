import { SelectedPage } from "@/shared/types";
import HText from "@/shared/HText";
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
        ...(token && { "Authorization": `Bearer ${token} `}),
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (data.leaderboard && Array.isArray(data.leaderboard)) {
          const sortedLeaders = data.leaderboard.slice(0, 5);
          setLeaders(sortedLeaders);
        } else {
          console.error("Unexpected data format:", data);
          setLeaders([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching leaderboard:", error);
        setLeaders([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <section id="leaderboard" className="w-full bg-primary-100 py-40">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          onViewportEnter={() => setSelectedPage(SelectedPage.Leaderboard)}
        >
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: 0.1, duration: 2 }}
            variants={{
              hidden: { opacity: 0, x: -50 },
              visible: { opacity: 1, x: 0 },
            }}
          >
            <div className="md:w-3/5">
              <HText>Weekly Leaderboard 🏆</HText>
              <p className="py-5">
                The top 5 members with the most workouts this week!
              </p>
            </div>
          </motion.div>

          <div className="mt-10 h-[320] overflow-x-auto overflow-y-hidden">
            <div className="flex justify-center">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-lg">Loading leaderboard...</p>
                </div>
              ) : leaders.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-lg">No workouts logged this week yet. Be the first!</p>
                </div>
              ) : (
                <ul className="inline-flex whitespace-nowrap gap-3">
                  {leaders.map((user, index) => (
                    <Class
                      key={`${user.username}-${index}`}
                      name={`#${index + 1} ${user.username}`}
                      description={`${user.count} workout${user.count !== 1 ? 's' : ''}`}
                      image=""
                      bio={user.bio}
                      location={user.location}
                    />
                  ))}
                </ul>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Leaderboard;