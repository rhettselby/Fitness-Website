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
  verified: boolean;
};

type Comment = {
  id: number;
  user: { username: string };
  text: string;
  created_at: string;
};

const CARD_HEIGHT = 157;

// Small looping animations shown on no-photo cards. The specific cartoon is
// chosen by keyword-matching the activity name; anything unmatched falls back
// to the workout type's default (heartbeat for cardio, ball for sport). Gym
// always uses the dumbbell.
const WorkoutToon = ({ type, activity }: { type: Workout["type"]; activity: string }) => {
  const a = (activity || "").toLowerCase();

  const heartbeat = (
    <svg width="54" height="54" viewBox="0 0 60 60" aria-hidden="true">
      <circle className="toon-ring" cx="30" cy="30" r="18" fill="none" stroke="#D85A30" strokeWidth="2" />
      <circle className="toon-ring toon-ring-d" cx="30" cy="30" r="18" fill="none" stroke="#D85A30" strokeWidth="2" />
      <path className="toon-beat" d="M30 43 C12 29 18 13 30 23 C42 13 48 29 30 43 Z" fill="#D85A30" />
    </svg>
  );

  const soccer = (
    <svg width="52" height="52" viewBox="0 0 60 60" aria-hidden="true">
      <ellipse className="toon-bsh" cx="30" cy="52" rx="13" ry="3" fill="#9333EA" />
      <g transform="translate(30 26)">
        <g className="toon-ball">
          <circle r="13" fill="#fff" stroke="#6b21a8" strokeWidth="1.5" />
          <polygon points="0,-6.5 6.5,-1.5 4,6.5 -4,6.5 -6.5,-1.5" fill="#6b21a8" />
          <path d="M0 -13 L0 -6.5 M12 -6.5 L6.5 -1.5 M8.5 11 L4 6.5 M-8.5 11 L-4 6.5 M-12 -6.5 L-6.5 -1.5" stroke="#6b21a8" strokeWidth="1.3" fill="none" />
        </g>
      </g>
    </svg>
  );

  const dumbbell = (
    <svg width="62" height="38" viewBox="0 0 84 52" aria-hidden="true">
      <g transform="translate(42 26)">
        <g className="toon-lift">
          <rect x="-24" y="-3" width="48" height="6" rx="3" fill="#3B6370" />
          <rect x="-32" y="-11" width="8" height="22" rx="2" fill="#2A4A55" />
          <rect x="24" y="-11" width="8" height="22" rx="2" fill="#2A4A55" />
          <rect x="-38" y="-8" width="7" height="16" rx="2" fill="#3B6370" />
          <rect x="31" y="-8" width="7" height="16" rx="2" fill="#3B6370" />
        </g>
      </g>
    </svg>
  );

  if (type === "gym") return dumbbell;

  if (/run|jog/.test(a)) {
    return (
      <svg width="56" height="52" viewBox="0 0 64 60" aria-hidden="true">
        <g stroke="#E6B047" strokeWidth="2.4" strokeLinecap="round">
          <line className="toon-fp" x1="4" y1="20" x2="15" y2="20" />
          <line className="toon-fp" style={{ animationDelay: "0.25s" }} x1="2" y1="31" x2="13" y2="31" />
          <line className="toon-fp" style={{ animationDelay: "0.5s" }} x1="6" y1="42" x2="17" y2="42" />
        </g>
        <g transform="translate(30 10)">
          <g className="toon-bob">
            <circle cx="9" cy="5" r="5" fill="#3B6370" />
            <path d="M9 10 L5 27" stroke="#3B6370" strokeWidth="3.4" strokeLinecap="round" fill="none" />
            <path d="M7 15 L17 12 M7 15 L-1 20" stroke="#3B6370" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M5 27 L13 35 M5 27 L-3 37" stroke="#3B6370" strokeWidth="3.2" strokeLinecap="round" fill="none" />
          </g>
        </g>
      </svg>
    );
  }
  if (/walk/.test(a)) {
    return (
      <svg width="52" height="52" viewBox="0 0 58 58" aria-hidden="true">
        <ellipse className="toon-fp" cx="20" cy="16" rx="4" ry="6" transform="rotate(-18 20 16)" fill="#3B6370" />
        <ellipse className="toon-fp" style={{ animationDelay: "0.5s" }} cx="34" cy="30" rx="4" ry="6" transform="rotate(18 34 30)" fill="#3B6370" />
        <ellipse className="toon-fp" style={{ animationDelay: "1s" }} cx="24" cy="44" rx="4" ry="6" transform="rotate(-18 24 44)" fill="#3B6370" />
      </svg>
    );
  }
  if (/hik|trek/.test(a)) {
    return (
      <svg width="60" height="52" viewBox="0 0 64 56" aria-hidden="true">
        <circle className="toon-bob" cx="46" cy="17" r="7" fill="#E6B047" />
        <path d="M6 48 L25 17 L36 34 L44 24 L58 48 Z" fill="#3B6370" />
        <path d="M21 25 L25 17 L29 25 Z" fill="#fff" />
      </svg>
    );
  }
  if (/pilates|yoga|stretch|mobility/.test(a)) {
    return (
      <svg width="52" height="50" viewBox="0 0 58 56" aria-hidden="true">
        <g transform="translate(29 28)">
          <g className="toon-breathe">
            <circle cx="0" cy="-15" r="5.5" fill="#5D9CAC" />
            <path d="M-11 7 Q0 -5 11 7 Q0 13 -11 7 Z" fill="#5D9CAC" />
            <path d="M-3 -7 Q-14 1 -12 7 M3 -7 Q14 1 12 7" stroke="#5D9CAC" strokeWidth="3" fill="none" strokeLinecap="round" />
          </g>
        </g>
      </svg>
    );
  }
  if (/cycl|bike|biking|ride|spin/.test(a)) {
    return (
      <svg width="62" height="49" viewBox="0 0 66 52" aria-hidden="true">
        <g transform="translate(16 36)">
          <g className="toon-spin">
            <circle r="10.5" fill="none" stroke="#3B6370" strokeWidth="2.5" />
            <line x1="-8" y1="0" x2="8" y2="0" stroke="#3B6370" strokeWidth="1.2" />
            <line x1="0" y1="-8" x2="0" y2="8" stroke="#3B6370" strokeWidth="1.2" />
          </g>
        </g>
        <g transform="translate(50 36)">
          <g className="toon-spin">
            <circle r="10.5" fill="none" stroke="#3B6370" strokeWidth="2.5" />
            <line x1="-8" y1="0" x2="8" y2="0" stroke="#3B6370" strokeWidth="1.2" />
            <line x1="0" y1="-8" x2="0" y2="8" stroke="#3B6370" strokeWidth="1.2" />
          </g>
        </g>
        <path d="M16 36 L33 36 L24 21 Z M33 36 L44 21 M24 21 L45 21" fill="none" stroke="#D85A30" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        <line x1="44" y1="21" x2="48" y2="16" stroke="#D85A30" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="21" y1="21" x2="27" y2="21" stroke="#D85A30" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    );
  }
  if (/swim/.test(a)) {
    return (
      <svg width="60" height="49" viewBox="0 0 64 52" aria-hidden="true">
        <g className="toon-wave">
          <path d="M-14 34 Q-7 29 0 34 T14 34 T28 34 T42 34 T56 34 T70 34" fill="none" stroke="#5D9CAC" strokeWidth="2.5" />
          <path d="M-14 43 Q-7 38 0 43 T14 43 T28 43 T42 43 T56 43 T70 43" fill="none" stroke="#9FE1CB" strokeWidth="2.5" />
        </g>
        <circle cx="24" cy="22" r="5" fill="#D85A30" />
        <path className="toon-arm" d="M26 22 L39 14" stroke="#D85A30" strokeWidth="3.2" strokeLinecap="round" />
      </svg>
    );
  }
  if (/\brow/.test(a)) {
    return (
      <svg width="60" height="49" viewBox="0 0 64 52" aria-hidden="true">
        <g className="toon-wave">
          <path d="M-14 42 Q-7 38 0 42 T14 42 T28 42 T42 42 T56 42 T70 42" fill="none" stroke="#5D9CAC" strokeWidth="2.5" />
        </g>
        <path d="M16 33 Q32 43 48 33 L44 29 L20 29 Z" fill="#3B6370" />
        <circle cx="32" cy="25" r="4" fill="#D85A30" />
        <path className="toon-oar" d="M32 27 L48 17" stroke="#D85A30" strokeWidth="2.6" strokeLinecap="round" />
      </svg>
    );
  }
  if (/soccer|football|futbol/.test(a)) return soccer;
  if (/basket/.test(a)) {
    return (
      <svg width="52" height="52" viewBox="0 0 60 60" aria-hidden="true">
        <ellipse className="toon-bsh fast" cx="30" cy="52" rx="13" ry="3" fill="#9A4A12" />
        <g transform="translate(30 26)">
          <g className="toon-ball fast">
            <circle r="13" fill="#E2711D" stroke="#9A4A12" strokeWidth="1.5" />
            <line x1="0" y1="-13" x2="0" y2="13" stroke="#9A4A12" strokeWidth="1.3" />
            <line x1="-13" y1="0" x2="13" y2="0" stroke="#9A4A12" strokeWidth="1.3" />
            <path d="M-11 -7 Q0 0 -11 7 M11 -7 Q0 0 11 7" fill="none" stroke="#9A4A12" strokeWidth="1.3" />
          </g>
        </g>
      </svg>
    );
  }
  if (/tennis/.test(a)) {
    return (
      <svg width="52" height="52" viewBox="0 0 60 60" aria-hidden="true">
        <ellipse className="toon-bsh fast" cx="30" cy="52" rx="12" ry="2.8" fill="#96A31F" />
        <g transform="translate(30 26)">
          <g className="toon-ball fast">
            <circle r="12" fill="#C4D82E" stroke="#96A31F" strokeWidth="1.3" />
            <path d="M-9 -9 Q6 -2 9 9 M9 -9 Q-6 2 -9 9" fill="none" stroke="#fff" strokeWidth="1.6" />
          </g>
        </g>
      </svg>
    );
  }
  if (/volley/.test(a)) {
    return (
      <svg width="52" height="52" viewBox="0 0 60 60" aria-hidden="true">
        <ellipse className="toon-bsh" cx="30" cy="52" rx="13" ry="3" fill="#378ADD" />
        <g transform="translate(30 26)">
          <g className="toon-ball">
            <circle r="13" fill="#fff" stroke="#378ADD" strokeWidth="1.5" />
            <path d="M-2 -13 Q6 0 -1 13 M4 -12 Q13 0 9 11 M-12 -5 Q0 -1 12 -6 M-11 7 Q-2 2 -6 -12" fill="none" stroke="#378ADD" strokeWidth="1.2" />
          </g>
        </g>
      </svg>
    );
  }
  if (/disc|disk|frisbee|ultimate/.test(a)) {
    return (
      <svg width="54" height="50" viewBox="0 0 60 56" aria-hidden="true">
        <g transform="translate(12 30)">
          <g className="toon-glide">
            <ellipse cx="0" cy="0" rx="13" ry="4.2" fill="#9333EA" />
            <ellipse cx="0" cy="-1.4" rx="9.5" ry="2.6" fill="#c4a8f0" />
          </g>
        </g>
      </svg>
    );
  }
  if (/surf/.test(a)) {
    return (
      <svg width="58" height="51" viewBox="0 0 64 56" aria-hidden="true">
        <path d="M4 46 Q8 22 34 24 Q22 28 25 42 Q35 32 47 36 Q57 38 60 46 Z" fill="#378ADD" />
        <g transform="translate(38 26)">
          <g className="toon-rock">
            <ellipse cx="0" cy="2" rx="13" ry="3.4" fill="#D85A30" />
            <circle cx="0" cy="-9" r="3.6" fill="#3B6370" />
            <path d="M0 -6 L0 0" stroke="#3B6370" strokeWidth="2.6" strokeLinecap="round" />
          </g>
        </g>
      </svg>
    );
  }

  if (type === "sport") return soccer;
  return heartbeat;
};

