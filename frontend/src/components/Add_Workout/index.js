import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/navbar";
import { SelectedPage } from "@/shared/types";
const AddWorkoutPage = () => {
    const [selectedPage, setSelectedPage] = useState(SelectedPage.Home);
    const [type, setType] = useState(null);
    const [activity, setActivity] = useState("");
    const [duration, setDuration] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        if (!activity.trim()) {
            setError("Please enter an activity.");
            return;
        }
        let url = "";
        const formData = new URLSearchParams();
        formData.append("activity", activity.trim());
        if (type === "gym") {
            url = "${API_URL}/api/fitness/add/gym/";
        }
        else if (type === "cardio") {
            url = "${API_URL}/api/fitness/add/cardio/";
            if (duration === "" || duration === null || duration === undefined || Number(duration) <= 0) {
                setError("Please enter a valid duration (greater than 0) for cardio workouts.");
                return;
            }
            // Convert duration to string
            formData.append("duration", String(duration));
        }
        else {
            setError("Please select a workout type.");
            return;
        }
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                credentials: "include",
                body: formData.toString(),
            });
            if (!response.ok) {
                let errorMessage = "Could not save workout. Please double-check your inputs.";
                try {
                    const err = await response.json();
                    console.error("Error response:", err);
                    // Extract error message from response
                    if (err.errors) {
                        // Handle Django form errors
                        const errorArray = Object.entries(err.errors).map(([field, messages]) => {
                            const fieldName = field.charAt(0).toUpperCase() + field.slice(1);
                            const msgArray = Array.isArray(messages) ? messages : [messages];
                            return `${fieldName}: ${msgArray.join(", ")}`;
                        });
                        errorMessage = errorArray.join(". ");
                    }
                    else if (err.message) {
                        errorMessage = err.message;
                    }
                    else if (err.error) {
                        errorMessage = err.error;
                    }
                }
                catch (parseError) {
                    console.error("Failed to parse error response:", parseError);
                    errorMessage = `Server error: ${response.status} ${response.statusText}`;
                }
                setError(errorMessage);
                return;
            }
            const data = await response.json();
            if (data.success) {
                navigate("/profile");
            }
            else {
                setError(data.message || "Could not save workout.");
            }
        }
        catch (err) {
            console.error("Submit error:", err);
            setError("Could not save workout. Please double-check your inputs.");
        }
    };
    return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx(Navbar, { isTopOfPage: false, selectedPage: selectedPage, setSelectedPage: setSelectedPage }), _jsx("div", { className: "pt-24 pb-16", children: _jsxs("div", { className: "max-w-2xl mx-auto bg-white rounded-lg shadow-md p-10", children: [_jsx("h1", { className: "text-4xl font-bold text-primary-500 mb-8 text-center", children: "Add Workout" }), !type && (_jsxs("div", { className: "flex flex-col items-center gap-6", children: [_jsx("p", { className: "text-lg font-medium text-gray-700", children: "Choose workout type:" }), _jsx("button", { className: "px-6 py-3 bg-secondary-500 text-white rounded-lg text-lg font-semibold hover:bg-secondary-600 transition", onClick: () => setType("gym"), children: "\uD83D\uDCAA Gym" }), _jsx("button", { className: "px-6 py-3 bg-accent-500 text-white rounded-lg text-lg font-semibold hover:bg-accent-600 transition", onClick: () => setType("cardio"), children: "\uD83D\uDEB4 Cardio" })] })), type && (_jsxs("form", { onSubmit: handleSubmit, className: "space-y-6 mt-6", children: [_jsx("button", { className: "text-sm text-gray-500 hover:text-primary-500", onClick: () => setType(null), type: "button", children: "\u2190 Change workout type" }), _jsxs("div", { children: [_jsx("label", { className: "block text-gray-700 font-semibold mb-1", children: "Activity" }), _jsx("input", { type: "text", value: activity, onChange: (e) => setActivity(e.target.value), required: true, className: "w-full border rounded-lg px-4 py-2", placeholder: "E.g. Bench Press, Running, Squats" })] }), type === "cardio" && (_jsxs("div", { children: [_jsx("label", { className: "block text-gray-700 font-semibold mb-1", children: "Duration (minutes)" }), _jsx("input", { type: "number", min: "1", value: duration, onChange: (e) => setDuration(Number(e.target.value)), required: true, className: "w-full border rounded-lg px-4 py-2", placeholder: "E.g. 30" })] })), error && (_jsx("p", { className: "text-red-500 text-center", children: error })), _jsx("button", { type: "submit", className: "w-full bg-primary-500 text-white py-3 rounded-lg text-lg font-semibold hover:bg-primary-600 transition", children: "Save Workout" })] }))] }) })] }));
};
export default AddWorkoutPage;
