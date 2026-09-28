import type { LeaderboardHistory } from "@/hooks/useLeaderboardHistory";

const pill =
  "rounded-full border border-primary-300 bg-white/70 px-3 py-1 text-xs font-semibold text-primary-500 shadow-sm transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40";

// Parse as local time: new Date("2026-09-21") is UTC midnight, which shows as Sep 20 in the US.
const formatDay = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" });

type Props = {
  history: LeaderboardHistory;
};

/** A "History" button that becomes prev/next week controls once history is open. */
const HistoryNav = ({ history }: Props) => {
  if (!history.open) {
    return (
      <button onClick={history.show} className={pill}>
        History
      </button>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <button
        onClick={history.older}
        disabled={!history.hasOlder || history.loading}
        aria-label="Previous week"
        className={pill}
      >
        ←
      </button>
      <span className="min-w-[7.5rem] text-center text-sm font-semibold text-gray-900">
        {history.week ? `Week of ${formatDay(history.week.week_start)}` : "History"}
      </span>
      <button
        onClick={history.newer}
        disabled={!history.hasNewer || history.loading}
        aria-label="Next week"
        className={pill}
      >
        →
      </button>
      <button onClick={history.hide} className={pill}>
        Current week
      </button>
    </div>
  );
};

export default HistoryNav;
