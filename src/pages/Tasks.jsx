import { useState } from "react";
import { useApp } from "../context/AppContext";
import TaskCard from "../components/tasks/TaskCard";
import TaskForm from "../components/tasks/TaskForm";
import Modal from "../components/ui/Modal";
import { BsPlus, BsSearch, BsList } from "react-icons/bs";

const SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Oldest", value: "oldest" },
  { label: "Priority", value: "priority" },
  { label: "Due date", value: "due" },
  { label: "Alphabetical", value: "alpha" },
];

export default function Tasks() {
  const { tasks, collections, addTask, toggleTask, deleteTask, updateTask, collectionFilter } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [filterPri, setFilterPri] = useState("all");
  const [view, setView] = useState("list");

  let filtered = tasks.filter((t) => {
    if (search && !t.title?.toLowerCase().includes(search.toLowerCase())) return false;
    if (collectionFilter && t.collectionId !== collectionFilter) return false;
    if (filterPri !== "all" && t.priority !== filterPri) return false;
    return true;
  });

  // Sort
  filtered = [...filtered].sort((a, b) => {
    switch (sort) {
      case "oldest": return a.createdAt - b.createdAt;
      case "priority": {
        const rank = { high: 0, moderate: 1, low: 2 };
        return rank[a.priority] - rank[b.priority];
      }
      case "due": {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      case "alpha": return (a.title || "").localeCompare(b.title || "");
      default: return b.createdAt - a.createdAt;
    }
  });

  const grouped = {};
  filtered.forEach((t) => {
    const k = t.collectionId || "__none";
    if (!grouped[k]) grouped[k] = [];
    grouped[k].push(t);
  });

  const sel = "px-2.5 py-1.5 rounded-lg text-sm border border-default bg-surface-input text-secondary focus:outline-none transition-all";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Tasks</h1>
          <p className="text-sm text-secondary mt-0.5">{filtered.length} of {tasks.length}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setView(view === "grid" ? "list" : "grid")}
            className="px-2.5 py-2 rounded-lg text-sm border border-default bg-surface-input text-secondary hover:text-violet-500 transition-all"
          >
            {view === "grid" ? <BsList /> : <BsPlus className="rotate-45" />}
          </button>
          <button
            onClick={() => { setEditTask(null); setShowForm(true); }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium text-white bg-violet-600 hover:bg-violet-500 active:bg-violet-700 transition-all"
          >
            <BsPlus className="text-base" /> New
          </button>
        </div>
      </div>

      {/* Search + filters */}
      <div className="flex items-center gap-2.5 flex-wrap">
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <BsSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-tertiary text-xs" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks..."
            className="w-full pl-8 pr-3 py-1.5 rounded-lg text-sm border border-default bg-surface-input text-primary placeholder-tertiary focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 transition-all"
          />
        </div>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className={sel}>
          {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <select value={filterPri} onChange={(e) => setFilterPri(e.target.value)} className={sel}>
          <option value="all">All priorities</option>
          <option value="high">High</option>
          <option value="moderate">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {/* View: list vs grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-tertiary">
          <BsList className="text-3xl mb-3 opacity-40" />
          <p className="text-sm font-medium">No tasks found</p>
          <p className="text-xs mt-1">Try adjusting your filters or create a new task</p>
        </div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((task, i) => (
            <div key={task.id} style={{ animationDelay: `${i * 0.03}s` }} className="animate-enter">
              <TaskCard task={task} onToggle={toggleTask} onDelete={deleteTask} />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(grouped).map(([colId, colTasks]) => {
            const col = collections.find((c) => c.id === colId);
            return (
              <div key={colId}>
                {col && (
                  <div className="flex items-center gap-2 mb-2 px-1">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: col.color }} />
                    <span className="text-xs font-semibold text-secondary">{col.name}</span>
                    <span className="text-[11px] text-tertiary">{colTasks.length}</span>
                  </div>
                )}
                <div className="space-y-1.5">
                  {colTasks.map((task, i) => (
                    <div key={task.id} style={{ animationDelay: `${i * 0.03}s` }} className="animate-enter">
                      <TaskCard task={task} onToggle={toggleTask} onDelete={deleteTask} />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal open={showForm} onClose={() => setShowForm(false)} title={editTask ? "Edit task" : "New task"}>
        <TaskForm
          collections={collections}
          initial={editTask}
          onSubmit={(d) => {
            if (editTask) { updateTask({ id: editTask.id, ...d }); } else { addTask(d); }
            setShowForm(false);
            setEditTask(null);
          }}
          onCancel={() => { setShowForm(false); setEditTask(null); }}
        />
      </Modal>
    </div>
  );
}
