import { useState } from "react";
import { useApp } from "../context/AppContext";
import ProgressBar from "../components/ui/ProgressBar";
import Calendar from "../components/ui/Calendar";
import { BsCheckCircle, BsClock, BsCollection, BsListTask, BsArrowRight, BsPlus, BsExclamationCircle, BsCheck2, BsLightning } from "react-icons/bs";
import { Link } from "react-router-dom";
import { useAnimateIn } from "../hooks/useAnimateIn";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function Dashboard() {
  const { tasks, collections, addTask, toggleTask } = useApp();
  const [quickTitle, setQuickTitle] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const heroRef = useAnimateIn();

  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const inProgress = tasks.filter((t) => !t.completed && t.status === "in-progress").length;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
  const recentTasks = [...tasks].sort((a, b) => b.createdAt - a.createdAt).slice(0, 5);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const overdue = tasks.filter((t) => !t.completed && t.dueDate && new Date(t.dueDate) < today);

  const handleQuickAdd = () => {
    if (!quickTitle.trim()) return;
    addTask({ title: quickTitle.trim(), description: "", priority: "low" });
    setQuickTitle("");
  };

  const statCards = [
    { icon: BsListTask, label: "Total tasks", value: total, color: "#8B5CF6", change: "+" + Math.min(tasks.filter(t => t.createdAt > Date.now() - 86400000 * 7).length, total) },
    { icon: BsCheckCircle, label: "Completed", value: completed, color: "#10B981", change: total > 0 ? Math.round((completed / total) * 100) + "%" : "0%" },
    { icon: BsClock, label: "In progress", value: inProgress, color: "#F59E0B", change: "" },
    { icon: BsCollection, label: "Collections", value: collections.length, color: "#06B6D4", change: "" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      {/* ── Hero Section ── */}
      <div ref={heroRef} className="relative overflow-hidden rounded-2xl p-6 md:p-8 border border-subtle bg-surface-card">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/5 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-[var(--accent)] mb-2">
            <BsLightning className="text-sm" />
            <span>Overview</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-primary leading-tight">
            {getGreeting()}
            <span className="block text-2xl md:text-3xl text-secondary mt-1 font-normal">
              {total > 0
                ? `${total} task${total !== 1 ? "s" : ""} · ${completed} done${overdue.length > 0 ? ` · ${overdue.length} overdue` : ""}`
                : "Let's build something great."}
            </span>
          </h1>
        </div>
      </div>

      {/* ── Quick Add ── */}
      <div className="flex items-center gap-2 p-3.5 rounded-xl border border-subtle bg-surface-card transition-all hover:border-[var(--accent)]/20">
        <input
          value={quickTitle}
          onChange={(e) => setQuickTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleQuickAdd()}
          placeholder="What needs to be done?"
          className="flex-1 text-sm bg-transparent border-none focus:outline-none text-primary placeholder-tertiary"
        />
        <button
          onClick={handleQuickAdd}
          disabled={!quickTitle.trim()}
          className="flex items-center gap-1 px-4 py-1.5 rounded-lg text-sm font-medium text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ backgroundColor: "var(--accent)" }}
        >
          <BsPlus className="text-base" /> Add
        </button>
      </div>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {statCards.map(({ icon: Icon, label, value, color, change }) => (
          <div
            key={label}
            className="group relative rounded-xl p-4 border border-subtle bg-surface-card transition-all hover:shadow-md hover:border-[var(--accent)]/20 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[var(--accent)]/[0.02] opacity-0 group-hover:opacity-100 transition-all pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center text-sm" style={{ backgroundColor: `${color}18`, color }}>
                  <Icon />
                </div>
                {change && (
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md" style={{ backgroundColor: `${color}12`, color }}>
                    {change}
                  </span>
                )}
              </div>
              <p className="text-xl font-bold text-primary">{value}</p>
              <p className="text-[11px] font-medium text-tertiary uppercase tracking-wider mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Overdue Alert ── */}
      {overdue.length > 0 && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-rose-200/60 dark:border-rose-800/30 bg-rose-50/50 dark:bg-rose-950/20">
          <BsExclamationCircle className="text-rose-400 text-lg flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <span className="text-sm font-medium text-rose-600 dark:text-rose-400">{overdue.length} overdue task{overdue.length !== 1 ? "s" : ""}</span>
            <div className="flex gap-1.5 mt-1 flex-wrap">
              {overdue.slice(0, 3).map((t) => (
                <span key={t.id} className="text-xs text-rose-500/80 dark:text-rose-400/80 bg-rose-100/50 dark:bg-rose-950/30 px-2 py-0.5 rounded-md truncate max-w-[140px]">
                  {t.title || "Untitled"}
                </span>
              ))}
              {overdue.length > 3 && <span className="text-xs text-rose-400">+{overdue.length - 3} more</span>}
            </div>
          </div>
          <Link to="/tasks" className="text-xs text-rose-500 hover:text-rose-400 font-medium flex items-center gap-1 transition-colors flex-shrink-0">
            View <BsArrowRight />
          </Link>
        </div>
      )}

      {/* ── Calendar + Progress + Due Today ── */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Calendar - grows, min-height */}
        <div className="flex-1 min-h-[320px]">
          <Calendar onSelectDate={setSelectedDate} selectedDate={selectedDate} />
        </div>

        {/* Right column - fixed width */}
        <div className="w-full lg:w-72">
          {/* Progress */}
          <div className="rounded-xl p-5 border border-subtle bg-surface-card flex flex-col items-center justify-center">
            <ProgressBar progress={progress} size={110} strokeWidth={5} />
            <p className="mt-3 text-xs font-medium text-secondary">Overall progress</p>
            <p className="text-xs text-tertiary">{completed}/{total} done</p>
          </div>
        </div>
      </div>

      {/* ── Recent Activity ── */}
      <div className="rounded-xl p-5 border border-subtle bg-surface-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-primary">Recent activity</h2>
          {tasks.length > 0 && (
            <Link to="/tasks" className="text-xs font-medium transition-all flex items-center gap-1" style={{ color: "var(--accent)" }}>
              View all <BsArrowRight />
            </Link>
          )}
        </div>
        {recentTasks.length === 0 ? (
          <div className="flex flex-col items-center py-8 text-tertiary">
            <BsListTask className="text-2xl mb-2 opacity-30" />
            <p className="text-sm text-secondary">No tasks yet</p>
            <p className="text-xs mt-0.5">Create one using the quick-add above</p>
          </div>
        ) : (
          <div className="space-y-1">
            {recentTasks.map((task) => (
              <div key={task.id} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-surface-hover transition-all hover:bg-surface-hover-strong">
                <button
                  onClick={() => toggleTask(task.id)}
                  className={`w-3.5 h-3.5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                    task.completed ? "bg-emerald-400 border-emerald-400" : "border-gray-300 dark:border-gray-600"
                  }`}
                >
                  {task.completed && <BsCheck2 className="text-white" style={{ fontSize: 8 }} />}
                </button>
                <span className={`flex-1 text-sm truncate ${task.completed ? "line-through text-tertiary" : "text-primary"}`}>
                  {task.title || "Untitled"}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded" style={{
                    backgroundColor: task.priority === "high" ? "#f43f5e12" : task.priority === "moderate" ? "#f59e0b12" : "#10b98112",
                    color: task.priority === "high" ? "#f43f5e" : task.priority === "moderate" ? "#f59e0b" : "#10b981"
                  }}>
                    {task.priority === "high" ? "High" : task.priority === "moderate" ? "Med" : "Low"}
                  </span>
                  <span className="text-[11px] text-tertiary">
                    {new Date(task.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
