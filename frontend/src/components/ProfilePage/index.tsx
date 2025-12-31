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

  const [formData, setFormData] = useState<ProfileData>({
    bio: "",
    location: "",
    birthday: "",
  });

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
    if (!token) {
      navigate("/");
      return;
    }

    fetch(`${API_URL}/users/api/check-auth-jwt/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.authenticated) {
          navigate("/");
          return;
        }
        fetchProfileData();
      })
      .catch(() => {
        setError("Failed to authenticate");
        setLoading(false);
      });
  }, [navigate]);

  const fetchProfileData = async () => {
    try {
      const token = TokenService.getAccessToken();
      if (!token) {
        navigate("/");
        return;
      }

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

      setLoading(false);
    } catch {
      setError("Failed to load profile");
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = TokenService.getAccessToken();
      const res = await fetch(`${API_URL}/api/profile/editprofile-jwt/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
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

      <div className="pt-24 pb-16 max-w-4xl mx-auto px-4">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold text-primary-500">
              {user?.username}'s Profile
            </h1>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 bg-secondary-500 text-white rounded-md hover:bg-secondary-600"
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </button>
          </div>

          {!isEditing && profile && (
            <div className="space-y-2">
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
                  ? new Date(profile.birthday + 'T00:00:00').toLocaleDateString()
                  : <span className="text-gray-400 italic">Not set</span>}
              </p>
            </div>
          )}
          
          {isEditing && (
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <label className="block font-semibold mb-1">Bio</label>
                <textarea
                  className="w-full border rounded-md p-2 text-black"
                  rows={3}
                  value={formData.bio ?? ""}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Location</label>
                <input
                  type="text"
                  className="w-full border rounded-md p-2 text-black"
                  value={formData.location ?? ""}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Birthday</label>
                <input
                  type="date"
                  className="w-full border rounded-md p-2 text-black"
                  value={formData.birthday ?? ""}
                  onChange={(e) =>
                    setFormData({ ...formData, birthday: e.target.value })
                  }
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600"
              >
                Save Changes
              </button>
            </form>
          )}
        </div>

        {/* Workouts Section */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold text-primary-500 mb-6">
            Your Workouts
          </h2>

          {workouts.length === 0 ? (
            <p className="text-gray-500">No workouts logged yet.</p>
          ) : (
            <div className="space-y-4">
              {workouts.map((workout) => (
                <div
                  key={workout.id}
                  className="border-2 border-primary-300 rounded-lg p-6 hover:bg-primary-50 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        workout.type === "cardio"
                          ? "bg-accent-500 text-white"
                          : "bg-secondary-500 text-white"
                      }`}
                    >
                      {workout.type.toUpperCase()}
                    </span>

                    <h3 className="text-xl font-bold text-gray-800">
                      {workout.activity}
                    </h3>
                  </div>

                  <p className="text-gray-600 text-sm">
                    {formatDate(workout.date)}
                  </p>

                  {workout.duration && (
                    <p className="text-gray-700 mt-2">
                      <span className="font-semibold">Duration:</span>{" "}
                      {workout.duration} minutes
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