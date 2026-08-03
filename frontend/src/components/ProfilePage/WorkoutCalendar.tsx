import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon, XMarkIcon } from "@heroicons/react/24/solid";

type WorkoutType = "cardio" | "gym" | "sport";

type Workout = {
  id: number;
  type: WorkoutType;
  activity: string;
  date: string;
  duration?: number | null;
};

type Props = {
  workouts: Workout[];
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MAX_DOTS = 3;

// Reuses the colors the community feed already assigns each type so a workout
// reads the same on both pages.
const TYPE_COLOR: Record<WorkoutType, string> = {
  cardio: "bg-accent-500",
  gym: "bg-secondary-500",
  sport: "bg-purple-600",
};

const TYPE_LABEL: Record<WorkoutType, string> = {
  cardio: "Cardio",
  gym: "Gym",
  sport: "Sport",
};

// Bucket keys are built from local-time getters, not from the raw ISO string,
// so a late-evening workout lands on the same day the cell and modal display it.
const dayKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

// Months collapsed to a single comparable integer, used for nav clamping.
const monthIndex = (year: number, month: number) => year * 12 + month;
const fromMonthIndex = (index: number) => ({
  year: Math.floor(index / 12),
  month: index % 12,
});

// Unknown types can still arrive if the backend gains a workout kind before the
// frontend knows about it, so fall back to a neutral swatch instead of silently
// coloring it like an existing type.
const typeDot = (type: WorkoutType) => TYPE_COLOR[type] ?? "bg-gray-400";

const typeBadge = (type: WorkoutType) => `${typeDot(type)} text-white`;

const typeLabel = (type: WorkoutType) => TYPE_LABEL[type] ?? type;

const WorkoutCalendar = ({ workouts }: Props) => {
  const today = new Date();
  const [cursor, setCursor] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });
  const [direction, setDirection] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const byDay = useMemo(() => {
    const map = new Map<string, Workout[]>();
    for (const workout of workouts) {
      const key = dayKey(new Date(workout.date));
      const bucket = map.get(key);
      if (bucket) bucket.push(workout);
      else map.set(key, [workout]);
    }
    for (const bucket of map.values()) {
      bucket.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
    return map;
  }, [workouts]);

  const latestMonthIndex = useMemo(() => {
    let latest: number | null = null;
    for (const workout of workouts) {
      const d = new Date(workout.date);
      const index = monthIndex(d.getFullYear(), d.getMonth());
      if (latest === null || index > latest) latest = index;
    }
    return latest;
  }, [workouts]);

  const earliestMonthIndex = useMemo(() => {
    let earliest: number | null = null;
    for (const workout of workouts) {
      const d = new Date(workout.date);
      const index = monthIndex(d.getFullYear(), d.getMonth());
      if (earliest === null || index < earliest) earliest = index;
    }
    return earliest;
  }, [workouts]);

  const nowIndex = monthIndex(today.getFullYear(), today.getMonth());
  const cursorIndex = monthIndex(cursor.year, cursor.month);
  // Never navigate past the current month (workouts are stamped on save, so
  // none can be in the future) or before the first month the user logged one.
  const maxIndex = nowIndex;
  const minIndex = earliestMonthIndex === null ? nowIndex : Math.min(earliestMonthIndex, nowIndex);

  const goToMonth = (index: number, dir: number) => {
    if (index < minIndex || index > maxIndex) return;
    setDirection(dir);
    setCursor(fromMonthIndex(index));
  };

  const monthStats = useMemo(() => {
    let count = 0;
    let minutes = 0;
    const activeDays = new Set<string>();
    for (const workout of workouts) {
      const d = new Date(workout.date);
      if (d.getFullYear() !== cursor.year || d.getMonth() !== cursor.month) continue;
      count += 1;
      minutes += workout.duration ?? 0;
      activeDays.add(dayKey(d));
    }
    return { count, minutes: Math.round(minutes), activeDays: activeDays.size };
  }, [workouts, cursor]);

  const firstWeekday = new Date(cursor.year, cursor.month, 1).getDay();
  const daysInMonth = new Date(cursor.year, cursor.month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array<null>(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const selectedWorkouts = selectedDate ? byDay.get(dayKey(selectedDate)) ?? [] : [];

  useEffect(() => {
    if (!selectedDate) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedDate(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedDate]);

  const monthLabel = new Date(cursor.year, cursor.month, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div>
      {/* ── Month navigation ── */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={() => goToMonth(cursorIndex - 1, -1)}
          disabled={cursorIndex <= minIndex}
          aria-label="Previous month"
          className="p-2 rounded-full text-primary-500 hover:bg-primary-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </button>

        <h3 className="text-lg sm:text-xl font-bold text-gray-800">{monthLabel}</h3>

        <button
          type="button"
          onClick={() => goToMonth(cursorIndex + 1, 1)}
          disabled={cursorIndex >= maxIndex}
          aria-label="Next month"
          className="p-2 rounded-full text-primary-500 hover:bg-primary-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
        >
          <ChevronRightIcon className="h-5 w-5" />
        </button>
      </div>

      {/* ── Month summary ── */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-5">
        {[
          { label: "Workouts", value: monthStats.count },
          { label: "Active days", value: monthStats.activeDays },
          { label: "Minutes", value: monthStats.minutes },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-gray-200 py-2 px-1 text-center"
          >
            <p className="text-lg sm:text-xl font-extrabold text-primary-500">{stat.value}</p>
            <p className="text-[10px] sm:text-xs text-gray-600 uppercase tracking-wide">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* ── Weekday header ── */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-1">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="text-center text-[10px] sm:text-xs font-semibold text-gray-400 uppercase"
          >
            <span className="sm:hidden">{day.charAt(0)}</span>
            <span className="hidden sm:inline">{day}</span>
          </div>
        ))}
      </div>

      {/* ── Day grid ── */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={`${cursor.year}-${cursor.month}`}
          className="grid grid-cols-7 gap-1 sm:gap-2"
          initial={{ opacity: 0, x: direction * 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction * -24 }}
          transition={{ duration: 0.18 }}
        >
          {cells.map((day, index) => {
            if (day === null) {
              return <div key={`pad-${index}`} className="aspect-square" />;
            }

            const date = new Date(cursor.year, cursor.month, day);
            const dayWorkouts = byDay.get(dayKey(date)) ?? [];
            const isToday = dayKey(date) === dayKey(today);

            if (dayWorkouts.length === 0) {
              return (
                <div
                  key={day}
                  className={`aspect-square rounded-lg border border-gray-200 flex items-start justify-center pt-1 text-xs sm:text-sm text-gray-400 ${
                    isToday ? "ring-2 ring-accent-500" : ""
                  }`}
                >
                  {day}
                </div>
              );
            }

            return (
              <button
                key={day}
                type="button"
                onClick={() => setSelectedDate(date)}
                aria-label={`${date.toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                })}, ${dayWorkouts.length} workout${dayWorkouts.length === 1 ? "" : "s"}`}
                className={`aspect-square rounded-lg border border-primary-300 bg-primary-100 hover:bg-primary-300 active:scale-95 transition-all flex flex-col items-center justify-between py-1 ${
                  isToday ? "ring-2 ring-accent-500" : ""
                }`}
              >
                <span className="text-xs sm:text-sm font-bold text-gray-800">{day}</span>
                <span className="flex items-center gap-0.5 pb-0.5">
                  {dayWorkouts.slice(0, MAX_DOTS).map((workout) => (
                    <span
                      key={`${workout.type}-${workout.id}`}
                      className={`h-1.5 w-1.5 rounded-full ${typeDot(workout.type)}`}
                    />
                  ))}
                  {dayWorkouts.length > MAX_DOTS && (
                    <span className="text-[9px] font-bold text-gray-600 leading-none">
                      +{dayWorkouts.length - MAX_DOTS}
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {/* ── Legend ── */}
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 mt-4 text-xs text-gray-600">
        {(Object.keys(TYPE_COLOR) as WorkoutType[]).map((type) => (
          <span key={type} className="flex items-center gap-1.5">
            <span className={`h-2 w-2 rounded-full ${TYPE_COLOR[type]}`} />
            {TYPE_LABEL[type]}
          </span>
        ))}
      </div>

      {/* ── Empty month ── */}
      {monthStats.count === 0 && (
        <div className="mt-4 text-center">
          <p className="text-gray-500 text-sm">
            No workouts logged in {monthLabel.split(" ")[0]}.
          </p>
          {latestMonthIndex !== null && latestMonthIndex !== cursorIndex && (
            <button
              type="button"
              onClick={() =>
                goToMonth(latestMonthIndex, latestMonthIndex > cursorIndex ? 1 : -1)
              }
              className="mt-2 text-sm font-semibold text-primary-500 hover:text-secondary-600 underline"
            >
              Jump to most recent workout
            </button>
          )}
        </div>
      )}

      {/* ── Day detail modal ── */}
      <AnimatePresence>
        {selectedDate && (
          <motion.div
            className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center px-0 sm:px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelectedDate(null);
            }}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              className="bg-primary-500 rounded-t-2xl sm:rounded-lg w-full sm:w-3/4 md:w-1/2 max-h-[85vh] sm:max-h-[75vh] flex flex-col"
              initial={{ scale: 0.95, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 40 }}
            >
              <div className="flex justify-between items-center p-4 border-b border-white/20 flex-shrink-0">
                <div className="min-w-0">
                  <h2 className="text-base sm:text-xl font-bold text-white truncate">
                    {selectedDate.toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </h2>
                  <p className="text-xs text-white/70">
                    {selectedWorkouts.length} workout{selectedWorkouts.length === 1 ? "" : "s"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedDate(null)}
                  aria-label="Close"
                  className="text-white/70 hover:text-white flex-shrink-0 ml-2"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto p-4 space-y-3">
                {selectedWorkouts.map((workout) => (
                  <div key={`${workout.type}-${workout.id}`} className="bg-white/10 p-3 rounded-lg">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${typeBadge(
                          workout.type
                        )}`}
                      >
                        {typeLabel(workout.type).toUpperCase()}
                      </span>
                      <h3 className="text-base font-bold text-white truncate">
                        {workout.activity}
                      </h3>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-white/70">
                      <span>
                        {new Date(workout.date).toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </span>
                      {workout.duration ? <span>{workout.duration} min</span> : null}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WorkoutCalendar;
