import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/navbar";
import { SelectedPage } from "@/shared/types";
import { API_URL } from "@/lib/config";
import { TokenService } from "@/utils/auth";

type WorkoutType = "cardio" | "gym";

const AddWorkoutPage = () => {
  const [selectedPage, setSelectedPage] = useState<SelectedPage>(SelectedPage.Home);
  const [type, setType] = useState<WorkoutType | null>(null);
  const [activity, setActivity] = useState("");
  const [duration, setDuration] = useState<number | "">("");
  const [error, setError] = useState<string | null>(null);
  const [showTime, setShowTime] = useState(false);

  const now = new Date();
  const [date, setDate] = useState(now.toISOString().slice(0, 10));
  const [time, setTime] = useState(now.toTimeString().slice(0, 5));

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!activity.trim()) {
      setError("Please enter an activity.");
      return;
    }

    let url = `${API_URL}`;
    const formData = new URLSearchParams();
    formData.append("activity", activity.trim());

    const dateTime = time ? `${date}T${time}` : `${date}T00:00`;
    formData.append("date", dateTime);

    if (type === "gym") {
      url = `${API_URL}/api/fitness/api/add/gym-jwt/`;
    } else if (type === "cardio") {
      url = `${API_URL}/api/fitness/api/add/cardio-jwt/`;
      if (!duration || Number(duration) <= 0) {
        setError("Please enter a valid duration (greater than 0) for cardio workouts.");
        return;
      }
      formData.append("duration", String(duration));
    } else {
      setError("Please select a workout type.");
      return;
    }

    const token = TokenService.getAccessToken();
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData.toString(),
      });

      if (!response.ok) {
        let errorMessage = "Could not save workout. Please double-check your inputs.";
        try {
          const err = await response.json();
          if (err.errors) {
            errorMessage = Object.entries(err.errors)
              .map(([field, messages]: [string, any]) => {
                const fieldName = field.charAt(0).toUpperCase() + field.slice(1);
                const msgArray = Array.isArray(messages) ? messages : [messages];
                return `${fieldName}: ${msgArray.join(", ")}`;
              })
              .join(". ");
          } else if (err.message) {
            errorMessage = err.message;
          } else if (err.error) {
            errorMessage = err.error;
          }
        } catch {
          errorMessage = `Server error: ${response.status} ${response.statusText}`;
        }
        setError(errorMessage);
        return;
      }

      const data = await response.json();
      if (data.success) {
        navigate("/profile");
      } else {
        setError(data.message || "Could not save workout.");
      }
    } catch (err: any) {
      console.error("Submit error:", err);
      setError("Could not save workout. Please double-check your inputs.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        isTopOfPage={false}
        selectedPage={selectedPage}
        setSelectedPage={setSelectedPage}
      />

      {/* ── Page Body ── */}
      <div className="pt-20 pb-12 md:pt-24 md:pb-16 px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6 sm:p-8 md:p-10">
          <h1 className="text-3xl md:text-4xl font-bold text-primary-500 mb-6 md:mb-8 text-center">
            Add Workout
          </h1>

          {/* ── Step 1: Select Type ── */}
          {!type && (
            <div className="flex flex-col items-center gap-4 md:gap-6">
              <p className="text-base md:text-lg font-medium text-gray-700">
                Choose workout type:
              </p>

              <button
                className="w-full sm:w-auto px-6 py-4 md:py-3 bg-secondary-500 text-white rounded-lg text-lg font-semibold hover:bg-secondary-600 transition active:scale-95"
                onClick={() => { setType("gym"); setShowTime(false); }}
              >
                💪 Gym
              </button>

              <button
                className="w-full sm:w-auto px-6 py-4 md:py-3 bg-accent-500 text-white rounded-lg text-lg font-semibold hover:bg-accent-600 transition active:scale-95"
                onClick={() => { setType("cardio"); setShowTime(false); }}
              >
                🚴 Cardio
              </button>
            </div>
          )}

          {/* ── Step 2: Form ── */}
          {type && (
            <form onSubmit={handleSubmit} className="space-y-5 mt-4">
              <button
                className="text-sm text-gray-500 hover:text-primary-500 transition"
                onClick={() => setType(null)}
                type="button"
              >
                ← Change workout type
              </button>

              {/* Activity */}
              <div>
                <label className="block text-gray-700 font-semibold mb-1 text-sm md:text-base">
                  Activity
                </label>
                <input
                  type="text"
                  value={activity}
                  onChange={(e) => setActivity(e.target.value)}
                  required
                  className="w-full border rounded-lg px-4 py-3 text-black text-base"
                  placeholder="E.g. Bench Press, Running, Squats"
                />
              </div>

              {/* Duration (cardio only) */}
              {type === "cardio" && (
                <div>
                  <label className="block text-gray-700 font-semibold mb-1 text-sm md:text-base">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={duration}
                    onChange={(e) => {
                      const value = e.target.value;
                      setDuration(value === "" ? "" : Number(value));
                    }}
                    required
                    className="w-full border rounded-lg px-4 py-3 text-black text-base"
                    placeholder="E.g. 30"
                  />
                </div>
              )}

              {/* Optional time */}
              <div>
                {!showTime ? (
                  <button
                    type="button"
                    onClick={() => setShowTime(true)}
                    className="text-sm text-black hover:text-primary-500 transition py-1"
                  >
                    ⏱ Edit time (optional)
                  </button>
                ) : (
                  <div className="mt-2 space-y-3 bg-gray-50 rounded-lg p-4">
                    <div>
                      <label className="block text-gray-600 font-medium mb-1 text-sm">
                        Date
                      </label>
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        max={new Date().toISOString().slice(0, 10)}
                        className="w-full border rounded-lg px-4 py-3 text-black text-base"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 font-medium mb-1 text-sm">
                        Time
                      </label>
                      <input
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="w-full border rounded-lg px-4 py-3 text-black text-base"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowTime(false)}
                      className="text-xs text-gray-500 hover:text-primary-500 transition"
                    >
                      Done
                    </button>
                  </div>
                )}
              </div>

              {/* Error */}
              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-primary-500 text-white py-4 md:py-3 rounded-lg text-lg font-semibold hover:bg-primary-600 transition active:scale-95"
              >
                Save Workout
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddWorkoutPage;