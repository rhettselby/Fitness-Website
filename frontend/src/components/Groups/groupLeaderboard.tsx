import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { API_URL } from "@/lib/config";
import { TokenService } from "@/utils/auth";
import { motion } from "framer-motion";
import Class from "@/components/Leaderboard/Class";

type LeaderboardEntry = {
  rank: number;
  user: string;
  score: number;
};

const GroupLeaderboard = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const groupName = (location.state as { groupName?: string })?.groupName || `Group ${id}`;

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = TokenService.getAccessToken();
    if (!token) {
      navigate("/");
      return;
    }
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

  return (
    <section className="w-full bg-primary-100 min-h-screen py-24 px-4">
      <button
        onClick={() => navigate("/groups")}
        className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-primary-500 transition mb-6"
      >
        ← Back to Groups
      </button>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h1 className="font-montserrat text-3xl sm:text-4xl font-bold text-gray-900">
            {groupName} 🏆
          </h1>
          <p className="mt-3 text-gray-700 font-semibold text-sm sm:text-base">
            Top members ranked by score.
          </p>
          <p className="mt-1 text-gray-500 text-xs">
            Group ID: {id}
          </p>
        </motion.div>

        {/* Leaderboard */}
        <div className="bg-white border-2 border-gray-200 rounded-lg p-5 sm:p-6">
          {loading ? (
            <p className="text-gray-500 text-sm text-center py-8">Loading leaderboard...</p>
          ) : error ? (
            <p className="text-red-500 text-sm text-center py-8">{error}</p>
          ) : leaderboard.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-8">No members in this group yet.</p>
          ) : (
            <>
              {/* Mobile: 2-col grid */}
              <div className="grid grid-cols-2 gap-4 sm:hidden">
                {leaderboard.map((entry) => (
                  <Class
                    key={entry.user}
                    name={`#${entry.rank} ${entry.user}`}
                    description={`Score: ${entry.score}`}
                    image=""
                    rank={entry.rank}
                  />
                ))}
              </div>

              {/* sm+: horizontal scroll row */}
              <div className="hidden sm:flex justify-center overflow-x-auto pb-2">
                <ul className="inline-flex whitespace-nowrap gap-3">
                  {leaderboard.map((entry) => (
                    <Class
                      key={entry.user}
                      name={`#${entry.rank} ${entry.user}`}
                      description={`Score: ${entry.score}`}
                      image=""
                      rank={entry.rank}
                    />
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default GroupLeaderboard;