const RecentWorkouts = ({ setSelectedPage }: Props) => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<{ id: number; username: string } | null>(null);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [showPhoto, setShowPhoto] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentLoading, setCommentLoading] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [commentError, setCommentError] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecentWorkouts = async () => {
      try {
        const response = await fetch(`${API_URL}/api/posts/recent-workouts/`, {
          headers: {
            Authorization: `Bearer ${TokenService.getAccessToken()}`,
          },
        });
        const data = await response.json();
        setWorkouts(data.workouts || []);
        if (data.user) setCurrentUser(data.user);
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

  const handleUploadImage = async (
    workoutId: number,
    workoutType: "cardio" | "gym" | "sport",
    file: File
  ) => {
    setUploadingId(workoutId);
    setUploadError(null);
    const formData = new FormData();
    formData.append("image", file);
    formData.append("workout_type", workoutType);
    try {
      const response = await fetch(`${API_URL}/api/fitness/api/add-image/${workoutId}/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${TokenService.getAccessToken()}`,
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
          Authorization: `Bearer ${TokenService.getAccessToken()}`,
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

  const typeTint = (type: string) => {
    if (type === "cardio") return "bg-accent-500/10";
    if (type === "sport") return "bg-purple-600/10";
    return "bg-secondary-500/10";
  };

  // Strip the integration source prefix (e.g. "Strava: Run" -> "Run") for
  // display, both to save space and to avoid exposing which wearable a user
  // has connected.
  const stripSource = (activity: string) => {
    const cleaned = activity.replace(/^[^:]{1,24}:\s+/, "").trim();
    return cleaned || activity;
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
        {workout.verified && (
          <span
            title="Workout Verified"
            className="flex-shrink-0 flex items-center gap-0.5 bg-green-100 text-green-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
          >
            ✓ verified
          </span>
        )}
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
        {stripSource(workout.activity)}
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
    const workout =
      workouts.find(
        (w) => w.id === initialWorkout.id && w.type === initialWorkout.type
      ) ?? initialWorkout;

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

    // Other people's workouts with no photo: render nothing so the card's
    // text re-centers and fills the space instead of showing a placeholder.
    return null;
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
        @keyframes toon-beat { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.16); } }
        @keyframes toon-ring { 0% { transform: scale(0.35); opacity: 0.45; } 100% { transform: scale(1.25); opacity: 0; } }
        @keyframes toon-lift { 0%, 100% { transform: translateY(6px); } 50% { transform: translateY(-6px); } }
        @keyframes toon-bounce { 0%, 100% { transform: translateY(-13px); } 50% { transform: translateY(7px); } }
        @keyframes toon-bsh { 0%, 100% { transform: scaleX(0.55); opacity: 0.3; } 50% { transform: scaleX(1); opacity: 0.55; } }
        @keyframes toon-bob { 0%, 100% { transform: translateY(3px); } 50% { transform: translateY(-3px); } }
        @keyframes toon-breathe { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.11); } }
        @keyframes toon-spin { to { transform: rotate(360deg); } }
        @keyframes toon-stroke { 0%, 100% { transform: rotate(-22deg); } 50% { transform: rotate(20deg); } }
        @keyframes toon-wave { to { transform: translateX(-14px); } }
        @keyframes toon-rock { 0%, 100% { transform: rotate(-9deg); } 50% { transform: rotate(9deg); } }
        @keyframes toon-glide { from { transform: translate(4px, 5px); } to { transform: translate(34px, -5px); } }
        @keyframes toon-fade { 0%, 100% { opacity: 0.15; } 50% { opacity: 1; } }
        .toon-beat, .toon-ring, .toon-lift, .toon-ball, .toon-bsh, .toon-bob, .toon-breathe, .toon-spin, .toon-arm, .toon-oar, .toon-wave, .toon-rock, .toon-glide, .toon-fp { transform-box: fill-box; transform-origin: center; }
        .toon-arm, .toon-oar { transform-origin: 0% 100%; }
        .toon-beat { animation: toon-beat 1s ease-in-out infinite; }
        .toon-ring { animation: toon-ring 1.8s ease-out infinite; }
        .toon-ring-d { animation-delay: 0.9s; }
        .toon-lift { animation: toon-lift 1.15s ease-in-out infinite; }
        .toon-ball { animation: toon-bounce 1.05s cubic-bezier(0.5, 0.05, 0.5, 0.95) infinite; }
        .toon-ball.fast { animation-duration: 0.8s; }
        .toon-bsh { animation: toon-bsh 1.05s cubic-bezier(0.5, 0.05, 0.5, 0.95) infinite; }
        .toon-bsh.fast { animation-duration: 0.8s; }
        .toon-bob { animation: toon-bob 1.6s ease-in-out infinite; }
        .toon-breathe { animation: toon-breathe 2.4s ease-in-out infinite; }
        .toon-spin { animation: toon-spin 1.1s linear infinite; }
        .toon-arm, .toon-oar { animation: toon-stroke 1.1s ease-in-out infinite; }
        .toon-wave { animation: toon-wave 1.1s linear infinite; }
        .toon-rock { animation: toon-rock 1.8s ease-in-out infinite; }
        .toon-glide { animation: toon-glide 1.4s ease-in-out infinite alternate; }
        .toon-fp { animation: toon-fade 1.5s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .toon-beat, .toon-ring, .toon-lift, .toon-ball, .toon-bsh, .toon-bob, .toon-breathe, .toon-spin, .toon-arm, .toon-oar, .toon-wave, .toon-rock, .toon-glide, .toon-fp { animation: none; }
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
            <p className="text-xs text-green-600 font-semibold flex items-center justify-center gap-1 bg-green-50 px-3 py-1.5 rounded-full border border-green-200">
              ✓ Add photos to your workouts to get them verified and earn bonus points!
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
                {workouts.map((workout, index) => {
                  const isOwner = currentUser?.username === workout.username;
                  // Other people's workouts with no photo get a playful,
                  // type-specific animation on the right instead of an empty
                  // slot. Owner cards and photo'd cards keep the Add/View Photo
                  // button in the vertical layout.
                  const showCartoon = !workout.image_url && !isOwner;
                  return (
                    <motion.div
                      key={`${workout.type}-${workout.id}`}
                      className={`flex-shrink-0 w-[200px] sm:w-[220px] md:w-[240px] border border-gray-200 rounded-xl bg-white shadow-sm hover:border-primary-300 transition-colors overflow-hidden flex ${showCartoon ? "flex-row" : "flex-col"}`}
                      style={{ height: CARD_HEIGHT }}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.5 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      variants={{ hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0 } }}
                    >
                      {showCartoon ? (
                        <>
                          <div className="flex flex-1 flex-col p-3 min-w-0">
                            <span className="text-sm font-bold text-primary-500 truncate">
                              @{workout.username}
                            </span>
                            <div className="flex-1 flex flex-col justify-center gap-0.5 min-w-0">
                              <p className="text-base font-extrabold text-gray-900 truncate leading-tight">
                                {stripSource(workout.activity)}
                              </p>
                              {workout.score > 0 && (
                                <span className="text-sm font-extrabold text-accent-500">
                                  {workout.score} pts
                                </span>
                              )}
                              <span className="text-xs text-gray-400">{formatDate(workout.date)}</span>
                              {workout.duration && (
                                <span className="text-xs text-gray-400">{workout.duration}m</span>
                              )}
                            </div>
                          </div>
                          <div
                            className={`relative w-[92px] flex-shrink-0 flex items-center justify-center border-l border-gray-200 [&>svg]:scale-110 ${typeTint(workout.type)}`}
                          >
                            <WorkoutToon type={workout.type} activity={stripSource(workout.activity)} />
                            <button
                              onClick={() => handleCommentClick(workout)}
                              className="absolute top-2 right-2 text-primary-500 hover:text-primary-700 transition-colors"
                              title="View Comments"
                            >
                              <ChatBubbleBottomCenterTextIcon className="h-5 w-5" />
                              {workout.comment_count > 0 && (
                                <span className="absolute -top-1 -right-1 bg-primary-500/90 text-white text-[9px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                                  {workout.comment_count > 9 ? "9+" : workout.comment_count}
                                </span>
                              )}
                            </button>
                            <span
                              className={`absolute bottom-1.5 right-1.5 text-[9px] font-extrabold px-2 py-0.5 rounded-full ${typeColor(workout.type)}`}
                            >
                              {workout.type.toUpperCase()}
                            </span>
                          </div>
                        </>
                      ) : (
                        <>
                          <CardTopRow workout={workout} />

                          <div className="flex-1 flex flex-col justify-center">
                            <CardMeta workout={workout} />
                          </div>

                          <div className="px-3 pb-3 flex-shrink-0">
                            <CardBottomRow workout={workout} />
                          </div>
                        </>
                      )}
                    </motion.div>
                  );
                })}
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
                {stripSource(selectedWorkout.activity)} — @{selectedWorkout.username}
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
              className="bg-primary-500 rounded-t-2xl sm:rounded-lg w-full sm:w-3/4 md:w-1/2 h-[85vh] sm:h-3/4 flex flex-col"
              initial={{ scale: 0.95, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 40 }}
            >
              {/* Modal Header */}
              <div className="flex justify-between items-center p-4 border-b border-white/20 flex-shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  <h2 className="text-base sm:text-xl font-bold text-white truncate">
                    {stripSource(selectedWorkout.activity)}
                  </h2>
                  <span className="flex-shrink-0 text-xs font-bold text-white bg-white/20 px-2 py-0.5 rounded-full">
                    +{selectedWorkout.score} pts
                  </span>
                  {selectedWorkout.verified && (
                    <span className="flex-shrink-0 text-xs font-bold text-white bg-white/20 px-2 py-0.5 rounded-full">
                      ✓ verified
                    </span>
                  )}
                </div>
                <button onClick={handleCloseModal} className="text-white/70 hover:text-white flex-shrink-0 ml-2">
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              {/* Comments List */}
              <div className="flex-grow overflow-y-auto p-4">
                {commentLoading ? (
                  <p className="text-center text-white/70">Loading comments...</p>
                ) : commentError ? (
                  <p className="text-center text-red-200">{commentError}</p>
                ) : comments.length === 0 ? (
                  <p className="text-center text-white/70">No comments yet</p>
                ) : (
                  <div className="space-y-3">
                    {comments.map((comment) => (
                      <div key={comment.id} className="bg-white/10 p-3 rounded-lg">
                        <div className="flex justify-between items-center mb-1 gap-2">
                          <span className="font-bold text-white text-sm truncate">
                            @{comment.user.username}
                          </span>
                          <span className="text-xs text-white/60 flex-shrink-0">
                            {formatDate(comment.created_at)}
                          </span>
                        </div>
                        <p className="text-white text-sm">{comment.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Comment Input */}
              <form onSubmit={handleSubmitComment} className="p-4 border-t border-white/20 flex flex-col gap-2 flex-shrink-0">
                {commentError && <p className="text-red-200 text-sm">{commentError}</p>}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    maxLength={200}
                    className="flex-grow p-2 border border-white/30 rounded-lg text-black text-base bg-white focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                  <button
                    type="submit"
                    disabled={!newComment.trim()}
                    className="bg-white text-primary-500 font-semibold px-4 py-2 rounded-lg hover:bg-white/90 disabled:bg-white/30 disabled:text-white/50 transition whitespace-nowrap"
                  >
                    Send
                  </button>
                </div>
                {newComment.length > 0 && (
                  <span className="text-xs text-white/60 self-end">{newComment.length}/200</span>
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