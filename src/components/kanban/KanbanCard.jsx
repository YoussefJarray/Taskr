import { useState } from "react";
import { useApp } from "../../context/AppContext";
import ContextMenu from "../ui/ContextMenu";
import { BsTrash, BsPencil, BsImage, BsArrowUp, BsArrowDown, BsArrowRight, BsCheckCircle, BsClock, BsFlag, BsBookmark, BsThreeDots } from "react-icons/bs";

const PRI = { high: "#f43f5e", moderate: "#f59e0b", low: "#10b981" };

export default function KanbanCard({ task, isDragging, onEdit }) {
  const { deleteTask, updateTask, collections } = useApp();
  const [ctxMenu, setCtxMenu] = useState(null);
  const col = collections.find((c) => c.id === task.collectionId);
  const p = PRI[task.priority] || PRI.low;
  const images = task.images || [];

  const handleContext = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCtxMenu({ x: e.clientX, y: e.clientY });
  };

  const ctxItems = [
    { label: "Edit", icon: <BsPencil />, onClick: () => onEdit(task) },
    { label: task.completed ? "Mark incomplete" : "Mark complete", icon: <BsCheckCircle />, onClick: () => updateTask({ id: task.id, completed: !task.completed }) },
    { label: "Move to", icon: <BsArrowRight />, divider: true },
    { label: "To Do", icon: <BsBookmark />, onClick: () => updateTask({ id: task.id, status: "todo" }) },
    { label: "In Progress", icon: <BsClock />, onClick: () => updateTask({ id: task.id, status: "in-progress" }) },
    { label: "Done", icon: <BsCheckCircle />, onClick: () => updateTask({ id: task.id, status: "done" }) },
    { label: "Priority", icon: <BsFlag />, divider: true },
    { label: "High", icon: <BsArrowUp className="text-rose-400" />, onClick: () => updateTask({ id: task.id, priority: "high" }) },
    { label: "Medium", icon: <BsArrowRight className="text-amber-400" />, onClick: () => updateTask({ id: task.id, priority: "moderate" }) },
    { label: "Low", icon: <BsArrowDown className="text-emerald-400" />, onClick: () => updateTask({ id: task.id, priority: "low" }) },
    { label: "Delete", icon: <BsTrash />, divider: true, danger: true, onClick: () => deleteTask(task.id) },
  ];

  return (
    <>
      <div
        onContextMenu={handleContext}
        className={`group px-3 py-2.5 rounded-xl border transition-all duration-150 ${
          isDragging
            ? "shadow-lg rotate-1 border-[var(--accent)]/40 bg-surface-card"
            : "border-subtle bg-surface-card hover:border-[var(--accent)]/30"
        } ${task.completed ? "bg-emerald-50/30 dark:bg-emerald-900/10" : ""}`}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0 cursor-pointer" onClick={() => onEdit(task)} onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); setCtxMenu({ x: e.clientX, y: e.clientY }); }}>
            <p className={`text-xs font-semibold truncate ${task.completed ? "line-through text-tertiary" : "text-primary"}`}>
              {task.title || "Untitled"}
            </p>
            {task.description && <p className="text-[11px] text-secondary mt-0.5 truncate">{task.description}</p>}
            {images.length > 0 && (
              <div className="flex gap-1 mt-1.5">
                {images.slice(0, 3).map((img) => (
                  <img key={img.id} src={img.dataUrl} alt="" className="w-7 h-7 rounded-md object-cover border border-subtle" />
                ))}
                {images.length > 3 && <span className="text-[10px] text-tertiary self-center">+{images.length - 3}</span>}
              </div>
            )}
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); setCtxMenu({ x: e.currentTarget.getBoundingClientRect().right - 130, y: e.currentTarget.getBoundingClientRect().bottom }); }}
            className="p-1 rounded text-tertiary hover:text-secondary opacity-0 group-hover:opacity-100 transition-all flex-shrink-0"
          >
            <BsThreeDots className="text-[10px]" />
          </button>
        </div>
        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md" style={{ backgroundColor: `${p}18`, color: p }}>
            {task.priority === "high" ? "High" : task.priority === "moderate" ? "Med" : "Low"}
          </span>
          {col && (
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md" style={{ backgroundColor: `${col.color}18`, color: col.color }}>
              {col.name}
            </span>
          )}
          {images.length > 0 && (
            <span className="flex items-center gap-0.5 text-[10px] text-tertiary"><BsImage /> {images.length}</span>
          )}
        </div>
      </div>
      {ctxMenu && <ContextMenu position={ctxMenu} items={ctxItems} onClose={() => setCtxMenu(null)} />}
    </>
  );
}
