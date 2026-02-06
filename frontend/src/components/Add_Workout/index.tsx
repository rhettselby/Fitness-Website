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
  
  const [date, setDate] = useState(
  now.toISOString().slice(0, 10) // YYYY-MM-DD
);
  const [time, setTime] = useState(
  now.toTimeString().slice(0, 5) // HH:MM
);

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
    
    const dateTime = time
      ? `${date}T${time}`
      : `${date}T00:00`;

    formData.append("date", dateTime);

    if (type === "gym") {
      url = `${API_URL}/api/fitness/api/add/gym-jwt/`;
    } else if (type === "cardio") {
      url = `${API_URL}/api/fitness/api/add/cardio-jwt/`;
      if (duration === "" || duration === null || duration === undefined || Number(duration) <= 0) {
        setError("Please enter a valid duration (greater than 0) for cardio workouts.");
        return;
      }
      // Convert duration to string
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
          ...(token && {"Authorization": `Bearer ${token}`}),
        },
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
            const errorArray = Object.entries(err.errors).map(([field, messages]: [string, any]) => {
              const fieldName = field.charAt(0).toUpperCase() + field.slice(1);
              const msgArray = Array.isArray(messages) ? messages : [messages];
              return `${fieldName}: ${msgArray.join(", ")}`;
            });
            errorMessage = errorArray.join(". ");
          } else if (err.message) {
            errorMessage = err.message;
          } else if (err.error) {
            errorMessage = err.error;
          }
        } catch (parseError) {
          console.error("Failed to parse error response:", parseError);
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

      <div className="pt-24 pb-16">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-10">
          <h1 className="text-4xl font-bold text-primary-500 mb-8 text-center">
            Add Workout
          </h1>

          {/* Step 1: Select type */}
          {!type && (
            <div className="flex flex-col items-center gap-6">
              <p className="text-lg font-medium text-gray-700">
                Choose workout type:
              </p>

              <button
                className="px-6 py-3 bg-secondary-500 text-white rounded-lg text-lg font-semibold hover:bg-secondary-600 transition"
                onClick={() => {setType("gym"); setShowTime(false);}}
              >
                💪 Gym
              </button>

              <button
                className="px-6 py-3 bg-accent-500 text-white rounded-lg text-lg font-semibold hover:bg-accent-600 transition"
                onClick={() => {setType("cardio"); setShowTime(false);}}
              >
                🚴 Cardio
              </button>
            </div>
          )}

          {/* Step 2: Form */}
          {type && (
            <form onSubmit={handleSubmit} className="space-y-6 mt-6">
              <button
                className="text-sm text-gray-500 hover:text-primary-500"
                onClick={() => setType(null)}
                type="button"
              >
                ← Change workout type
              </button>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Activity
                </label>
                <input
                  type="text"
                  value={activity}
                  onChange={(e) => setActivity(e.target.value)}
                  required
                  className="w-full border rounded-lg px-4 py-2 text-black"
                  placeholder="E.g. Bench Press, Running, Squats"
                />
              </div>

              {type === "cardio" && (
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    required
                    className="w-full border rounded-lg px-4 py-2 text-black"
                    placeholder="E.g. 30"
                  />
                </div>
              )}

             <div>
              {!showTime ? (
              <button
                type="button"
                onClick={() => setShowTime(true)}
                className="text-sm text-black hover:text-primary-500"
              >
              ⏱ Edit time (optional)
              </button>
                ) : (
                <div className="mt-3 space-y-3">
                  <div>
                    <label className="block text-gray-600 font-medium mb-1 text-sm">
                      Date
                    </label>
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        max={new Date().toISOString().slice(0, 10)}
                        className="w-full border rounded-lg px-4 py-2 text-black"
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
                      className="w-full border rounded-lg px-4 py-2 text-black"
                    />
                  </div>

               <button
                type="button"
                onClick={() => setShowTime(false)}
                className="text-xs text-gray-500 hover:text-primary-500"
                >
                Done
              </button>
            </div>
            )}
          </div>

              {error && (
                <p className="text-red-500 text-center">{error}</p>
              )}

              <button
                type="submit"
                className="w-full bg-primary-500 text-white py-3 rounded-lg text-lg font-semibold hover:bg-primary-600 transition"
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