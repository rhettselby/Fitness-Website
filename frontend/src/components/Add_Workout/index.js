import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/navbar";
import { SelectedPage } from "@/shared/types";
import { API_URL } from "@/lib/config";
import { TokenService } from "@/utils/auth";
// ── Helpers ──────────────────────────────────────────────────────────────────
const toLocalDateString = (d) => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
};
const TimePickerSection = ({ showTime, setShowTime, date, setDate, time, setTime, }) => (_jsx("div", { children: !showTime ? (_jsx("button", { type: "button", onClick: () => setShowTime(true), className: "text-sm text-black hover:text-primary-500 transition py-1", children: "\u23F1 Edit time (optional)" })) : (_jsxs("div", { className: "mt-2 space-y-3 bg-gray-50 rounded-lg p-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-gray-600 font-medium mb-1 text-sm", children: "Date" }), _jsx("input", { type: "date", value: date, onChange: (e) => setDate(e.target.value), max: toLocalDateString(new Date()), className: "w-full border rounded-lg px-4 py-3 text-black text-base" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-gray-600 font-medium mb-1 text-sm", children: "Time" }), _jsx("input", { type: "time", value: time, onChange: (e) => setTime(e.target.value), className: "w-full border rounded-lg px-4 py-3 text-black text-base" })] }), _jsx("button", { type: "button", onClick: () => setShowTime(false), className: "text-xs text-gray-500 hover:text-primary-500 transition", children: "Done" })] })) }));
const ImageUploadSection = ({ imagePreview, handleRemoveImage, fileInputRef, handleImageChange, }) => (_jsxs("div", { children: [_jsxs("label", { className: "block text-gray-700 font-semibold mb-2 text-sm md:text-base", children: ["Photo ", _jsx("span", { className: "text-gray-400 font-normal", children: "(optional)" })] }), imagePreview ? (_jsxs("div", { className: "relative rounded-lg overflow-hidden border border-gray-200", children: [_jsx("img", { src: imagePreview, alt: "Preview", className: "w-full h-48 object-cover" }), _jsx("button", { type: "button", onClick: handleRemoveImage, className: "absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm hover:bg-opacity-70 transition", "aria-label": "Remove image", children: "\u00D7" })] })) : (_jsxs("label", { className: "flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition", children: [_jsx("span", { className: "text-2xl mb-1", children: "\uD83D\uDCF7" }), _jsx("span", { className: "text-sm text-gray-500 font-medium", children: "Take a photo or upload" }), _jsx("span", { className: "text-xs text-gray-400 mt-0.5", children: "Opens camera on mobile" }), _jsx("input", { ref: fileInputRef, type: "file", accept: "image/*", capture: "environment", onChange: handleImageChange, className: "hidden" })] }))] }));
// ── Main Page ─────────────────────────────────────────────────────────────────
const AddWorkoutPage = () => {
    const [selectedPage, setSelectedPage] = useState(SelectedPage.Home);
    const [type, setType] = useState(null);
    // Shared fields
    const [activity, setActivity] = useState("");
    const [duration, setDuration] = useState("");
    const [error, setError] = useState(null);
    const [showTime, setShowTime] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false); // ← ADDED
    // Image
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);
    // Gym-specific
    const [gymView, setGymView] = useState("form");
    const [exercises, setExercises] = useState([]);
    const [exerciseInput, setExerciseInput] = useState({
        name: "",
        numSets: "",
        reps: "",
        weight: "",
    });
    const [exerciseError, setExerciseError] = useState(null);
    // Sport-specific
    const [sportName, setSportName] = useState("");
    const [sportLevel, setSportLevel] = useState("recreational");
    const now = new Date();
    const [date, setDate] = useState(toLocalDateString(now));
    const [time, setTime] = useState(now.toTimeString().slice(0, 5));
    const navigate = useNavigate();
    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file)
            return;
        if (file.size > 10 * 1024 * 1024) {
            setError("Image must be under 10MB.");
            return;
        }
        setImage(file);
        setImagePreview(URL.createObjectURL(file));
        setError(null);
    };
    const handleRemoveImage = () => {
        setImage(null);
        setImagePreview(null);
        if (fileInputRef.current)
            fileInputRef.current.value = "";
    };
    const handleAddExercise = () => {
        setExerciseError(null);
        const { name, numSets, reps, weight } = exerciseInput;
        if (!name.trim())
            return setExerciseError("Please enter an exercise name.");
        if (!numSets || Number(numSets) < 1)
            return setExerciseError("Please enter a valid number of sets.");
        if (!reps || Number(reps) < 1)
            return setExerciseError("Please enter a valid number of reps.");
        if (weight === "" || Number(weight) < 0)
            return setExerciseError("Please enter a valid weight.");
        const sets = Array.from({ length: Number(numSets) }, () => ({
            reps: Number(reps),
            weight: Number(weight),
        }));
        setExercises((prev) => [...prev, { name: name.trim(), sets }]);
        setExerciseInput({ name: "", numSets: "", reps: "", weight: "" });
        setGymView("exercises");
    };
    const handleRemoveExercise = (index) => {
        setExercises((prev) => prev.filter((_, i) => i !== index));
    };
    const getToken = () => TokenService.getAccessToken();
    const handleErrorResponse = async (response) => {
        try {
            const err = await response.json();
            if (err.errors) {
                return Object.entries(err.errors)
                    .map(([field, messages]) => {
                    const fieldName = field.charAt(0).toUpperCase() + field.slice(1);
                    const msgArray = Array.isArray(messages) ? messages : [messages];
                    return `${fieldName}: ${msgArray.join(", ")}`;
                })
                    .join(". ");
            }
            return err.message || err.error || "Could not save workout. Please double-check your inputs.";
        }
        catch {
            return `Server error: ${response.status} ${response.statusText}`;
        }
    };
    const buildFormData = (fields) => {
        const formData = new FormData();
        Object.entries(fields).forEach(([key, value]) => formData.append(key, value));
        if (image)
            formData.append("image", image);
        return formData;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting)
            return; // ← ADDED: extra safety net
        setError(null);
        setIsSubmitting(true); // ← ADDED: lock the form
        const dateTime = `${date}T${time || "00:00"}:00`;
        const token = getToken();
        const authHeader = token ? { Authorization: `Bearer ${token}` } : {};
        try {
            if (type === "gym") {
                if (!activity.trim())
                    return setError("Please enter an activity.");
                const formData = buildFormData({ activity: activity.trim(), date: dateTime });
                formData.append("exercises", JSON.stringify(exercises));
                const response = await fetch(`${API_URL}/api/fitness/add/gym/`, {
                    method: "POST",
                    headers: authHeader,
                    body: formData,
                });
                if (!response.ok)
                    return setError(await handleErrorResponse(response));
                const data = await response.json();
                if (data.success)
                    navigate("/profile");
                else
                    setError(data.message || "Could not save workout.");
            }
            else if (type === "cardio") {
                if (!activity.trim())
                    return setError("Please enter an activity.");
                if (!duration || Number(duration) <= 0)
                    return setError("Please enter a valid duration (greater than 0).");
                const formData = buildFormData({
                    activity: activity.trim(),
                    date: dateTime,
                    duration: String(duration),
                });
                const response = await fetch(`${API_URL}/api/fitness/add/cardio/`, {
                    method: "POST",
                    headers: authHeader,
                    body: formData,
                });
                if (!response.ok)
                    return setError(await handleErrorResponse(response));
                const data = await response.json();
                if (data.success)
                    navigate("/profile");
                else
                    setError(data.message || "Could not save workout.");
            }
            else if (type === "sport") {
                if (!sportName.trim())
                    return setError("Please enter a sport.");
                if (!duration || Number(duration) <= 0)
                    return setError("Please enter a valid duration.");
                const formData = buildFormData({
                    sport: sportName.trim(),
                    date: dateTime,
                    duration: String(duration),
                    level: sportLevel,
                });
                const response = await fetch(`${API_URL}/api/fitness/add/sport/`, {
                    method: "POST",
                    headers: authHeader,
                    body: formData,
                });
                if (!response.ok)
                    return setError(await handleErrorResponse(response));
                const data = await response.json();
                if (data.success)
                    navigate("/profile");
                else
                    setError(data.message || "Could not save workout.");
            }
            else {
                setError("Please select a workout type.");
            }
        }
        catch (err) {
            console.error("Submit error:", err);
            setError("Could not save workout. Please double-check your inputs.");
        }
        finally {
            setIsSubmitting(false); // ← ADDED: re-enable only on failure (success navigates away)
        }
    };
    // Shared props for sub-components
    const timePickerProps = { showTime, setShowTime, date, setDate, time, setTime };
    const imageUploadProps = { imagePreview, handleRemoveImage, fileInputRef, handleImageChange };
    return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx(Navbar, { isTopOfPage: false, selectedPage: selectedPage, setSelectedPage: setSelectedPage }), _jsx("div", { className: "pt-20 pb-12 md:pt-24 md:pb-16 px-4", children: _jsxs("div", { className: "max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6 sm:p-8 md:p-10", children: [!type && (_jsxs(_Fragment, { children: [_jsx("h1", { className: "text-3xl md:text-4xl font-bold text-primary-500 mb-6 md:mb-8 text-center", children: "Add Workout" }), _jsxs("div", { className: "flex flex-col items-center gap-4 md:gap-6", children: [_jsx("p", { className: "text-base md:text-lg font-medium text-gray-700", children: "Choose workout type:" }), _jsx("button", { className: "w-full sm:w-auto px-6 py-4 md:py-3 bg-secondary-500 text-white rounded-lg text-lg font-semibold hover:bg-secondary-600 transition active:scale-95", onClick: () => { setType("gym"); setGymView("form"); setShowTime(false); }, children: "\uD83D\uDCAA Gym" }), _jsx("button", { className: "w-full sm:w-auto px-6 py-4 md:py-3 bg-accent-500 text-white rounded-lg text-lg font-semibold hover:bg-accent-600 transition active:scale-95", onClick: () => { setType("cardio"); setShowTime(false); }, children: "\uD83D\uDEB4 Cardio" }), _jsx("button", { className: "w-full sm:w-auto px-6 py-4 md:py-3 bg-purple-600 text-white rounded-lg text-lg font-semibold hover:bg-purple-700 transition active:scale-95", onClick: () => { setType("sport"); setShowTime(false); }, children: "\uD83C\uDFC5 Sport" })] })] })), type === "cardio" && (_jsxs("form", { onSubmit: handleSubmit, className: "space-y-5 mt-4", children: [_jsx("h1", { className: "text-3xl md:text-4xl font-bold text-primary-500 mb-6 text-center", children: "Add Workout" }), _jsx("button", { className: "text-sm text-gray-500 hover:text-primary-500 transition", onClick: () => setType(null), type: "button", children: "\u2190 Change workout type" }), _jsxs("div", { children: [_jsx("label", { className: "block text-gray-700 font-semibold mb-1 text-sm md:text-base", children: "Activity" }), _jsx("input", { type: "text", value: activity, onChange: (e) => setActivity(e.target.value), required: true, className: "w-full border rounded-lg px-4 py-3 text-black text-base", placeholder: "E.g. Running, Cycling" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-gray-700 font-semibold mb-1 text-sm md:text-base", children: "Duration (minutes)" }), _jsx("input", { type: "number", min: "1", value: duration, onChange: (e) => setDuration(e.target.value === "" ? "" : Number(e.target.value)), required: true, className: "w-full border rounded-lg px-4 py-3 text-black text-base", placeholder: "E.g. 30" })] }), _jsx(TimePickerSection, { ...timePickerProps }), _jsx(ImageUploadSection, { ...imageUploadProps }), error && _jsx("p", { className: "text-red-500 text-sm text-center", children: error }), _jsx("button", { type: "submit", disabled: isSubmitting, className: "w-full bg-primary-500 text-white py-4 md:py-3 rounded-lg text-lg font-semibold hover:bg-primary-600 transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed", children: isSubmitting ? "Saving..." : "Save Workout" })] })), type === "sport" && (_jsxs("form", { onSubmit: handleSubmit, className: "space-y-5 mt-4", children: [_jsx("h1", { className: "text-3xl md:text-4xl font-bold text-purple-600 mb-6 text-center", children: "Add Sport" }), _jsx("button", { className: "text-sm text-gray-500 hover:text-purple-600 transition", onClick: () => setType(null), type: "button", children: "\u2190 Change workout type" }), _jsxs("div", { children: [_jsx("label", { className: "block text-gray-700 font-semibold mb-1 text-sm md:text-base", children: "Sport" }), _jsx("input", { type: "text", value: sportName, onChange: (e) => setSportName(e.target.value), required: true, className: "w-full border rounded-lg px-4 py-3 text-black text-base focus:outline-none focus:ring-2 focus:ring-purple-400", placeholder: "E.g. Soccer, Basketball, Tennis" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-gray-700 font-semibold mb-1 text-sm md:text-base", children: "Duration (minutes)" }), _jsx("input", { type: "number", min: "1", value: duration, onChange: (e) => setDuration(e.target.value === "" ? "" : Number(e.target.value)), required: true, className: "w-full border rounded-lg px-4 py-3 text-black text-base focus:outline-none focus:ring-2 focus:ring-purple-400", placeholder: "E.g. 60" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-gray-700 font-semibold mb-2 text-sm md:text-base", children: "Level" }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsx("button", { type: "button", onClick: () => setSportLevel("recreational"), className: `py-3 px-4 rounded-lg border-2 font-semibold text-sm transition active:scale-95 ${sportLevel === "recreational"
                                                        ? "border-purple-600 bg-purple-50 text-purple-700"
                                                        : "border-gray-200 text-gray-500 hover:border-purple-300"}`, children: "\uD83C\uDFAE Recreational" }), _jsx("button", { type: "button", onClick: () => setSportLevel("competitive"), className: `py-3 px-4 rounded-lg border-2 font-semibold text-sm transition active:scale-95 ${sportLevel === "competitive"
                                                        ? "border-purple-600 bg-purple-50 text-purple-700"
                                                        : "border-gray-200 text-gray-500 hover:border-purple-300"}`, children: "\uD83C\uDFC6 Competitive" })] })] }), _jsx(TimePickerSection, { ...timePickerProps }), _jsx(ImageUploadSection, { ...imageUploadProps }), error && _jsx("p", { className: "text-red-500 text-sm text-center", children: error }), _jsx("button", { type: "submit", disabled: isSubmitting, className: "w-full bg-purple-600 text-white py-4 md:py-3 rounded-lg text-lg font-semibold hover:bg-purple-700 transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed", children: isSubmitting ? "Saving..." : "Save Sport" })] })), type === "gym" && gymView === "form" && (_jsxs("form", { onSubmit: handleSubmit, className: "space-y-5 mt-4", children: [_jsx("h1", { className: "text-3xl md:text-4xl font-bold text-primary-500 mb-6 text-center", children: "Add Workout" }), _jsx("button", { className: "text-sm text-gray-500 hover:text-primary-500 transition", onClick: () => setType(null), type: "button", children: "\u2190 Change workout type" }), _jsxs("div", { children: [_jsx("label", { className: "block text-gray-700 font-semibold mb-1 text-sm md:text-base", children: "Activity" }), _jsx("input", { type: "text", value: activity, onChange: (e) => setActivity(e.target.value), required: true, className: "w-full border rounded-lg px-4 py-3 text-black text-base", placeholder: "E.g. Push day, Leg day" })] }), _jsx(TimePickerSection, { ...timePickerProps }), _jsxs("button", { type: "button", onClick: () => setGymView("exercises"), className: "w-full border border-gray-300 rounded-lg py-3 text-gray-700 font-semibold hover:bg-gray-50 transition flex items-center justify-center gap-2", children: ["Input workout data", exercises.length > 0 && (_jsxs("span", { className: "ml-2 text-sm bg-primary-100 text-primary-600 px-2 py-0.5 rounded-full", children: [exercises.length, " exercise", exercises.length !== 1 ? "s" : ""] }))] }), _jsx(ImageUploadSection, { ...imageUploadProps }), error && _jsx("p", { className: "text-red-500 text-sm text-center", children: error }), _jsx("button", { type: "submit", disabled: isSubmitting, className: "w-full bg-primary-500 text-white py-4 md:py-3 rounded-lg text-lg font-semibold hover:bg-primary-600 transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed", children: isSubmitting ? "Saving..." : "Save Workout" })] })), type === "gym" && gymView === "exercises" && (_jsxs("div", { className: "space-y-4 mt-4", children: [_jsx("button", { className: "text-sm text-gray-500 hover:text-primary-500 transition", onClick: () => setGymView("form"), type: "button", children: "\u2190 Back to workout" }), _jsxs("h2", { className: "text-2xl font-bold text-primary-500 text-center", children: ["Exercises", exercises.length > 0 && (_jsxs("span", { className: "ml-2 text-base font-normal text-gray-500", children: ["(", exercises.length, ")"] }))] }), exercises.length === 0 && (_jsx("p", { className: "text-center text-gray-400 text-sm py-4", children: "No exercises added yet." })), _jsx("div", { className: "space-y-3 overflow-y-auto max-h-72 pr-1", children: exercises.map((ex, i) => (_jsxs("div", { className: "bg-gray-50 rounded-lg p-4 flex items-start justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "font-semibold text-white", children: ex.name }), _jsxs("p", { className: "text-sm text-gray-500 mt-0.5", children: [ex.sets.length, " set", ex.sets.length !== 1 ? "s" : "", " \u00B7 ", ex.sets[0].reps, " reps \u00B7 ", ex.sets[0].weight, " lbs max"] })] }), _jsx("button", { onClick: () => handleRemoveExercise(i), className: "text-gray-400 hover:text-red-500 transition text-lg ml-4 mt-0.5", type: "button", "aria-label": "Remove exercise", children: "\u00D7" })] }, i))) }), _jsx("button", { type: "button", onClick: () => setGymView("add-exercise"), className: "w-full border border-dashed border-gray-300 rounded-lg py-3 text-gray-600 font-medium hover:bg-gray-50 transition", children: "+ Add exercise" }), _jsx("button", { type: "button", onClick: () => setGymView("form"), className: "w-full bg-primary-500 text-white py-3 rounded-lg text-lg font-semibold hover:bg-primary-600 transition active:scale-95", children: "Done" })] })), type === "gym" && gymView === "add-exercise" && (_jsxs("div", { className: "space-y-4 mt-4", children: [_jsx("button", { className: "text-sm text-gray-500 hover:text-primary-500 transition", onClick: () => setGymView("exercises"), type: "button", children: "\u2190 Back to exercises" }), _jsx("h2", { className: "text-2xl font-bold text-primary-500 text-center", children: "Add Exercise" }), _jsxs("div", { children: [_jsx("label", { className: "block text-gray-700 font-semibold mb-1 text-sm md:text-base", children: "Exercise name" }), _jsx("input", { type: "text", value: exerciseInput.name, onChange: (e) => setExerciseInput((p) => ({ ...p, name: e.target.value })), className: "w-full border rounded-lg px-4 py-3 text-black text-base", placeholder: "E.g. Bench Press" })] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-gray-700 font-semibold mb-1 text-sm", children: "# of sets" }), _jsx("input", { type: "number", min: "1", value: exerciseInput.numSets, onChange: (e) => setExerciseInput((p) => ({ ...p, numSets: e.target.value })), className: "w-full border rounded-lg px-4 py-3 text-black text-base", placeholder: "3" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-gray-700 font-semibold mb-1 text-sm", children: "Reps per set" }), _jsx("input", { type: "number", min: "1", value: exerciseInput.reps, onChange: (e) => setExerciseInput((p) => ({ ...p, reps: e.target.value })), className: "w-full border rounded-lg px-4 py-3 text-black text-base", placeholder: "10" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-gray-700 font-semibold mb-1 text-sm", children: "Max weight (lbs)" }), _jsx("input", { type: "number", min: "0", value: exerciseInput.weight, onChange: (e) => setExerciseInput((p) => ({ ...p, weight: e.target.value })), className: "w-full border rounded-lg px-4 py-3 text-black text-base", placeholder: "135" })] })] }), exerciseError && _jsx("p", { className: "text-red-500 text-sm text-center", children: exerciseError }), _jsx("button", { type: "button", onClick: handleAddExercise, className: "w-full bg-primary-500 text-white py-3 rounded-lg text-lg font-semibold hover:bg-primary-600 transition active:scale-95", children: "Add exercise" })] }))] }) })] }));
};
export default AddWorkoutPage;
