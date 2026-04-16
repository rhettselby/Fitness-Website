import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "@/lib/config";
import { TokenService } from "@/utils/auth";
import { motion, AnimatePresence } from "framer-motion";

type Group = {
  id: number;
  name: string;
  motto: string | null;
};

const Groups = () => {
  const navigate = useNavigate();

  const [groups, setGroups] = useState<Group[]>([]);
  const [loadingGroups, setLoadingGroups] = useState(true);

  const [joinId, setJoinId] = useState("");
  const [joinError, setJoinError] = useState("");
  const [joinLoading, setJoinLoading] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);

  const [createName, setCreateName] = useState("");
  const [createMotto, setCreateMotto] = useState("");
  const [createError, setCreateError] = useState("");
  const [createLoading, setCreateLoading] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  const joinInputRef = useRef<HTMLInputElement>(null);
  const createInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const token = TokenService.getAccessToken();
    if (!token) {
      navigate("/");
      return;
    }
    fetchGroups();
  }, []);

  useEffect(() => {
    if (joinOpen) setTimeout(() => joinInputRef.current?.focus(), 300);
  }, [joinOpen]);
  useEffect(() => {
    if (createOpen) setTimeout(() => createInputRef.current?.focus(), 300);
  }, [createOpen]);

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
      setJoinOpen(false);
      await fetchGroups();
    } catch {
      setJoinError("Something went wrong. Please try again.");
    } finally {
      setJoinLoading(false);
    }
  };

  const handleCreate = async () => {
    setCreateError("");
    if (!createName.trim()) {
      setCreateError("Please enter a group name.");
      return;
    }
    setCreateLoading(true);
    const token = TokenService.getAccessToken();
    try {
      const res = await fetch(`${API_URL}/groups/create_group/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: createName.trim(),
          motto: createMotto.trim() || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCreateError(data.error || "Failed to create group.");
        return;
      }
      setCreateName("");
      setCreateMotto("");
      setCreateOpen(false);
      await fetchGroups();
    } catch {
      setCreateError("Something went wrong. Please try again.");
    } finally {
      setCreateLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === "Enter") action();
  };

  return (
    <section className="w-full bg-primary-100 min-h-screen py-20 px-4">
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-primary-500 transition mb-8"
      >
        ← Back to Home
      </button>

      <div className="max-w-3xl mx-auto">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h1 className="font-montserrat text-3xl sm:text-4xl font-bold text-gray-900">
            Groups 🏅
          </h1>
          <p className="mt-2 text-gray-600 font-medium text-sm sm:text-base">
            Compete with friends and see who tops the leaderboard.
          </p>
        </motion.div>

        {/* ── Your Groups ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white border-2 border-gray-200 rounded-2xl p-5 sm:p-7 mb-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-2xl sm:text-3xl font-bold text-primary-500">
              Your Groups
            </h2>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
              {groups.length} {groups.length === 1 ? "group" : "groups"}
            </span>
          </div>

          {loadingGroups ? (
            <div className="flex flex-col gap-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-16 rounded-xl bg-gray-100 animate-pulse"
                  style={{ opacity: 1 - i * 0.2 }}
                />
              ))}
            </div>
          ) : groups.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-4xl mb-3">🏃</p>
              <p className="text-gray-500 text-sm font-medium">
                You haven't joined any groups yet.
              </p>
              <p className="text-gray-400 text-xs mt-1">
                Join or create one below to get started!
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {groups.map((group, index) => (
                <motion.div
                  key={group.id}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: index * 0.07 }}
                  whileHover={{ scale: 1.015, x: 4 }}
                  className="relative flex items-center justify-between border-2 border-yellow-300 bg-yellow-50 rounded-xl px-5 py-4 cursor-pointer transition-all group shadow-sm hover:shadow-md hover:border-yellow-400"
                  onClick={() =>
                    navigate(`/groups/${group.id}/leaderboard`, {
                      state: { groupName: group.name },
                    })
                  }
                >
                  <div>
                    <p className="font-bold text-gray-900 text-lg sm:text-xl">
                      {group.name}
                    </p>
                    {group.motto && (
                      <p className="text-xs text-gray-400 font-normal mt-0.5">
                        {group.motto}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 font-medium">ID: {group.id}</span>
                    <span className="text-sm font-bold text-primary-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      View →
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* ── Join / Create action buttons ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-2 gap-3 mb-3"
        >
          <button
            onClick={() => {
              setJoinOpen((v) => !v);
              setCreateOpen(false);
              setJoinError("");
            }}
            className={`relative overflow-hidden rounded-xl px-4 py-3 font-semibold text-sm transition-all duration-300 border-2 group
              ${joinOpen
                ? "bg-secondary-500 text-white border-secondary-500 shadow-lg shadow-secondary-200"
                : "bg-white text-secondary-600 border-secondary-300 hover:bg-secondary-50 hover:border-secondary-400"
              }`}
          >
            <span className="flex items-center justify-center gap-2">
              <span className={`transition-transform duration-300 ${joinOpen ? "rotate-45" : ""}`}>
                ＋
              </span>
              Join a Group
            </span>
          </button>

          <button
            onClick={() => {
              setCreateOpen((v) => !v);
              setJoinOpen(false);
              setCreateError("");
            }}
            className={`relative overflow-hidden rounded-xl px-4 py-3 font-semibold text-sm transition-all duration-300 border-2 group
              ${createOpen
                ? "bg-primary-500 text-white border-primary-500 shadow-lg shadow-primary-200"
                : "bg-white text-primary-600 border-primary-300 hover:bg-primary-50 hover:border-primary-400"
              }`}
          >
            <span className="flex items-center justify-center gap-2">
              <span className={`transition-transform duration-300 ${createOpen ? "rotate-45" : ""}`}>
                ✦
              </span>
              Create a Group
            </span>
          </button>
        </motion.div>

        {/* ── Collapsible: Join ── */}
        <AnimatePresence>
          {joinOpen && (
            <motion.div
              key="join-panel"
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: "auto", marginBottom: 12 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="bg-white border-2 border-secondary-300 rounded-xl p-5 shadow-sm">
                <p className="text-gray-500 text-xs font-medium mb-3 uppercase tracking-widest">
                  Enter a group ID to join
                </p>
                <div className="flex gap-2">
                  <input
                    ref={joinInputRef}
                    type="number"
                    placeholder="Group ID"
                    value={joinId}
                    onChange={(e) => setJoinId(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, handleJoin)}
                    className="flex-1 border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-secondary-400 text-gray-900 placeholder-gray-400"
                  />
                  <button
                    onClick={handleJoin}
                    disabled={joinLoading}
                    className="px-5 py-2.5 bg-secondary-500 text-white rounded-lg hover:bg-secondary-600 font-semibold disabled:bg-gray-300 transition-all active:scale-95 text-sm whitespace-nowrap"
                  >
                    {joinLoading ? "Joining…" : "Join →"}
                  </button>
                </div>
                {joinError && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-500 text-xs mt-2"
                  >
                    {joinError}
                  </motion.p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Collapsible: Create ── */}
        <AnimatePresence>
          {createOpen && (
            <motion.div
              key="create-panel"
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: "auto", marginBottom: 12 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="bg-white border-2 border-primary-300 rounded-xl p-5 shadow-sm">
                <p className="text-gray-500 text-xs font-medium mb-3 uppercase tracking-widest">
                  Name your new group
                </p>
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <input
                      ref={createInputRef}
                      type="text"
                      placeholder="Group name"
                      value={createName}
                      onChange={(e) => setCreateName(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, handleCreate)}
                      className="flex-1 border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary-400 text-gray-900 placeholder-gray-400"
                    />
                    <button
                      onClick={handleCreate}
                      disabled={createLoading}
                      className="px-5 py-2.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 font-semibold disabled:bg-gray-300 transition-all active:scale-95 text-sm whitespace-nowrap"
                    >
                      {createLoading ? "Creating…" : "Create →"}
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Group motto (optional)"
                    value={createMotto}
                    onChange={(e) => setCreateMotto(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, handleCreate)}
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary-400 text-gray-900 placeholder-gray-400"
                  />
                </div>
                {createError && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-500 text-xs mt-2"
                  >
                    {createError}
                  </motion.p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
};

export default Groups;