import { useState } from "react";
import { API_URL } from "@/lib/config";
import { TokenService } from "@/utils/auth";

const WearablesSettings = () => {
  const [loading, setLoading] = useState(false);

  const connectOura = async () => {
    const token = TokenService.getAccessToken();
    try {
      const response = await fetch(`${API_URL}/api/wearables/oura/connect/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      window.location.href = data.auth_url;
    } catch (error) {
      console.error("Error connecting to Oura:", error);
      alert("Failed to connect to Oura");
    }
  };

  const syncOura = async () => {
    setLoading(true);
    const token = TokenService.getAccessToken();
    try {
      const response = await fetch(`${API_URL}/api/wearables/oura/sync/`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      alert(`Synced ${data.workouts_added} workouts from Oura!`);
    } catch (error) {
      console.error("Error syncing Oura:", error);
      alert("Failed to sync Oura workouts");
    } finally {
      setLoading(false);
    }
  };

  const connectStrava = async () => {
    const token = TokenService.getAccessToken();
    try {
      const response = await fetch(`${API_URL}/api/wearables/strava/connect/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      window.location.href = data.auth_url;
    } catch (error) {
      console.error("Error connecting to Strava:", error);
      alert("Failed to connect to Strava");
    }
  };

  const syncStrava = async () => {
    setLoading(true);
    const token = TokenService.getAccessToken();
    try {
      const response = await fetch(`${API_URL}/api/wearables/strava/sync/`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      alert(`Synced ${data.workouts_added} workouts from Strava!`);
    } catch (error) {
      console.error("Error syncing Strava:", error);
      alert("Failed to sync Strava workouts");
    } finally {
      setLoading(false);
    }
  };

  const connectWhoop = async () => {
    const token = TokenService.getAccessToken();
    try {
      const response = await fetch(`${API_URL}/api/wearables/whoop/connect/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      window.location.href = data.auth_url;
    } catch (error) {
      console.error("Error connecting to Whoop:", error);
      alert("Failed to connect to Whoop");
    }
  };

  const syncWhoop = async () => {
    setLoading(true);
    const token = TokenService.getAccessToken();
    try {
      const response = await fetch(`${API_URL}/api/wearables/whoop/sync/`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      alert(`Synced ${data.workouts_added} workouts from Whoop!`);
    } catch (error) {
      console.error("Error syncing Whoop:", error);
      alert("Failed to sync Whoop workouts");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-8 mb-8">
      <h2 className="text-3xl font-bold text-primary-500 mb-6">
        Wearable Devices
      </h2>

      {/* Oura Section */}
      <div className="border-2 border-gray-200 text-accent-500 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-semibold mb-2">Oura Ring</h3>
            <p className="text-gray-600">
              Connect your Oura Ring to automatically sync workouts
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={connectOura}
              className="px-6 py-3 bg-secondary-500 text-white rounded-lg hover:bg-secondary-600 font-semibold"
            >
              Connect Oura
            </button>
            <button
              onClick={syncOura}
              disabled={loading}
              className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 font-semibold disabled:bg-gray-400"
            >
              {loading ? "Syncing..." : "Sync Now"}
            </button>
          </div>
        </div>
      </div>

      {/* Strava Section */}
      <div className="border-2 border-gray-200 text-accent-500 rounded-lg p-6 mt-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-semibold mb-2">Strava</h3>
            <p className="text-gray-600">
              Connect Strava to automatically sync your runs and rides
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={connectStrava}
              className="px-6 py-3 bg-secondary-500 text-white rounded-lg hover:bg-secondary-600 font-semibold"
            >
              Connect Strava
            </button>
            <button
              onClick={syncStrava}
              disabled={loading}
              className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 font-semibold disabled:bg-gray-400"
            >
              {loading ? "Syncing..." : "Sync Now"}
            </button>
          </div>
        </div>
      </div>

      {/* Whoop Section */}
      <div className="border-2 border-gray-200 text-accent-500 rounded-lg p-6 mt-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-semibold mb-2">Whoop</h3>
            <p className="text-gray-600">
              Connect your Whoop to automatically sync workouts and recovery
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={connectWhoop}
              className="px-6 py-3 bg-secondary-500 text-white rounded-lg hover:bg-secondary-600 font-semibold"
            >
              Connect Whoop
            </button>
            <button
              onClick={syncWhoop}
              disabled={loading}
              className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 font-semibold disabled:bg-gray-400"
            >
              {loading ? "Syncing..." : "Sync Now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WearablesSettings;