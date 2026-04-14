import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "@/lib/config";
import { TokenService } from "@/utils/auth";
import { motion } from "framer-motion";
import Class from "@/components/Leaderboard/Class";

type Group = {
  id: number;
  name: string;
};

type LeaderboardEntry = {
  rank: number;
  user: string;
  score: number;
};

const Groups = () => {
  const navigate = useNavigate();

  // ── State ──
  const [groups, setGroups] = useState<Group[]>([]);
  const [loadingGroups, setLoadingGroups] = useState(true);

  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);

  const [joinId, setJoinId] = useState("");
  const [joinError, setJoinError] = useState("");
  const [joinLoading, setJoinLoading] = useState(false);

  const [createName, setCreateName] = useState("");
  const [createError, setCreateError] = useState("");
  const [createLoading, setCreateLoading] = useState(false);

  // ── Auth guard ──
  useEffect(() => {
    const token = TokenService.getAccessToken();
    if (!token) {
      navigate("/");
      return;
    }
    fetchGroups();
  }, []);

  // ── Fetch user's groups ──
  const fetchGroups = async () => {
    setLoadingGroups(true);
    const token = TokenService.getAccessToken();
    try {
      const res = await fetch(`${API_URL}/groups/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setGroups(data.groups || []);
    } catch {
      setGroups([]);
    } finally {
      setLoadingGroups(false);
    }
  };

  // ── Fetch leaderboard for a group ──
  const fetchLeaderboard = async (group: Group) => {
    setSelectedGroup(group);
    setLeaderboard([]);
    setLoadingLeaderboard(true);
    const token = TokenService.getAccessToken();
    try {
      const res = await fetch(`${API_URL}/groups/get_leaderboard/${group.id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setLeaderboard(data.leaderboard || []);
    } catch {
      setLeaderboard([]);
    } finally {
      setLoadingLeaderboard(false);
    }
  };

  // ── Join group ──
  const handleJoin = async () => {
    setJoinError("");
    const id = parseInt(joinId);
    if (!joinId || isNaN(id)) {
      setJoinError("Please enter a valid group ID.");
      return;
    }
    setJoinLoading(true);
    const token = TokenService.getAccessToken();
    try {
      const res = await fetch(`${API_URL}/groups/join_group/${id}/`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        setJoinError(data.error || "Failed to join group.");
        return;
      }
      setJoinId("");
      await fetchGroups();
    } catch {
      setJoinError("Something went wrong. Please try again.");
    } finally {
      setJoinLoading(false);
    }
  };

  // ── Create group ──
  const handleCreate = async () => {
    setCreateError("");
    if (!createName.trim()) {
      setCreateError("Please enter a group name.");
      return;
    }
    setCreateLoading(true);
    const token = TokenService.getAccessToken();
    console.log("Token at create time:", token);
    try {
      const res = await fetch(`${API_URL}/groups/create_group/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: createName.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCreateError(data.error || "Failed to create group.");
        return;
      }
      setCreateName("");
      await fetchGroups();
    } catch {
      setCreateError("Something went wrong. Please try again.");
    } finally {
      setCreateLoading(false);
    }
  };

  return (
    <section className="w-full bg-primary-100 min-h-screen py-24 px-4">
      <button
  onClick={() => navigate("/")}
  className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-primary-500 transition mb-6"
>
  ← Back to Home
</button>
      <div className="max-w-4xl mx-auto">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h1 className="font-montserrat text-3xl sm:text-4xl font-bold text-gray-900">
            Groups 🏅
          </h1>
          <p className="mt-3 text-gray-700 font-semibold text-sm sm:text-base">
            Compete with friends and see who tops the leaderboard.
          </p>
        </motion.div>

        {/* ── Join + Create cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">

          {/* Join */}
          <div className="border-2 border-gray-200 bg-white rounded-lg p-5 sm:p-6">
            <h3 className="text-xl font-semibold mb-1 text-accent-500">Join a Group</h3>
            <p className="text-gray-700 text-sm mb-4">Enter a group ID to join an existing group.</p>
            <input
              type="number"
              placeholder="Group ID"
              value={joinId}
              onChange={(e) => setJoinId(e.target.value)}
              className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm mb-3 focus:outline-none focus:border-primary-400"
            />
            {joinError && <p className="text-red-500 text-xs mb-2">{joinError}</p>}
            <button
              onClick={handleJoin}
              disabled={joinLoading}
              className="w-full px-5 py-2.5 bg-secondary-500 text-white rounded-lg hover:bg-secondary-600 font-semibold disabled:bg-gray-400 transition active:scale-95 text-sm"
            >
              {joinLoading ? "Joining..." : "Join Group"}
            </button>
          </div>

          {/* Create */}
          <div className="border-2 border-gray-200 bg-white rounded-lg p-5 sm:p-6">
            <h3 className="text-xl font-semibold mb-1 text-accent-500">Create a Group</h3>
            <p className="text-gray-700 text-sm mb-4">Start a new group and invite your friends.</p>
            <input
              type="text"
              placeholder="Group name"
              value={createName}
              onChange={(e) => setCreateName(e.target.value)}
              className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm mb-3 focus:outline-none focus:border-primary-400"
            />
            {createError && <p className="text-red-500 text-xs mb-2">{createError}</p>}
            <button
              onClick={handleCreate}
              disabled={createLoading}
              className="w-full px-5 py-2.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 font-semibold disabled:bg-gray-400 transition active:scale-95 text-sm"
            >
              {createLoading ? "Creating..." : "Create Group"}
            </button>
          </div>

        </div>

        {/* ── Your Groups ── */}
        <div className="bg-white border-2 border-gray-200 rounded-lg p-5 sm:p-6 mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-primary-500 mb-5">
            Your Groups
          </h2>

          {loadingGroups ? (
            <p className="text-gray-500 text-sm">Loading groups...</p>
          ) : groups.length === 0 ? (
            <p className="text-gray-500 text-sm">You haven't joined any groups yet.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {groups.map((group) => (
                <div
                  key={group.id}
                  className={`flex items-center justify-between border-2 rounded-lg px-4 py-3 cursor-pointer transition ${
                    selectedGroup?.id === group.id
                      ? "border-primary-400 bg-primary-50"
                      : "border-gray-200 bg-white hover:border-primary-300"
                  }`}
                  onClick={() => fetchLeaderboard(group)}
                >
                  <div>
                    <p className="font-semibold text-gray-900">{group.name}</p>
                    <p className="text-xs text-gray-500">ID: {group.id}</p>
                  </div>
                  <span className="text-sm font-semibold text-primary-500">
                    {selectedGroup?.id === group.id ? "Viewing ▾" : "View →"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Group Leaderboard ── */}
        {selectedGroup && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white border-2 border-gray-200 rounded-lg p-5 sm:p-6"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-primary-500 mb-2">
              {selectedGroup.name} — Leaderboard 🏆
            </h2>
            <p className="text-gray-700 text-sm mb-6">
              Top members ranked by score.
            </p>

            {loadingLeaderboard ? (
              <p className="text-gray-500 text-sm">Loading leaderboard...</p>
            ) : leaderboard.length === 0 ? (
              <p className="text-gray-500 text-sm">No members in this group yet.</p>
            ) : (
              <>
                {/* Mobile: 2-col grid */}
                <div className="grid grid-cols-2 gap-4 sm:hidden">
                  {leaderboard.map((entry) => (
                    <Class
                      key={entry.user}
                      name={`#${entry.rank} ${entry.user}`}
                      description={`Score: ${entry.score}`}
                      image=""
                      rank={entry.rank}
                    />
                  ))}
                </div>

                {/* sm+: horizontal scroll row */}
                <div className="hidden sm:flex justify-center overflow-x-auto pb-2">
                  <ul className="inline-flex whitespace-nowrap gap-3">
                    {leaderboard.map((entry) => (
                      <Class
                        key={entry.user}
                        name={`#${entry.rank} ${entry.user}`}
                        description={`Score: ${entry.score}`}
                        image=""
                        rank={entry.rank}
                      />
                    ))}
                  </ul>
                </div>
              </>
            )}
          </motion.div>
        )}

      </div>
    </section>
  );
};

export default Groups;