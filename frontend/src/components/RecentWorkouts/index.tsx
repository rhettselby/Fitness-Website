import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SelectedPage } from "@/shared/types";
import { API_URL } from "@/lib/config";
import { XMarkIcon, ChatBubbleBottomCenterTextIcon } from "@heroicons/react/24/solid";

type Props = {
  setSelectedPage: (value: SelectedPage) => void;
};

type Workout = {
  comment_count: number;
  id: number;
  type: "cardio" | "gym" | "sport";
  activity: string;
  date: string;
  duration: number | null;
  username: string;
  score: number;
  image_url: string | null;
};

type Comment = {
  id: number;
  user: { username: string };
  text: string;
  created_at: string;
};

// 30% shorter than original 280
const CARD_HEIGHT = 196;
const IMAGE_HEIGHT = Math.floor(CARD_HEIGHT * 0.62); // ~121px
const REMAINING_HEIGHT = CARD_HEIGHT - IMAGE_HEIGHT;  // ~75px
// If remaining after image > 50px show comments strip + input, otherwise just input
const SHOW_COMMENTS_ON_BACK = REMAINING_HEIGHT >= 50;

const RecentWorkouts = ({ setSelectedPage }: Props) => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentLoading, setCommentLoading] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [commentError, setCommentError] = useState<string | null>(null);
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const [cardComments, setCardComments] = useState<Record<number, Comment[]>>({});
  const [cardCommentLoading, setCardCommentLoading] = useState<Record<number, boolean>>({});
  const [cardNewComment, setCardNewComment] = useState<Record<number, string>>({});
  const [cardCommentSubmitting, setCardCommentSubmitting] = useState<Record<number, boolean>>({});

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

  const fetchCommentsForCard = async (workout: Workout) => {
    if (cardComments[workout.id]) return;
    setCardCommentLoading(prev => ({ ...prev, [workout.id]: true }));
    try {
      const response = await fetch(`${API_URL}/api/fitness/api/comments/${workout.type}/${workout.id}/`);
      const data = await response.json();
      if (data.success) {
        setCardComments(prev => ({ ...prev, [workout.id]: data.comments || [] }));
      }
    } catch {
      setCardComments(prev => ({ ...prev, [workout.id]: [] }));
    } finally {
      setCardCommentLoading(prev => ({ ...prev, [workout.id]: false }));
    }
  };

  const handleFlip = (workout: Workout) => {
    const newFlipped = new Set(flippedCards);
    if (newFlipped.has(workout.id)) {
      newFlipped.delete(workout.id);
    } else {
      newFlipped.add(workout.id);
      fetchCommentsForCard(workout);
    }
    setFlippedCards(newFlipped);
  };

  const handleCardCommentSubmit = async (e: React.FormEvent, workout: Workout) => {
    e.preventDefault();
    const text = cardNewComment[workout.id]?.trim();
    if (!text) return;
    setCardCommentSubmitting(prev => ({ ...prev, [workout.id]: true }));
    try {
      const response = await fetch(`${API_URL}/api/fitness/api/comments/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({
          workout_id: workout.id,
          workout_type: workout.type,
          text,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setCardComments(prev => ({ ...prev, [workout.id]: [data.comment, ...(prev[workout.id] || [])] }));
        setCardNewComment(prev => ({ ...prev, [workout.id]: "" }));
      }
    } catch {
      // silently fail on card input
    } finally {
      setCardCommentSubmitting(prev => ({ ...prev, [workout.id]: false }));
    }
  };

  const fetchComments = async (workoutId: number, workoutType: "cardio" | "gym" | "sport") => {
    setCommentLoading(true);
    setCommentError(null);
    try {
      const response = await fetch(`${API_URL}/api/fitness/api/comments/${workoutType}/${workoutId}/`);
      const data = await response.json();
      if (data.success) {
        setComments(data.comments || []);
      } else {
        setCommentError(data.error || "Failed to fetch comments");
      }
    } catch {
      setCommentError("Network error. Please try again.");
    } finally {
      setCommentLoading(false);
    }
  };

  const handleCommentClick = (workout: Workout) => {
    setSelectedWorkout(workout);
    fetchComments(workout.id, workout.type);
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWorkout || !newComment.trim()) return;
    setCommentError(null);
    try {
      const response = await fetch(`${API_URL}/api/fitness/api/comments/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({
          workout_id: selectedWorkout.id,
          workout_type: selectedWorkout.type,
          text: newComment,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setComments([data.comment, ...comments]);
        setNewComment("");
      } else {
        setCommentError(data.error || "Failed to add comment");
      }
    } catch {
      setCommentError("Network error. Please try again.");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const typeColor = (type: string) => {
    if (type === "cardio") return "bg-accent-500 text-white";
    if (type === "sport") return "bg-purple-600 text-white";
    return "bg-secondary-500 text-white";
  };

  return (
    <section id="recentworkouts" className="w-full bg-primary-100 py-16 md:py-20">
      <style>{`
        .card-scene { perspective: 1000px; }
        .card-inner {
          position: relative;
          width: 100%;
          height: ${CARD_HEIGHT}px;
          transition: transform 0.6s cubic-bezier(0.4, 0.2, 0.2, 1);
          transform-style: preserve-3d;
        }
        .card-inner.flipped { transform: rotateY(180deg); }
        .card-face {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          border-radius: 0.75rem;
          overflow: hidden;
        }
        .card-back { transform: rotateY(180deg); }

        @keyframes pulse-btn {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
        .pulse-photo-btn {
          animation: pulse-btn 1.6s ease-in-out infinite;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4">
        <motion.div onViewportEnter={() => setSelectedPage(SelectedPage.Home)}>

          {/* Header */}
          <motion.div
            className="w-full flex flex-col items-center text-center mb-8 md:mb-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5 }}
            variants={{ hidden: { opacity: 0, x: 50 }, visible: { opacity: 1, x: 0 } }}
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-500">
              RECENT ACTIVITY
            </h1>
            <p className="my-4 md:my-5 text-sm text-gray-900">
              See what the community has been up to lately
            </p>
          </motion.div>

          {/* Workout Cards */}
          <div className="overflow-x-auto overflow-y-hidden pb-4 -mx-4 px-4">
            {loading ? (
              <p className="text-center">Loading recent workouts...</p>
            ) : workouts.length === 0 ? (
              <p className="text-center text-gray-500">No recent workouts yet</p>
            ) : (
              <div className="flex gap-3 md:gap-4 min-w-min items-start">
                {workouts.map((workout, index) => {
                  const isFlipped = flippedCards.has(workout.id);
                  const comments_ = cardComments[workout.id] || [];
                  const commentsLoading_ = cardCommentLoading[workout.id];
                  const cardComment = cardNewComment[workout.id] || "";
                  const submitting = cardCommentSubmitting[workout.id];

                  return (
                    <motion.div
                      key={workout.id}
                      className="flex-shrink-0 w-[200px] sm:w-[220px] md:w-[240px] card-scene"
                      style={{ height: CARD_HEIGHT }}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.5 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      variants={{ hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0 } }}
                    >
                      <div className={`card-inner ${isFlipped ? "flipped" : ""}`}>

                        {/* ── FRONT ── */}
                        <div className="card-face border border-gray-200 bg-white shadow-sm flex flex-col justify-between">
                          <div className="px-3 pt-3 flex flex-col gap-1">
                            {/* Username + comment btn */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5 min-w-0">
                                <span className={`px-2 py-0.5 rounded-full text-xs font-bold flex-shrink-0 ${typeColor(workout.type)}`}>
                                  {workout.type.toUpperCase()}
                                </span>
                                <span className="text-sm font-bold text-primary-500 truncate">
                                  @{workout.username}
                                </span>
                              </div>
                              <button
                                onClick={() => handleCommentClick(workout)}
                                className="relative text-primary-500 hover:text-primary-700 transition-colors flex-shrink-0 ml-1"
                                title="View Comments"
                              >
                                <ChatBubbleBottomCenterTextIcon className="h-5 w-5" />
                                {workout.comment_count > 0 && (
                                  <span className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 bg-primary-500/90 text-white text-[9px] font-bold rounded-full h-3.5 w-3.5 flex items-center justify-center">
                                    {workout.comment_count > 9 ? "9+" : workout.comment_count}
                                  </span>
                                )}
                              </button>
                            </div>

                            {/* Activity name — large and bold */}
                            <p className="text-base font-extrabold text-gray-900 truncate leading-tight">
                              {workout.activity}
                            </p>

                            {/* Score + date — prominent */}
                            <div className="flex items-center gap-2">
                              {workout.score > 0 && (
                                <span className="text-sm font-extrabold text-accent-500">{workout.score} pts</span>
                              )}
                              <span className="text-xs text-gray-400">{formatDate(workout.date)}</span>
                              {workout.duration && (
                                <span className="text-xs text-gray-400">{workout.duration}m</span>
                              )}
                            </div>
                          </div>

                          {/* View Photo button */}
                          {workout.image_url && (
                            <div className="px-3 pb-3">
                              <button
                                onClick={() => handleFlip(workout)}
                                className="pulse-photo-btn w-full flex items-center justify-center gap-1.5 bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold py-2 rounded-lg transition-colors"
                              >
                                <span>📷</span>
                                <span>View Photo</span>
                              </button>
                            </div>
                          )}
                        </div>

                        {/* ── BACK ── */}
                        <div className="card-face card-back border border-gray-200 bg-white shadow-sm flex flex-col">

                          {/* Image — fixed height */}
                          <div className="flex-shrink-0 relative" style={{ height: IMAGE_HEIGHT }}>
                            <img
                              src={workout.image_url || ""}
                              alt={workout.activity}
                              className="w-full h-full object-cover"
                            />
                            <button
                              onClick={() => handleFlip(workout)}
                              className="absolute top-1.5 left-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs transition"
                              aria-label="Flip back"
                            >
                              ✕
                            </button>
                          </div>

                          {/* Bottom section — comments + input */}
                          <div className="flex flex-col flex-1 min-h-0" style={{ height: REMAINING_HEIGHT }}>

                            {/* Scrollable comments strip — only if space */}
                            {SHOW_COMMENTS_ON_BACK && (
                              <div className="flex-1 overflow-y-auto px-2 py-1 space-y-0.5 min-h-0">
                                {commentsLoading_ ? (
                                  <p className="text-[9px] text-gray-400 text-center">Loading...</p>
                                ) : comments_.length === 0 ? (
                                  <p className="text-[9px] text-gray-400 text-center pt-0.5">No comments yet</p>
                                ) : (
                                  comments_.map(comment => (
                                    <div key={comment.id} className="leading-tight">
                                      <span className="text-[9px] font-bold text-primary-500">@{comment.user.username} </span>
                                      <span className="text-[9px] text-gray-600">{comment.text}</span>
                                    </div>
                                  ))
                                )}
                              </div>
                            )}

                            {/* Comment input */}
                            <form
                              onSubmit={(e) => handleCardCommentSubmit(e, workout)}
                              className="flex items-center gap-1 px-2 py-1.5 border-t border-gray-100 flex-shrink-0"
                            >
                              <input
                                type="text"
                                value={cardComment}
                                onChange={(e) => setCardNewComment(prev => ({ ...prev, [workout.id]: e.target.value }))}
                                placeholder="Add a comment..."
                                maxLength={200}
                                className="flex-1 text-[10px] text-black placeholder-gray-400 border border-gray-200 rounded-md px-1.5 py-1 focus:outline-none focus:ring-1 focus:ring-primary-400 min-w-0"
                              />
                              <button
                                type="submit"
                                disabled={!cardComment.trim() || submitting}
                                className="flex-shrink-0 bg-primary-500 disabled:bg-gray-300 text-white text-[9px] font-bold px-1.5 py-1 rounded-md transition"
                              >
                                Post
                              </button>
                            </form>
                          </div>
                        </div>

                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

        </motion.div>
      </div>

      {/* Full Comments Modal */}
      <AnimatePresence>
        {selectedWorkout && (
          <motion.div
            className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center px-0 sm:px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => { if (e.target === e.currentTarget) setSelectedWorkout(null); }}
          >
            <motion.div
              className="bg-white rounded-t-2xl sm:rounded-lg w-full sm:w-3/4 md:w-1/2 h-[85vh] sm:h-3/4 flex flex-col"
              initial={{ scale: 0.95, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 40 }}
            >
              <div className="flex justify-between items-center p-4 border-b">
                <div className="flex items-center gap-3 min-w-0">
                  <h2 className="text-base sm:text-xl font-bold text-black truncate">
                    Comments for {selectedWorkout.activity}
                  </h2>
                  <span className="flex-shrink-0 text-xs font-bold text-accent-500 bg-accent-100 px-2 py-0.5 rounded-full">
                    +{selectedWorkout.score} pts
                  </span>
                </div>
                <button onClick={() => setSelectedWorkout(null)} className="text-gray-500 hover:text-gray-900 flex-shrink-0 ml-2">
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto p-4">
                {commentLoading ? (
                  <p className="text-center text-gray-500">Loading comments...</p>
                ) : commentError ? (
                  <p className="text-center text-red-500">{commentError}</p>
                ) : comments.length === 0 ? (
                  <p className="text-center text-gray-400">No comments yet</p>
                ) : (
                  <div className="space-y-3">
                    {comments.map((comment) => (
                      <div key={comment.id} className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex justify-between items-center mb-1 gap-2">
                          <span className="font-bold text-primary-500 text-sm truncate">@{comment.user.username}</span>
                          <span className="text-xs text-gray-500 flex-shrink-0">{formatDate(comment.created_at)}</span>
                        </div>
                        <p className="text-gray-700 text-sm">{comment.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <form onSubmit={handleSubmitComment} className="p-4 border-t flex flex-col gap-2">
                {commentError && <p className="text-red-500 text-sm">{commentError}</p>}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    maxLength={200}
                    className="flex-grow p-2 border rounded-lg text-black text-base focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <button
                    type="submit"
                    disabled={!newComment.trim()}
                    className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 disabled:bg-gray-300 transition whitespace-nowrap"
                  >
                    Send
                  </button>
                </div>
                {newComment.length > 0 && (
                  <span className="text-xs text-gray-500 self-end">{newComment.length}/200</span>
                )}
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default RecentWorkouts;