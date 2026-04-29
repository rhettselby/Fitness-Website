import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SelectedPage } from "@/shared/types";
import { API_URL } from "@/lib/config";
import { TokenService } from "@/utils/auth";
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

const CARD_HEIGHT = 157;

const RecentWorkouts = ({ setSelectedPage }: Props) => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [showPhoto, setShowPhoto] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentLoading, setCommentLoading] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [commentError, setCommentError] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const currentUser = TokenService.getUser();

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

  const handleUploadImage = async (workoutId: number, workoutType: string, file: File) => {
    setUploadingId(workoutId);
    setUploadError(null);
    const formData = new FormData();
    formData.append("image", file);
    try {
      const response = await fetch(`${API_URL}/api/fitness/api/add-image/${workoutId}/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        setWorkouts((prev) =>
          prev.map((w) =>
            w.id === workoutId && w.type === workoutType
              ? { ...w, image_url: data.image_url }
              : w
          )
        );
      } else {
        setUploadError(data.error || "Upload failed");
      }
    } catch (err) {
      console.error("Upload failed:", err);
      setUploadError("Network error. Please try again.");
    } finally {
      setUploadingId(null);
    }
  };

  const handleCommentClick = (workout: Workout) => {
    setSelectedWorkout(workout);
    setShowPhoto(false);
    fetchComments(workout.id, workout.type);
  };

  const handleViewPhoto = (workout: Workout) => {
    setSelectedWorkout(workout);
    setShowPhoto(true);
  };

  const handleCloseModal = () => {
    setSelectedWorkout(null);
    setShowPhoto(false);
    setComments([]);
    setNewComment("");
    setCommentError(null);
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

  const CardTopRow = ({ workout }: { workout: Workout }) => (
    <div className="flex items-center justify-between px-3 pt-3 flex-shrink-0">
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
  );

  const CardMeta = ({ workout }: { workout: Workout }) => (
    <div className="flex flex-col gap-1 px-3">
      <p className="text-base font-extrabold text-gray-900 truncate leading-tight">
        {workout.activity}
      </p>
      <div className="flex items-center gap-2 flex-wrap">
        {workout.score > 0 && (
          <span className="text-sm font-extrabold text-accent-500">{workout.score} pts</span>
        )}
        <span className="text-xs text-gray-400">{formatDate(workout.date)}</span>
        {workout.duration && (
          <span className="text-xs text-gray-400">{workout.duration}m</span>
        )}
      </div>
    </div>
  );

  const CardBottomRow = ({ workout: initialWorkout }: { workout: Workout }) => {
    const workout = workouts.find((w) => w.id === initialWorkout.id && w.type === initialWorkout.type) ?? initialWorkout;
    const isOwner = currentUser?.username === workout.username;
    const isUploading = uploadingId === workout.id;

    if (workout.image_url) {
      return (
        <button
          onClick={() => handleViewPhoto(workout)}
          className="pulse-photo-btn w-full flex items-center justify-center gap-1.5 bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold py-2 rounded-lg transition-colors"
        >
          <span>📷</span>
          <span>View Photo</span>
        </button>
      );
    }

    if (isOwner) {
      return (
        <label className="w-full flex items-center justify-center gap-1.5 bg-primary-500 hover:bg-primary-600 active:scale-95 text-white text-sm font-semibold py-2 rounded-lg cursor-pointer transition-all shadow-sm">
          {isUploading ? (
            <span className="text-xs text-white font-medium">Uploading...</span>
          ) : (
            <>
              <span className="text-sm">📷</span>
              <span className="text-sm font-bold">Add Photo</span>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            disabled={isUploading}
            onChange={(e) => {
              if (e.target.files?.[0]) {
                handleUploadImage(workout.id, workout.type, e.target.files[0]);
              }
            }}
          />
        </label>
      );
    }

    return (
      <div className="w-full flex items-center justify-center gap-1.5 border-2 border-dashed border-gray-200 rounded-lg py-2">
        <span className="text-sm text-gray-300">📷</span>
        <span className="text-xs text-gray-300 font-medium">No photo added</span>
      </div>
    );
  };

  return (
    <section id="recentworkouts" className="w-full bg-primary-100 py-16 md:py-20">
      <style>{`
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

          {/* Upload error toast */}
          <AnimatePresence>
            {uploadError && (
              <motion.div
                className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm text-center"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {uploadError}
                <button onClick={() => setUploadError(null)} className="ml-2 font-bold">×</button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Workout Cards */}
          <div className="overflow-x-auto overflow-y-hidden pb-4 -mx-4 px-4">
            {loading ? (
              <p className="text-center">Loading recent workouts...</p>
            ) : workouts.length === 0 ? (
              <p className="text-center text-gray-500">No recent workouts yet</p>
            ) : (
              <div className="flex gap-3 md:gap-4 min-w-min items-start">
                {workouts.map((workout, index) => (
                  <motion.div
                    key={workout.id}
                    className="flex-shrink-0 w-[200px] sm:w-[220px] md:w-[240px] border border-gray-200 rounded-xl bg-white shadow-sm hover:border-primary-300 transition-colors overflow-hidden flex flex-col"
                    style={{ height: CARD_HEIGHT }}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    variants={{ hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0 } }}
                  >
                    <CardTopRow workout={workout} />

                    <div className="flex-1 flex flex-col justify-center">
                      <CardMeta workout={workout} />
                    </div>

                    <div className="px-3 pb-3 flex-shrink-0">
                      <CardBottomRow workout={workout} />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

        </motion.div>
      </div>

      {/* Photo-only Modal */}
      <AnimatePresence>
        {selectedWorkout && showPhoto && (
          <motion.div
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => { if (e.target === e.currentTarget) handleCloseModal(); }}
          >
            <motion.div
              className="relative w-full max-w-2xl"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <button
                onClick={handleCloseModal}
                className="absolute -top-10 right-0 text-white hover:text-gray-300 transition"
              >
                <XMarkIcon className="h-7 w-7" />
              </button>
              <img
                src={selectedWorkout.image_url!}
                alt={selectedWorkout.activity}
                className="w-full max-h-[80vh] object-contain rounded-lg"
              />
              <p className="text-white text-center text-sm mt-3 font-semibold">
                {selectedWorkout.activity} — @{selectedWorkout.username}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comments Modal */}
      <AnimatePresence>
        {selectedWorkout && !showPhoto && (
          <motion.div
            className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center px-0 sm:px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => { if (e.target === e.currentTarget) handleCloseModal(); }}
          >
            <motion.div
              className="bg-white rounded-t-2xl sm:rounded-lg w-full sm:w-3/4 md:w-1/2 h-[85vh] sm:h-3/4 flex flex-col"
              initial={{ scale: 0.95, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 40 }}
            >
              {/* Modal Header */}
              <div className="flex justify-between items-center p-4 border-b flex-shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  <h2 className="text-base sm:text-xl font-bold text-black truncate">
                    {selectedWorkout.activity}
                  </h2>
                  <span className="flex-shrink-0 text-xs font-bold text-accent-500 bg-accent-100 px-2 py-0.5 rounded-full">
                    +{selectedWorkout.score} pts
                  </span>
                </div>
                <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-900 flex-shrink-0 ml-2">
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              {/* Comments List */}
              <div className="flex-grow overflow-y-auto p-4">
                {commentLoading ? (
                  <p className="text-center text-gray-400">Loading comments...</p>
                ) : commentError ? (
                  <p className="text-center text-red-500">{commentError}</p>
                ) : comments.length === 0 ? (
                  <p className="text-center text-gray-400">No comments yet</p>
                ) : (
                  <div className="space-y-3">
                    {comments.map((comment) => (
                      <div key={comment.id} className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex justify-between items-center mb-1 gap-2">
                          <span className="font-bold text-primary-500 text-sm truncate">
                            @{comment.user.username}
                          </span>
                          <span className="text-xs text-gray-400 flex-shrink-0">
                            {formatDate(comment.created_at)}
                          </span>
                        </div>
                        <p className="text-gray-700 text-sm">{comment.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Comment Input */}
              <form onSubmit={handleSubmitComment} className="p-4 border-t flex flex-col gap-2 flex-shrink-0">
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