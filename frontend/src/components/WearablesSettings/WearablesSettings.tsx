import { useState, useEffect } from "react";
import { API_URL } from "@/lib/config";
import { TokenService } from "@/utils/auth";

const WearablesSettings = () => {
  const [loading, setLoading] = useState(false);
  const [connections, setConnections] = useState({
    oura: false,
    strava: false,
    whoop: false,
  });

  // Check which devices are connected on component mount
  useEffect(() => {
    checkConnections();
  }, []);

  const checkConnections = async () => {
    const token = TokenService.getAccessToken();
    try {
      const response = await fetch(`${API_URL}/api/wearables/status/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setConnections({
        oura: data.oura || false,
        strava: data.strava || false,
        whoop: data.whoop || false,
      });
    } catch (error) {
      console.error("Error checking connections:", error);
    }
  };

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

  const disconnectOura = async () => {
    if (!confirm("Are you sure you want to disconnect your Oura Ring?")) return;
    
    setLoading(true);
    const token = TokenService.getAccessToken();
    try {
      const response = await fetch(`${API_URL}/api/wearables/oura/disconnect/`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      alert(data.message || "Oura disconnected successfully!");
      checkConnections(); // Refresh connection status
    } catch (error) {
      console.error("Error disconnecting Oura:", error);
      alert("Failed to disconnect Oura");
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

  const disconnectStrava = async () => {
    if (!confirm("Are you sure you want to disconnect Strava?")) return;
    
    setLoading(true);
    const token = TokenService.getAccessToken();
    try {
      const response = await fetch(`${API_URL}/api/wearables/strava/disconnect/`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      alert(data.message || "Strava disconnected successfully!");
      checkConnections(); // Refresh connection status
    } catch (error) {
      console.error("Error disconnecting Strava:", error);
      alert("Failed to disconnect Strava");
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

  const disconnectWhoop = async () => {
    if (!confirm("Are you sure you want to disconnect Whoop?")) return;
    
    setLoading(true);
    const token = TokenService.getAccessToken();
    try {
      const response = await fetch(`${API_URL}/api/wearables/whoop/disconnect/`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      alert(data.message || "Whoop disconnected successfully!");
      checkConnections(); // Refresh connection status
    } catch (error) {
      console.error("Error disconnecting Whoop:", error);
      alert("Failed to disconnect Whoop");
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
      <div className="border-2 border-gray-200 bg-white rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-semibold mb-2 text-accent-500">Oura Ring</h3>
            <p className="text-gray-700">
              Connect your Oura Ring to automatically sync workouts
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {!connections.oura && (
              <button
                onClick={connectOura}
                className="px-6 py-3 bg-secondary-500 text-white rounded-lg hover:bg-secondary-600 font-semibold"
              >
                Connect Oura
              </button>
            )}
            {connections.oura && (
              <>
                <button
                  onClick={syncOura}
                  disabled={loading}
                  className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 font-semibold disabled:bg-gray-400"
                >
                  {loading ? "Syncing..." : "Sync Now"}
                </button>
                <button
                  onClick={disconnectOura}
                  disabled={loading}
                  className="px-6 py-3 bg-white text-red-600 border-2 border-red-600 rounded-lg hover:bg-red-50 font-semibold disabled:bg-gray-400 disabled:text-white disabled:border-gray-400"
                >
                  Disconnect
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Strava Section */}
      <div className="border-2 border-gray-200 bg-white rounded-lg p-6 mt-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-semibold mb-2 text-accent-500">Strava</h3>
            <p className="text-gray-700">
              Connect Strava to automatically sync your runs and rides
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {!connections.strava && (
              <button
                onClick={connectStrava}
                className="px-6 py-3 bg-secondary-500 text-white rounded-lg hover:bg-secondary-600 font-semibold"
              >
                Connect Strava
              </button>
            )}
            {connections.strava && (
              <>
                <button
                  onClick={syncStrava}
                  disabled={loading}
                  className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 font-semibold disabled:bg-gray-400"
                >
                  {loading ? "Syncing..." : "Sync Now"}
                </button>
                <button
                  onClick={disconnectStrava}
                  disabled={loading}
                  className="px-6 py-3 bg-white text-red-600 border-2 border-red-600 rounded-lg hover:bg-red-50 font-semibold disabled:bg-gray-400 disabled:text-white disabled:border-gray-400"
                >
                  Disconnect
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Whoop Section */}
      <div className="border-2 border-gray-200 bg-white rounded-lg p-6 mt-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-semibold mb-2 text-accent-500">Whoop</h3>
            <p className="text-gray-700">
              Connect your Whoop to automatically sync workouts
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {!connections.whoop && (
              <button
                onClick={connectWhoop}
                className="px-6 py-3 bg-secondary-500 text-white rounded-lg hover:bg-secondary-600 font-semibold"
              >
                Connect Whoop
              </button>
            )}
            {connections.whoop && (
              <>
                <button
                  onClick={syncWhoop}
                  disabled={loading}
                  className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 font-semibold disabled:bg-gray-400"
                >
                  {loading ? "Syncing..." : "Sync Now"}
                </button>
                <button
                  onClick={disconnectWhoop}
                  disabled={loading}
                  className="px-6 py-3 bg-white text-red-600 border-2 border-red-600 rounded-lg hover:bg-red-50 font-semibold disabled:bg-gray-400 disabled:text-white disabled:border-gray-400"
                >
                  Disconnect
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WearablesSettings;