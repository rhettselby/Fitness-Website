import { useState } from "react";
import { API_URL } from "@/lib/config";
import { TokenService } from "@/utils/auth";

export type HistoryEntry = { rank: number; user: string; score: number };

export type HistoryWeek = {
  week_start: string; // ISO date of the week's Monday
  week_end: string;
  leaderboard: HistoryEntry[];
};

async function authGet<T>(path: string): Promise<T> {
  const token = TokenService.getAccessToken();
  const res = await fetch(`${API_URL}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  return res.json();
}

/**
 * Paging through past leaderboard weeks. `basePath` is a history endpoint without the
 * week, e.g. "/api/leaderboard/history" or `/groups/leaderboard_history/${id}`:
 * GET `${basePath}/` lists archived weeks newest first, GET `${basePath}/<week>/` is one week.
 */
export const useLeaderboardHistory = (basePath: string) => {
  const [open, setOpen] = useState(false);
  const [weeks, setWeeks] = useState<string[]>([]);
  const [index, setIndex] = useState(0); // position in `weeks`; 0 is the most recent past week
  const [week, setWeek] = useState<HistoryWeek | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const run = async (task: () => Promise<void>) => {
    setLoading(true);
    setError("");
    try {
      await task();
    } catch {
      setError("Failed to load history. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const showWeek = (list: string[], i: number) =>
    run(async () => {
      setIndex(i);
      setWeek(list[i] ? await authGet<HistoryWeek>(`${basePath}/${list[i]}/`) : null);
    });

  // Open history on the most recent past week; the week list is refreshed each time.
  const show = () => {
    setOpen(true);
    run(async () => {
      const { weeks: list } = await authGet<{ weeks: string[] }>(`${basePath}/`);
      setWeeks(list);
      await showWeek(list, 0);
    });
  };

  return {
    open,
    loading,
    error,
    week,
    hasOlder: index < weeks.length - 1,
    hasNewer: index > 0,
    show,
    hide: () => setOpen(false),
    older: () => showWeek(weeks, index + 1),
    newer: () => showWeek(weeks, index - 1),
  };
};

export type LeaderboardHistory = ReturnType<typeof useLeaderboardHistory>;
