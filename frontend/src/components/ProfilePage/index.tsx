import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/navbar";
import { SelectedPage } from "@/shared/types";

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
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPage, setSelectedPage] = useState<SelectedPage>(SelectedPage.Home);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    fetch("/users/api/check-auth/", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.authenticated) {
          navigate("/");
          return;
        }
        // Fetch profile and workouts
        fetchProfileData();
      })
      .catch((err) => {
        console.error("Error checking auth:", err);
        setError("Failed to authenticate");
        setLoading(false);
      });
  }, [navigate]);

  const fetchProfileData = async () => {
    try {
      const response = await fetch("/profile/api/", {
        credentials: "include",
      });

      if (!response.ok) {
        if (response.status === 401) {
          navigate("/");
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ProfileResponse = await response.json();
      setWorkouts(data.workouts || []);
      setUser(data.user);
      setProfile(data.profile);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching profile data:", err);
      setError("Failed to load profile data");
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar 
          isTopOfPage={false} 
          selectedPage={selectedPage} 
          setSelectedPage={setSelectedPage} 
        />
        <div className="flex items-center justify-center h-screen">
          <p className="text-lg">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar 
          isTopOfPage={false} 
          selectedPage={selectedPage} 
          setSelectedPage={setSelectedPage} 
        />
        <div className="flex items-center justify-center h-screen">
          <p className="text-lg text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        isTopOfPage={false} 
        selectedPage={selectedPage} 
        setSelectedPage={setSelectedPage} 
      />
      <div className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4">
          {/* Profile Header */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h1 className="text-4xl font-bold text-primary-500 mb-4">
              {user?.username}'s Profile
            </h1>
            {profile && (
              <div className="space-y-2">
                {profile.bio && (
                  <p className="text-gray-700">
                    <span className="font-semibold">Bio:</span> {profile.bio}
                  </p>
                )}
                {profile.location && (
                  <p className="text-gray-700">
                    <span className="font-semibold">Location:</span> {profile.location}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Workouts Section with Scrollable Container */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-3xl font-bold text-primary-500 mb-6">Your Workouts</h2>
            {workouts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-lg text-gray-500">No workouts logged yet.</p>
                <p className="text-gray-400 mt-2">Start logging your workouts to see them here!</p>
              </div>
            ) : (
              <div 
                className="space-y-4 overflow-y-auto pr-2"
                style={{ 
                  maxHeight: '70vh',
                  scrollBehavior: 'smooth',
                }}
              >
                {workouts.map((workout) => (
                  <div
                    key={workout.id}
                    className="border-2 border-primary-300 rounded-lg p-6 hover:bg-primary-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
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
                            <span className="font-semibold">Duration:</span> {workout.duration} minutes
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
