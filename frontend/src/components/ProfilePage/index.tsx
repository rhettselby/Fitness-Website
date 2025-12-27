import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/navbar";
import { SelectedPage } from "@/shared/types";
import { API_URL } from "@/lib/config";
import { TokenService } from "@/utils/auth";
import WearablesSettings from "@/components/WearablesSettings/WearablesSettings";

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
      headers: {
        Authorization: `Bearer ${token}`,
      },
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
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
        <div className="flex justify-center items-center h-screen">Loading profile…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar isTopOfPage={false} selectedPage={selectedPage} setSelectedPage={setSelectedPage} />
        <div className="flex justify-center items-center h-screen text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isTopOfPage={false} selectedPage={selectedPage} setSelectedPage={setSelectedPage} />

      <div className="pt-24 max-w-4xl mx-auto px-4">
        {/* Profile Header */}
        <div className="bg-white p-8 rounded-lg shadow mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-4xl font-bold text-primary-500">
              {user?.username}'s Profile
            </h1>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 bg-secondary-500 text-white rounded hover:bg-secondary-600"
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </button>
          </div>

          {!isEditing && profile && (
            <div className="space-y-2">
              {profile.bio && <p><b>Bio:</b> {profile.bio}</p>}
              {profile.location && <p><b>Location:</b> {profile.location}</p>}
              {profile.birthday && (
                <p>
                  <b>Birthday:</b>{" "}
                  {new Date(profile.birthday).toLocaleDateString()}
                </p>
              )}
            </div>
          )}

          {isEditing && (
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <label className="font-semibold">Bio</label>
                <textarea
                  className="w-full border p-2 rounded"
                  rows={3}
                  value={formData.bio ?? ""}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                />
              </div>

              <div>
                <label className="font-semibold">Location</label>
                <input
                  className="w-full border p-2 rounded"
                  value={formData.location ?? ""}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="font-semibold">Birthday</label>
                <input
                  type="date"
                  className="w-full border p-2 rounded"
                  value={formData.birthday ?? ""}
                  onChange={(e) =>
                    setFormData({ ...formData, birthday: e.target.value })
                  }
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2 bg-primary-500 text-white rounded hover:bg-primary-600"
              >
                Save Changes
              </button>
            </form>
          )}
        </div>

        {/* Wearables */}
        <WearablesSettings />

        {/* Workouts */}
        <div className="bg-white p-8 rounded-lg shadow">
          <h2 className="text-3xl font-bold mb-6">Your Workouts</h2>

          {workouts.map((w) => (
            <div key={w.id} className="border p-4 rounded mb-3">
              <p className="font-bold">{w.activity}</p>
              <p className="text-sm text-gray-500">{formatDate(w.date)}</p>
              {w.duration && <p>Duration: {w.duration} min</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;