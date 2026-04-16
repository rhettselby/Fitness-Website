import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/navbar";
import { SelectedPage } from "@/shared/types";
import { API_URL } from "@/lib/config";
import { TokenService } from "@/utils/auth";

type WorkoutType = "cardio" | "gym";
type GymView = "form" | "exercises" | "add-exercise";

interface Exercise {
  name: string;
  sets: { reps: number; weight: number }[];
}

interface ExerciseInput {
  name: string;
  numSets: string;
  reps: string;
  weight: string;
}

const AddWorkoutPage = () => {
  const [selectedPage, setSelectedPage] = useState<SelectedPage>(SelectedPage.Home);
  const [type, setType] = useState<WorkoutType | null>(null);
  const [activity, setActivity] = useState("");
  const [duration, setDuration] = useState<number | "">("");
  const [error, setError] = useState<string | null>(null);
  const [showTime, setShowTime] = useState(false);
  const [gymView, setGymView] = useState<GymView>("form");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [exerciseInput, setExerciseInput] = useState<ExerciseInput>({
    name: "",
    numSets: "",
    reps: "",
    weight: "",
  });
  const [exerciseError, setExerciseError] = useState<string | null>(null);

  const now = new Date();
  const [date, setDate] = useState(now.toISOString().slice(0, 10));
  const [time, setTime] = useState(now.toTimeString().slice(0, 5));

  const navigate = useNavigate();

  const handleAddExercise = () => {
    setExerciseError(null);
    const { name, numSets, reps, weight } = exerciseInput;

    if (!name.trim()) return setExerciseError("Please enter an exercise name.");
    if (!numSets || Number(numSets) < 1) return setExerciseError("Please enter a valid number of sets.");
    if (!reps || Number(reps) < 1) return setExerciseError("Please enter a valid number of reps.");
    if (weight === "" || Number(weight) < 0) return setExerciseError("Please enter a valid weight.");

    const sets = Array.from({ length: Number(numSets) }, () => ({
      reps: Number(reps),
      weight: Number(weight),
    }));

    setExercises((prev) => [...prev, { name: name.trim(), sets }]);
    setExerciseInput({ name: "", numSets: "", reps: "", weight: "" });
    setGymView("exercises");
  };

  const handleRemoveExercise = (index: number) => {
    setExercises((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!activity.trim()) {
      setError("Please enter an activity.");
      return;
    }

    let url = `${API_URL}`;
    const dateTime = time ? `${date}T${time}` : `${date}T00:00`;

    if (type === "gym") {
      url = `${API_URL}/api/fitness/api/add/gym-jwt/`;

      const token = TokenService.getAccessToken();
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify({
            activity: activity.trim(),
            date: dateTime,
            exercises,
          }),
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

    } else if (type === "cardio") {
      url = `${API_URL}/api/fitness/api/add/cardio-jwt/`;
      if (!duration || Number(duration) <= 0) {
        setError("Please enter a valid duration (greater than 0) for cardio workouts.");
        return;
      }

      const formData = new URLSearchParams();
      formData.append("activity", activity.trim());
      formData.append("date", dateTime);
      formData.append("duration", String(duration));

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
    } else {
      setError("Please select a workout type.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        isTopOfPage={false}
        selectedPage={selectedPage}
        setSelectedPage={setSelectedPage}
      />

      <div className="pt-20 pb-12 md:pt-24 md:pb-16 px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6 sm:p-8 md:p-10">

          {/* ── Step 1: Select Type ── */}
          {!type && (
            <>
              <h1 className="text-3xl md:text-4xl font-bold text-primary-500 mb-6 md:mb-8 text-center">
                Add Workout
              </h1>
              <div className="flex flex-col items-center gap-4 md:gap-6">
                <p className="text-base md:text-lg font-medium text-gray-700">
                  Choose workout type:
                </p>
                <button
                  className="w-full sm:w-auto px-6 py-4 md:py-3 bg-secondary-500 text-white rounded-lg text-lg font-semibold hover:bg-secondary-600 transition active:scale-95"
                  onClick={() => { setType("gym"); setGymView("form"); setShowTime(false); }}
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
            </>
          )}

          {/* ── Cardio Form ── */}
          {type === "cardio" && (
            <form onSubmit={handleSubmit} className="space-y-5 mt-4">
              <h1 className="text-3xl md:text-4xl font-bold text-primary-500 mb-6 text-center">
                Add Workout
              </h1>
              <button
                className="text-sm text-gray-500 hover:text-primary-500 transition"
                onClick={() => setType(null)}
                type="button"
              >
                ← Change workout type
              </button>
              <div>
                <label className="block text-gray-700 font-semibold mb-1 text-sm md:text-base">Activity</label>
                <input
                  type="text"
                  value={activity}
                  onChange={(e) => setActivity(e.target.value)}
                  required
                  className="w-full border rounded-lg px-4 py-3 text-black text-base"
                  placeholder="E.g. Running, Cycling"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1 text-sm md:text-base">Duration (minutes)</label>
                <input
                  type="number"
                  min="1"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value === "" ? "" : Number(e.target.value))}
                  required
                  className="w-full border rounded-lg px-4 py-3 text-black text-base"
                  placeholder="E.g. 30"
                />
              </div>
              <div>
                {!showTime ? (
                  <button type="button" onClick={() => setShowTime(true)} className="text-sm text-black hover:text-primary-500 transition py-1">
                    ⏱ Edit time (optional)
                  </button>
                ) : (
                  <div className="mt-2 space-y-3 bg-gray-50 rounded-lg p-4">
                    <div>
                      <label className="block text-gray-600 font-medium mb-1 text-sm">Date</label>
                      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} max={new Date().toISOString().slice(0, 10)} className="w-full border rounded-lg px-4 py-3 text-black text-base" />
                    </div>
                    <div>
                      <label className="block text-gray-600 font-medium mb-1 text-sm">Time</label>
                      <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full border rounded-lg px-4 py-3 text-black text-base" />
                    </div>
                    <button type="button" onClick={() => setShowTime(false)} className="text-xs text-gray-500 hover:text-primary-500 transition">Done</button>
                  </div>
                )}
              </div>
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              <button type="submit" className="w-full bg-primary-500 text-white py-4 md:py-3 rounded-lg text-lg font-semibold hover:bg-primary-600 transition active:scale-95">
                Save Workout
              </button>
            </form>
          )}

          {/* ── Gym: Main Form View ── */}
          {type === "gym" && gymView === "form" && (
            <form onSubmit={handleSubmit} className="space-y-5 mt-4">
              <h1 className="text-3xl md:text-4xl font-bold text-primary-500 mb-6 text-center">
                Add Workout
              </h1>
              <button className="text-sm text-gray-500 hover:text-primary-500 transition" onClick={() => setType(null)} type="button">
                ← Change workout type
              </button>
              <div>
                <label className="block text-gray-700 font-semibold mb-1 text-sm md:text-base">Activity</label>
                <input
                  type="text"
                  value={activity}
                  onChange={(e) => setActivity(e.target.value)}
                  required
                  className="w-full border rounded-lg px-4 py-3 text-black text-base"
                  placeholder="E.g. Push day, Leg day"
                />
              </div>
              <div>
                {!showTime ? (
                  <button type="button" onClick={() => setShowTime(true)} className="text-sm text-black hover:text-primary-500 transition py-1">
                    ⏱ Edit time (optional)
                  </button>
                ) : (
                  <div className="mt-2 space-y-3 bg-gray-50 rounded-lg p-4">
                    <div>
                      <label className="block text-gray-600 font-medium mb-1 text-sm">Date</label>
                      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} max={new Date().toISOString().slice(0, 10)} className="w-full border rounded-lg px-4 py-3 text-black text-base" />
                    </div>
                    <div>
                      <label className="block text-gray-600 font-medium mb-1 text-sm">Time</label>
                      <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full border rounded-lg px-4 py-3 text-black text-base" />
                    </div>
                    <button type="button" onClick={() => setShowTime(false)} className="text-xs text-gray-500 hover:text-primary-500 transition">Done</button>
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => setGymView("exercises")}
                className="w-full border border-gray-300 rounded-lg py-3 text-gray-700 font-semibold hover:bg-gray-50 transition flex items-center justify-center gap-2"
              >
                💪 Input workout data
                {exercises.length > 0 && (
                  <span className="ml-2 text-sm bg-primary-100 text-primary-600 px-2 py-0.5 rounded-full">
                    {exercises.length} exercise{exercises.length !== 1 ? "s" : ""}
                  </span>
                )}
              </button>
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              <button type="submit" className="w-full bg-primary-500 text-white py-4 md:py-3 rounded-lg text-lg font-semibold hover:bg-primary-600 transition active:scale-95">
                Save Workout
              </button>
            </form>
          )}

          {/* ── Gym: Exercise List View ── */}
          {type === "gym" && gymView === "exercises" && (
            <div className="space-y-4 mt-4">
              <button className="text-sm text-gray-500 hover:text-primary-500 transition" onClick={() => setGymView("form")} type="button">
                ← Back to workout
              </button>
              <h2 className="text-2xl font-bold text-primary-500 text-center">
                Exercises
                {exercises.length > 0 && (
                  <span className="ml-2 text-base font-normal text-gray-500">({exercises.length})</span>
                )}
              </h2>

              {exercises.length === 0 && (
                <p className="text-center text-gray-400 text-sm py-4">No exercises added yet.</p>
              )}

              <div className="space-y-3">
                {exercises.map((ex, i) => (
                  <div key={i} className="bg-gray-50 rounded-lg p-4 flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-gray-800">{ex.name}</p>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {ex.sets.length} set{ex.sets.length !== 1 ? "s" : ""} · {ex.sets[0].reps} reps · {ex.sets[0].weight} lbs max
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveExercise(i)}
                      className="text-gray-400 hover:text-red-500 transition text-lg ml-4 mt-0.5"
                      type="button"
                      aria-label="Remove exercise"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setGymView("add-exercise")}
                className="w-full border border-dashed border-gray-300 rounded-lg py-3 text-gray-600 font-medium hover:bg-gray-50 transition"
              >
                + Add exercise
              </button>

              <button
                type="button"
                onClick={() => setGymView("form")}
                className="w-full bg-primary-500 text-white py-3 rounded-lg text-lg font-semibold hover:bg-primary-600 transition active:scale-95"
              >
                Done
              </button>
            </div>
          )}

          {/* ── Gym: Add Exercise View ── */}
          {type === "gym" && gymView === "add-exercise" && (
            <div className="space-y-4 mt-4">
              <button className="text-sm text-gray-500 hover:text-primary-500 transition" onClick={() => setGymView("exercises")} type="button">
                ← Back to exercises
              </button>
              <h2 className="text-2xl font-bold text-primary-500 text-center">Add Exercise</h2>

              <div>
                <label className="block text-gray-700 font-semibold mb-1 text-sm md:text-base">Exercise name</label>
                <input
                  type="text"
                  value={exerciseInput.name}
                  onChange={(e) => setExerciseInput((p) => ({ ...p, name: e.target.value }))}
                  className="w-full border rounded-lg px-4 py-3 text-black text-base"
                  placeholder="E.g. Bench Press"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1 text-sm"># of sets</label>
                  <input
                    type="number"
                    min="1"
                    value={exerciseInput.numSets}
                    onChange={(e) => setExerciseInput((p) => ({ ...p, numSets: e.target.value }))}
                    className="w-full border rounded-lg px-4 py-3 text-black text-base"
                    placeholder="3"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1 text-sm">Reps per set</label>
                  <input
                    type="number"
                    min="1"
                    value={exerciseInput.reps}
                    onChange={(e) => setExerciseInput((p) => ({ ...p, reps: e.target.value }))}
                    className="w-full border rounded-lg px-4 py-3 text-black text-base"
                    placeholder="10"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1 text-sm">Max weight (lbs)</label>
                  <input
                    type="number"
                    min="0"
                    value={exerciseInput.weight}
                    onChange={(e) => setExerciseInput((p) => ({ ...p, weight: e.target.value }))}
                    className="w-full border rounded-lg px-4 py-3 text-black text-base"
                    placeholder="135"
                  />
                </div>
              </div>

              {exerciseError && <p className="text-red-500 text-sm text-center">{exerciseError}</p>}

              <button
                type="button"
                onClick={handleAddExercise}
                className="w-full bg-primary-500 text-white py-3 rounded-lg text-lg font-semibold hover:bg-primary-600 transition active:scale-95"
              >
                Add exercise
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AddWorkoutPage;