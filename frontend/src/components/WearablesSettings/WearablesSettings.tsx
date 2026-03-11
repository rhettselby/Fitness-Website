import { useState, useEffect } from "react";
import { API_URL } from "@/lib/config";
import { TokenService } from "@/utils/auth";

type DeviceName = "oura" | "strava" | "whoop";

const WearablesSettings = () => {
  const [loading, setLoading] = useState(false);
  const [connections, setConnections] = useState({
    oura: false,
    strava: false,
    whoop: false,
  });

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
    } catch {
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
    } catch {
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
      checkConnections();
    } catch {
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
    } catch {
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
    } catch {
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
      checkConnections();
    } catch {
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
    } catch {
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
    } catch {
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
      checkConnections();
    } catch {
      alert("Failed to disconnect Whoop");
    } finally {
      setLoading(false);
    }
  };

  // ── Shared card layout ──────────────────────────────────────────
  type DeviceCardProps = {
    name: string;
    description: string;
    connected: boolean;
    onConnect: () => void;
    onSync: () => void;
    onDisconnect: () => void;
  };

  const DeviceCard = ({ name, description, connected, onConnect, onSync, onDisconnect }: DeviceCardProps) => (
    <div className="border-2 border-gray-200 bg-white rounded-lg p-5 sm:p-6 mt-4 first:mt-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Info */}
        <div>
          <h3 className="text-xl sm:text-2xl font-semibold mb-1 text-accent-500">{name}</h3>
          <p className="text-gray-700 text-sm sm:text-base">{description}</p>
          {connected && (
            <span className="inline-block mt-2 text-xs font-semibold text-green-600 bg-green-50 border border-green-200 rounded-full px-2 py-0.5">
              Connected
            </span>
          )}
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-2 sm:gap-3 sm:flex-shrink-0">
          {!connected ? (
            <button
              onClick={onConnect}
              className="w-full sm:w-auto px-5 py-2.5 bg-secondary-500 text-white rounded-lg hover:bg-secondary-600 font-semibold transition active:scale-95 text-sm sm:text-base"
            >
              Connect {name}
            </button>
          ) : (
            <>
              <button
                onClick={onSync}
                disabled={loading}
                className="flex-1 sm:flex-none px-5 py-2.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 font-semibold disabled:bg-gray-400 transition active:scale-95 text-sm sm:text-base"
              >
                {loading ? "Syncing..." : "Sync Now"}
              </button>
              <button
                onClick={onDisconnect}
                disabled={loading}
                className="flex-1 sm:flex-none px-5 py-2.5 bg-white text-red-600 border-2 border-red-600 rounded-lg hover:bg-red-50 font-semibold disabled:bg-gray-400 disabled:text-white disabled:border-gray-400 transition active:scale-95 text-sm sm:text-base"
              >
                Disconnect
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-5 sm:p-8 mb-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-primary-500 mb-5 sm:mb-6">
        Wearable Devices
      </h2>

      <DeviceCard
        name="Oura Ring"
        description="Connect your Oura Ring to automatically sync workouts"
        connected={connections.oura}
        onConnect={connectOura}
        onSync={syncOura}
        onDisconnect={disconnectOura}
      />
      <DeviceCard
        name="Strava"
        description="Connect Strava to automatically sync your runs and rides"
        connected={connections.strava}
        onConnect={connectStrava}
        onSync={syncStrava}
        onDisconnect={disconnectStrava}
      />
      <DeviceCard
        name="Whoop"
        description="Connect your Whoop to automatically sync workouts"
        connected={connections.whoop}
        onConnect={connectWhoop}
        onSync={syncWhoop}
        onDisconnect={disconnectWhoop}
      />
    </div>
  );
};

export default WearablesSettings;