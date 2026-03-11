import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/navbar";
import { SelectedPage } from "@/shared/types";
import { API_URL } from "@/lib/config";
import { TokenService } from "@/utils/auth";

type Workout = {
  id: number;
  type: "cardio" | "gym";
  activity: string;
  date: string;
  duration?: number | null;
};

type ProfileData = {
  bio: string | null;
  location: string | null;
  birthday: string | null;
};

type User = {
  id: number;
  username: string;
};

type ProfileResponse = {
  workouts: Workout[];
  user: User;
  profile: ProfileData;
};

const ProfilePage = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [formData, setFormData] = useState<ProfileData>({ bio: "", location: "", birthday: "" });
  const [birthdayInputs, setBirthdayInputs] = useState({ month: "", day: "", year: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPage, setSelectedPage] = useState<SelectedPage>(SelectedPage.Home);

  const navigate = useNavigate();

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  useEffect(() => {
    const token = TokenService.getAccessToken();
    if (!token) { navigate("/"); return; }

    fetch(`${API_URL}/users/api/check-auth-jwt/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.authenticated) { navigate("/"); return; }
        fetchProfileData();
      })
      .catch(() => { setError("Failed to authenticate"); setLoading(false); });
  }, [navigate]);

  const fetchProfileData = async () => {
    try {
      const token = TokenService.getAccessToken();
      if (!token) { navigate("/"); return; }

      const res = await fetch(`${API_URL}/api/profile/profile-jwt/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();

      const data: ProfileResponse = await res.json();
      setWorkouts(data.workouts);
      setUser(data.user);
      setProfile(data.profile);
      setFormData({
        bio: data.profile?.bio ?? "",
        location: data.profile?.location ?? "",
        birthday: data.profile?.birthday ?? "",
      });

      if (data.profile?.birthday) {
        const d = new Date(data.profile.birthday);
        setBirthdayInputs({
          month: String(d.getMonth() + 1).padStart(2, "0"),
          day: String(d.getDate()).padStart(2, "0"),
          year: String(d.getFullYear()),
        });
      }

      setLoading(false);
    } catch {
      setError("Failed to load profile");
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const { month, day, year } = birthdayInputs;
    const formattedBirthday = month && day && year ? `${year}-${month}-${day}` : null;

    try {
      const token = TokenService.getAccessToken();
      const res = await fetch(`${API_URL}/api/profile/editprofile-jwt/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...formData, birthday: formattedBirthday }),
      });

      const data = await res.json();
      if (!data.success) throw new Error();
      setProfile(data.profile);
      setIsEditing(false);
    } catch {
      alert("Failed to update profile");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar isTopOfPage={false} selectedPage={selectedPage} setSelectedPage={setSelectedPage} />
        <div className="flex items-center justify-center h-screen">
          <p className="text-lg">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar isTopOfPage={false} selectedPage={selectedPage} setSelectedPage={setSelectedPage} />
        <div className="flex items-center justify-center h-screen">
          <p className="text-lg text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isTopOfPage={false} selectedPage={selectedPage} setSelectedPage={setSelectedPage} />

      <div className="pt-20 pb-12 md:pt-24 md:pb-16 max-w-4xl mx-auto px-4 sm:px-6">

        {/* ── Profile Header ── */}
        <div className="bg-white rounded-lg shadow-md p-5 sm:p-8 mb-6 md:mb-8">

          {/* Name + Edit button */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-500">
              {user?.username}'s Profile
            </h1>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="self-start sm:self-auto px-4 py-2 bg-secondary-500 text-white rounded-md hover:bg-secondary-600 transition text-sm sm:text-base whitespace-nowrap"
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </button>
          </div>

          {/* View mode */}
          {!isEditing && profile && (
            <div className="space-y-2 text-sm sm:text-base">
              <p className="text-gray-700">
                <span className="font-semibold">Bio:</span>{" "}
                {profile.bio || <span className="text-gray-400 italic">Not set</span>}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Location:</span>{" "}
                {profile.location || <span className="text-gray-400 italic">Not set</span>}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Birthday:</span>{" "}
                {profile.birthday
                  ? new Date(profile.birthday + "T00:00:00").toLocaleDateString()
                  : <span className="text-gray-400 italic">Not set</span>}
              </p>
            </div>
          )}

          {/* Edit mode */}
          {isEditing && (
            <form onSubmit={handleProfileUpdate} className="space-y-4 mt-2">
              <div>
                <label className="block font-semibold mb-1 text-sm sm:text-base">Bio</label>
                <textarea
                  className="w-full border rounded-md p-2 text-black text-base"
                  rows={3}
                  value={formData.bio ?? ""}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-sm sm:text-base">Location</label>
                <input
                  type="text"
                  className="w-full border rounded-md p-2 text-black text-base"
                  value={formData.location ?? ""}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-sm sm:text-base">Birthday</label>
                <div className="grid grid-cols-3 gap-2">
                  <select
                    className="border rounded-md p-2 text-black text-sm"
                    value={birthdayInputs.month}
                    onChange={(e) => setBirthdayInputs((prev) => ({ ...prev, month: e.target.value }))}
                  >
                    <option value="">Month</option>
                    {[...Array(12)].map((_, i) => (
                      <option key={i} value={String(i + 1).padStart(2, "0")}>
                        {new Date(2000, i, 1).toLocaleString("default", { month: "long" })}
                      </option>
                    ))}
                  </select>

                  <select
                    className="border rounded-md p-2 text-black text-sm"
                    value={birthdayInputs.day}
                    onChange={(e) => setBirthdayInputs((prev) => ({ ...prev, day: e.target.value }))}
                  >
                    <option value="">Day</option>
                    {[...Array(31)].map((_, i) => (
                      <option key={i} value={String(i + 1).padStart(2, "0")}>{i + 1}</option>
                    ))}
                  </select>

                  <select
                    className="border rounded-md p-2 text-black text-sm"
                    value={birthdayInputs.year}
                    onChange={(e) => setBirthdayInputs((prev) => ({ ...prev, year: e.target.value }))}
                  >
                    <option value="">Year</option>
                    {[...Array(100)].map((_, i) => {
                      const year = new Date().getFullYear() - i;
                      return <option key={year} value={year}>{year}</option>;
                    })}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition active:scale-95"
              >
                Save Changes
              </button>
            </form>
          )}
        </div>

        {/* ── Workouts Section ── */}
        <div className="bg-white rounded-lg shadow-md p-5 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-primary-500 mb-5 md:mb-6">
            Your Workouts
          </h2>

          {workouts.length === 0 ? (
            <p className="text-gray-500">No workouts logged yet.</p>
          ) : (
            <div className="space-y-3 md:space-y-4">
              {workouts.map((workout) => (
                <div
                  key={workout.id}
                  className="border-2 border-primary-300 rounded-lg p-4 sm:p-6 hover:bg-primary-50 transition-colors"
                >
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${
                        workout.type === "cardio"
                          ? "bg-accent-500 text-white"
                          : "bg-secondary-500 text-white"
                      }`}
                    >
                      {workout.type.toUpperCase()}
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                      {workout.activity}
                    </h3>
                  </div>

                  <p className="text-gray-600 text-xs sm:text-sm">
                    {formatDate(workout.date)}
                  </p>

                  {workout.duration && (
                    <p className="text-gray-700 mt-1 sm:mt-2 text-sm">
                      <span className="font-semibold">Duration:</span> {workout.duration} minutes
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;