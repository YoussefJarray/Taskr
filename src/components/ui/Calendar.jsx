import { useState, useMemo } from "react";
import { BsChevronLeft, BsChevronRight, BsCalendarEvent } from "react-icons/bs";
import { useApp } from "../../context/AppContext";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function getMonthDays(year, month) {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const startPad = first.getDay();
  const days = [];
  for (let i = 0; i < startPad; i++) days.push(null);
  for (let d = 1; d <= last.getDate(); d++) days.push(d);
  return days;
}

export default function Calendar({ onSelectDate, selectedDate }) {
  const { tasks } = useApp();
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const days = useMemo(() => getMonthDays(year, month), [year, month]);
  const sel = selectedDate || today;

  const dueMap = useMemo(() => {
    const map = {};
    tasks.forEach((t) => {
      if (!t.dueDate || t.completed) return;
      const key = new Date(t.dueDate).toDateString();
      if (!map[key]) map[key] = [];
      map[key].push(t);
    });
    return map;
  }, [tasks]);

  const prev = () => { if (month === 0) { setYear(y => y - 1); setMonth(11); } else setMonth(m => m - 1); };
  const next = () => { if (month === 11) { setYear(y => y + 1); setMonth(0); } else setMonth(m => m + 1); };

  const selKey = sel.toDateString();
  const dueTasks = useMemo(() => dueMap[selKey] || [], [dueMap, selKey]);

  return (
    <div className="rounded-xl border border-subtle bg-surface-card p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-primary">
          {MONTHS[month]} {year}
        </span>
        <div className="flex gap-1">
          <button onClick={prev} className="p-1 rounded-md text-tertiary hover:text-primary hover:bg-surface-hover-strong transition-all">
            <BsChevronLeft className="text-xs" />
          </button>
          <button onClick={next} className="p-1 rounded-md text-tertiary hover:text-primary hover:bg-surface-hover-strong transition-all">
            <BsChevronRight className="text-xs" />
          </button>
        </div>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-[10px] font-medium text-tertiary py-1">{d}</div>
        ))}
      </div>

      {/* Dates */}
      <div className="grid grid-cols-7 mb-3">
        {days.map((d, i) => {
          if (!d) return <div key={`e-${i}`} />;
          const date = new Date(year, month, d);
          const isToday = date.toDateString() === today.toDateString();
          const isSel = date.toDateString() === sel.toDateString();
          const hasDue = dueMap[date.toDateString()];
          return (
            <button
              key={i}
              onClick={() => onSelectDate && onSelectDate(date)}
              className={`text-center text-xs py-1.5 rounded-lg transition-all relative ${
                isSel
                  ? "bg-violet-600 text-white font-semibold"
                  : isToday
                    ? "bg-violet-100 dark:bg-violet-900/20 text-[var(--accent)] font-medium"
                    : "text-secondary hover:bg-surface-hover-strong"
              }`}
            >
              {d}
              {hasDue && !isSel && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-violet-500/60" />
              )}
            </button>
          );
        })}
      </div>

      {/* Due tasks for selected date */}
      <div className="pt-3 border-t border-subtle">
        <div className="flex items-center gap-1.5 mb-2">
          <BsCalendarEvent className="text-xs text-violet-500" />
          <span className="text-[11px] font-medium text-secondary">
            {sel.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })}
          </span>
        </div>
        {dueTasks.length === 0 ? (
          <p className="text-xs text-tertiary py-2 text-center">No tasks due</p>
        ) : (
          <div className="space-y-1 max-h-[140px] overflow-y-auto">
            {dueTasks.map((t) => (
              <div key={t.id} className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-surface-hover">
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                  t.priority === "high" ? "bg-rose-400" : t.priority === "moderate" ? "bg-amber-400" : "bg-emerald-400"
                }`} />
                <span className={`text-xs flex-1 truncate ${t.completed ? "line-through text-tertiary" : "text-primary"}`}>
                  {t.title || "Untitled"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
