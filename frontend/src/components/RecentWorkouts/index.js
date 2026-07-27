import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SelectedPage } from "@/shared/types";
import { API_URL } from "@/lib/config";
import { TokenService } from "@/utils/auth";
import { XMarkIcon, ChatBubbleBottomCenterTextIcon } from "@heroicons/react/24/solid";
const CARD_HEIGHT = 157;
const RecentWorkouts = ({ setSelectedPage }) => {
    const [workouts, setWorkouts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    const [selectedWorkout, setSelectedWorkout] = useState(null);
    const [showPhoto, setShowPhoto] = useState(false);
    const [comments, setComments] = useState([]);
    const [commentLoading, setCommentLoading] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [commentError, setCommentError] = useState(null);
    const [uploadingId, setUploadingId] = useState(null);
    const [uploadError, setUploadError] = useState(null);
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
                if (data.user)
                    setCurrentUser(data.user);
            }
            catch (error) {
                console.error("Error fetching recent workouts:", error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchRecentWorkouts();
    }, []);
    const fetchComments = async (workoutId, workoutType) => {
        setCommentLoading(true);
        setCommentError(null);
        try {
            const response = await fetch(`${API_URL}/api/fitness/api/comments/${workoutType}/${workoutId}/`);
            const data = await response.json();
            if (data.success) {
                setComments(data.comments || []);
            }
            else {
                setCommentError(data.error || "Failed to fetch comments");
            }
        }
        catch {
            setCommentError("Network error. Please try again.");
        }
        finally {
            setCommentLoading(false);
        }
    };
    const handleUploadImage = async (workoutId, workoutType, file) => {
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
                setWorkouts((prev) => prev.map((w) => w.id === workoutId && w.type === workoutType
                    ? { ...w, image_url: data.image_url }
                    : w));
            }
            else {
                setUploadError(data.error || "Upload failed");
            }
        }
        catch (err) {
            console.error("Upload failed:", err);
            setUploadError("Network error. Please try again.");
        }
        finally {
            setUploadingId(null);
        }
    };
    const handleCommentClick = (workout) => {
        setSelectedWorkout(workout);
        setShowPhoto(false);
        fetchComments(workout.id, workout.type);
    };
    const handleViewPhoto = (workout) => {
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
    const handleSubmitComment = async (e) => {
        e.preventDefault();
        if (!selectedWorkout || !newComment.trim())
            return;
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
            }
            else {
                setCommentError(data.error || "Failed to add comment");
            }
        }
        catch {
            setCommentError("Network error. Please try again.");
        }
    };
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
        if (diffInHours < 1)
            return "Just now";
        if (diffInHours < 24)
            return `${diffInHours}h ago`;
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        if (date.toDateString() === yesterday.toDateString())
            return "Yesterday";
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    };
    const typeColor = (type) => {
        if (type === "cardio")
            return "bg-accent-500 text-white";
        if (type === "sport")
            return "bg-purple-600 text-white";
        return "bg-secondary-500 text-white";
    };
    const CardTopRow = ({ workout }) => (_jsxs("div", { className: "flex items-center justify-between px-3 pt-3 flex-shrink-0", children: [_jsxs("div", { className: "flex items-center gap-1.5 min-w-0", children: [_jsx("span", { className: `px-2 py-0.5 rounded-full text-xs font-bold flex-shrink-0 ${typeColor(workout.type)}`, children: workout.type.toUpperCase() }), _jsxs("span", { className: "text-sm font-bold text-primary-500 truncate", children: ["@", workout.username] }), workout.verified && (_jsx("span", { title: "Workout Verified", className: "flex-shrink-0 flex items-center gap-0.5 bg-green-100 text-green-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full", children: "\u2713 verified" }))] }), _jsxs("button", { onClick: () => handleCommentClick(workout), className: "relative text-primary-500 hover:text-primary-700 transition-colors flex-shrink-0 ml-1", title: "View Comments", children: [_jsx(ChatBubbleBottomCenterTextIcon, { className: "h-5 w-5" }), workout.comment_count > 0 && (_jsx("span", { className: "absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 bg-primary-500/90 text-white text-[9px] font-bold rounded-full h-3.5 w-3.5 flex items-center justify-center", children: workout.comment_count > 9 ? "9+" : workout.comment_count }))] })] }));
    const CardMeta = ({ workout }) => (_jsxs("div", { className: "flex flex-col gap-1 px-3", children: [_jsx("p", { className: "text-base font-extrabold text-gray-900 truncate leading-tight", children: workout.activity }), _jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [workout.score > 0 && (_jsxs("span", { className: "text-sm font-extrabold text-accent-500", children: [workout.score, " pts"] })), _jsx("span", { className: "text-xs text-gray-400", children: formatDate(workout.date) }), workout.duration && (_jsxs("span", { className: "text-xs text-gray-400", children: [workout.duration, "m"] }))] })] }));
    const CardBottomRow = ({ workout: initialWorkout }) => {
        const workout = workouts.find((w) => w.id === initialWorkout.id && w.type === initialWorkout.type) ?? initialWorkout;
        const isOwner = currentUser?.username === workout.username;
        const isUploading = uploadingId === workout.id;
        if (workout.image_url) {
            return (_jsxs("button", { onClick: () => handleViewPhoto(workout), className: "pulse-photo-btn w-full flex items-center justify-center gap-1.5 bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold py-2 rounded-lg transition-colors", children: [_jsx("span", { children: "\uD83D\uDCF7" }), _jsx("span", { children: "View Photo" })] }));
        }
        if (isOwner) {
            return (_jsxs("label", { className: "w-full flex items-center justify-center gap-1.5 bg-primary-500 hover:bg-primary-600 active:scale-95 text-white text-sm font-semibold py-2 rounded-lg cursor-pointer transition-all shadow-sm", children: [isUploading ? (_jsx("span", { className: "text-xs text-white font-medium", children: "Uploading..." })) : (_jsxs(_Fragment, { children: [_jsx("span", { className: "text-sm", children: "\uD83D\uDCF7" }), _jsx("span", { className: "text-sm font-bold", children: "Add Photo" })] })), _jsx("input", { type: "file", accept: "image/*", capture: "environment", className: "hidden", disabled: isUploading, onChange: (e) => {
                            if (e.target.files?.[0]) {
                                handleUploadImage(workout.id, workout.type, e.target.files[0]);
                            }
                        } })] }));
        }
        // Other people's workouts with no photo: render nothing so the card's
        // text re-centers and fills the space instead of showing a placeholder.
        return null;
    };
    return (_jsxs("section", { id: "recentworkouts", className: "w-full bg-primary-100 py-16 md:py-20", children: [_jsx("style", { children: `
        @keyframes pulse-btn {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
        .pulse-photo-btn {
          animation: pulse-btn 1.6s ease-in-out infinite;
        }
      ` }), _jsx("div", { className: "max-w-7xl mx-auto px-4", children: _jsxs(motion.div, { onViewportEnter: () => setSelectedPage(SelectedPage.Home), children: [_jsxs(motion.div, { className: "w-full flex flex-col items-center text-center mb-8 md:mb-10", initial: "hidden", whileInView: "visible", viewport: { once: true, amount: 0.5 }, transition: { duration: 0.5 }, variants: { hidden: { opacity: 0, x: 50 }, visible: { opacity: 1, x: 0 } }, children: [_jsx("h1", { className: "text-2xl sm:text-3xl md:text-4xl font-bold text-primary-500", children: "RECENT ACTIVITY" }), _jsx("p", { className: "my-4 md:my-5 text-sm text-gray-900", children: "See what the community has been up to lately" }), _jsx("p", { className: "text-xs text-green-600 font-semibold flex items-center justify-center gap-1 bg-green-50 px-3 py-1.5 rounded-full border border-green-200", children: "\u2713 Add photos to your workouts to get them verified and earn bonus points!" })] }), _jsx(AnimatePresence, { children: uploadError && (_jsxs(motion.div, { className: "mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm text-center", initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 }, children: [uploadError, _jsx("button", { onClick: () => setUploadError(null), className: "ml-2 font-bold", children: "\u00D7" })] })) }), _jsx("div", { className: "overflow-x-auto overflow-y-hidden pb-4 -mx-4 px-4", children: loading ? (_jsx("p", { className: "text-center", children: "Loading recent workouts..." })) : workouts.length === 0 ? (_jsx("p", { className: "text-center text-gray-500", children: "No recent workouts yet" })) : (_jsx("div", { className: "flex gap-3 md:gap-4 min-w-min items-start", children: workouts.map((workout, index) => (_jsxs(motion.div, { className: "flex-shrink-0 w-[200px] sm:w-[220px] md:w-[240px] border border-gray-200 rounded-xl bg-white shadow-sm hover:border-primary-300 transition-colors overflow-hidden flex flex-col", style: { height: CARD_HEIGHT }, initial: "hidden", whileInView: "visible", viewport: { once: true, amount: 0.5 }, transition: { duration: 0.5, delay: index * 0.1 }, variants: { hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0 } }, children: [_jsx(CardTopRow, { workout: workout }), _jsx("div", { className: "flex-1 flex flex-col justify-center", children: _jsx(CardMeta, { workout: workout }) }), _jsx("div", { className: "px-3 pb-3 flex-shrink-0", children: _jsx(CardBottomRow, { workout: workout }) })] }, `${workout.type}-${workout.id}`))) })) })] }) }), _jsx(AnimatePresence, { children: selectedWorkout && showPhoto && (_jsx(motion.div, { className: "fixed inset-0 bg-black/80 z-50 flex items-center justify-center px-4", initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, onClick: (e) => { if (e.target === e.currentTarget)
                        handleCloseModal(); }, children: _jsxs(motion.div, { className: "relative w-full max-w-2xl", initial: { scale: 0.95, opacity: 0 }, animate: { scale: 1, opacity: 1 }, exit: { scale: 0.95, opacity: 0 }, children: [_jsx("button", { onClick: handleCloseModal, className: "absolute -top-10 right-0 text-white hover:text-gray-300 transition", children: _jsx(XMarkIcon, { className: "h-7 w-7" }) }), _jsx("img", { src: selectedWorkout.image_url, alt: selectedWorkout.activity, className: "w-full max-h-[80vh] object-contain rounded-lg" }), _jsxs("p", { className: "text-white text-center text-sm mt-3 font-semibold", children: [selectedWorkout.activity, " \u2014 @", selectedWorkout.username] })] }) })) }), _jsx(AnimatePresence, { children: selectedWorkout && !showPhoto && (_jsx(motion.div, { className: "fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center px-0 sm:px-4", initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, onClick: (e) => { if (e.target === e.currentTarget)
                        handleCloseModal(); }, children: _jsxs(motion.div, { className: "bg-primary-500 rounded-t-2xl sm:rounded-lg w-full sm:w-3/4 md:w-1/2 h-[85vh] sm:h-3/4 flex flex-col", initial: { scale: 0.95, opacity: 0, y: 40 }, animate: { scale: 1, opacity: 1, y: 0 }, exit: { scale: 0.95, opacity: 0, y: 40 }, children: [_jsxs("div", { className: "flex justify-between items-center p-4 border-b border-white/20 flex-shrink-0", children: [_jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [_jsx("h2", { className: "text-base sm:text-xl font-bold text-white truncate", children: selectedWorkout.activity }), _jsxs("span", { className: "flex-shrink-0 text-xs font-bold text-white bg-white/20 px-2 py-0.5 rounded-full", children: ["+", selectedWorkout.score, " pts"] }), selectedWorkout.verified && (_jsx("span", { className: "flex-shrink-0 text-xs font-bold text-white bg-white/20 px-2 py-0.5 rounded-full", children: "\u2713 verified" }))] }), _jsx("button", { onClick: handleCloseModal, className: "text-white/70 hover:text-white flex-shrink-0 ml-2", children: _jsx(XMarkIcon, { className: "h-6 w-6" }) })] }), _jsx("div", { className: "flex-grow overflow-y-auto p-4", children: commentLoading ? (_jsx("p", { className: "text-center text-white/70", children: "Loading comments..." })) : commentError ? (_jsx("p", { className: "text-center text-red-200", children: commentError })) : comments.length === 0 ? (_jsx("p", { className: "text-center text-white/70", children: "No comments yet" })) : (_jsx("div", { className: "space-y-3", children: comments.map((comment) => (_jsxs("div", { className: "bg-white/10 p-3 rounded-lg", children: [_jsxs("div", { className: "flex justify-between items-center mb-1 gap-2", children: [_jsxs("span", { className: "font-bold text-white text-sm truncate", children: ["@", comment.user.username] }), _jsx("span", { className: "text-xs text-white/60 flex-shrink-0", children: formatDate(comment.created_at) })] }), _jsx("p", { className: "text-white text-sm", children: comment.text })] }, comment.id))) })) }), _jsxs("form", { onSubmit: handleSubmitComment, className: "p-4 border-t border-white/20 flex flex-col gap-2 flex-shrink-0", children: [commentError && _jsx("p", { className: "text-red-200 text-sm", children: commentError }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("input", { type: "text", value: newComment, onChange: (e) => setNewComment(e.target.value), placeholder: "Write a comment...", maxLength: 200, className: "flex-grow p-2 border border-white/30 rounded-lg text-black text-base bg-white focus:outline-none focus:ring-2 focus:ring-white/50" }), _jsx("button", { type: "submit", disabled: !newComment.trim(), className: "bg-white text-primary-500 font-semibold px-4 py-2 rounded-lg hover:bg-white/90 disabled:bg-white/30 disabled:text-white/50 transition whitespace-nowrap", children: "Send" })] }), newComment.length > 0 && (_jsxs("span", { className: "text-xs text-white/60 self-end", children: [newComment.length, "/200"] }))] })] }) })) })] }));
};
export default RecentWorkouts;
