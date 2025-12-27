import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { SelectedPage } from "@/shared/types";
import { API_URL } from "@/lib/config";

type Props = {
  setSelectedPage: (value: SelectedPage) => void;
};

type Workout = {
  id: number;
  type: "cardio" | "gym";
  activity: string;
  date: string;
  duration: number | null;
  username: string;
};

const RecentWorkouts = ({ setSelectedPage }: Props) => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentWorkouts = async () => {
      try {
        const response = await fetch(`${API_URL}/api/posts/recent-workouts/`);
        const data = await response.json();
        setWorkouts(data.workouts || []);
      } catch (error) {
        console.error("Error fetching recent workouts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentWorkouts();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return "Yesterday";
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <section id="recentworkouts" className="w-full bg-primary-100 py-20">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          onViewportEnter={() => setSelectedPage(SelectedPage.Home)}
        >
          {/* Header */}
          <motion.div
            className="w-full flex flex-col items-center text-center mb-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5 }}
            variants={{
              hidden: { opacity: 0, x: 50 },
              visible: { opacity: 1, x: 0 },
            }}
          >
            <h1 className="text-4xl font-bold text-primary-500">
              RECENT ACTIVITY
            </h1>
            <p className="my-5 text-sm">
              See what the community has been up to lately
            </p>
          </motion.div>

          {/* Horizontal Scrolling Workouts */}
          <div className="overflow-x-auto overflow-y-hidden pb-4">
            {loading ? (
              <p className="text-center">Loading recent workouts...</p>
            ) : workouts.length === 0 ? (
              <p className="text-center text-gray-500">No recent workouts yet</p>
            ) : (
              <div className="flex gap-4 min-w-min">
                {workouts.map((workout, index) => (
                  <motion.div
                    key={workout.id}
                    className="flex-shrink-0 w-[350px] border-2 border-gray-200 rounded-lg p-6 bg-white hover:border-primary-300 transition-colors"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    variants={{
                      hidden: { opacity: 0, y: 50 },
                      visible: { opacity: 1, y: 0 },
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              workout.type === "cardio"
                                ? "bg-accent-500 text-white"
                                : "bg-secondary-500 text-white"
                            }`}
                          >
                            {workout.type.toUpperCase()}
                          </span>
                          <span className="text-sm font-bold text-primary-500">
                            @{workout.username}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-800">
                          {workout.activity}
                        </h3>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                          {workout.duration && (
                            <span>{workout.duration} min</span>
                          )}
                          <span>{formatDate(workout.date)}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default RecentWorkouts