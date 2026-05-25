import { useState } from "react";
import { RxCheck } from "react-icons/rx";
import { BsTrash, BsPencil, BsImage, BsArrowUp, BsArrowDown, BsArrowRight, BsCheckCircle, BsThreeDots, BsClock, BsFlag, BsBookmark } from "react-icons/bs";
import Modal from "../ui/Modal";
import ContextMenu from "../ui/ContextMenu";
import TaskForm from "./TaskForm";
import { useApp } from "../../context/AppContext";

const PRI = { high: "#f43f5e", moderate: "#f59e0b", low: "#10b981" };

export default function TaskCard({ task, onToggle, onDelete }) {
  const { updateTask, collections } = useApp();
  const [editing, setEditing] = useState(false);
  const [showImages, setShowImages] = useState(false);
  const [ctxMenu, setCtxMenu] = useState(null);
  const p = PRI[task.priority] || PRI.low;
  const col = collections.find((c) => c.id === task.collectionId);
  const images = task.images || [];

  // Handle toggle with auto-sync to kanban status
  const handleToggle = (id) => {
    onToggle(id);
    // Auto-move to Done column when marked as complete
    if (!task.completed) {
      updateTask({ id, status: "done" });
    } else {
      // Move back to To Do when unmarked
      updateTask({ id, status: "todo" });
    }
  };

  const handleContext = (e) => {
    e.preventDefault();
    setCtxMenu({ x: e.clientX, y: e.clientY });
  };

  const ctxItems = [
    { label: "Edit", icon: <BsPencil />, onClick: () => setEditing(true) },
    { label: task.completed ? "Mark incomplete" : "Mark complete", icon: <BsCheckCircle />, onClick: () => handleToggle(task.id) },
    { label: "Change priority", icon: <BsFlag />, divider: true },
    { label: "High", icon: <BsArrowUp className="text-rose-400" />, onClick: () => updateTask({ id: task.id, priority: "high" }) },
    { label: "Medium", icon: <BsArrowRight className="text-amber-400" />, onClick: () => updateTask({ id: task.id, priority: "moderate" }) },
    { label: "Low", icon: <BsArrowDown className="text-emerald-400" />, onClick: () => updateTask({ id: task.id, priority: "low" }) },
    { label: "Change status", icon: <BsClock />, divider: true },
    { label: "To Do", icon: <BsBookmark />, onClick: () => updateTask({ id: task.id, status: "todo" }) },
    { label: "In Progress", icon: <BsClock />, onClick: () => updateTask({ id: task.id, status: "in-progress" }) },
    { label: "Done", icon: <BsCheckCircle />, onClick: () => updateTask({ id: task.id, status: "done", completed: true }) },
    { label: "Delete", icon: <BsTrash />, divider: true, danger: true, onClick: () => onDelete(task.id) },
  ];

  return (
    <>
      <div
        onContextMenu={handleContext}
        className={`group flex items-start gap-3 px-3.5 py-3 rounded-xl border transition-all duration-150 ${
          task.completed
            ? "bg-emerald-50/60 dark:bg-emerald-900/20 border-emerald-200/40 dark:border-emerald-800/30"
            : "bg-surface-card border-subtle hover:border-[var(--accent)]/30"
        }`}
      >
         {/* Checkbox */}
         <button
           onClick={() => handleToggle(task.id)}
           className={`mt-0.5 w-[18px] h-[18px] rounded border-2 flex items-center justify-center flex-shrink-0 transition-all duration-150 ${
             task.completed ? "bg-emerald-500 border-emerald-500" : "border-gray-300 dark:border-gray-600 hover:border-[var(--accent)]"
           }`}
         >
           {task.completed && <RxCheck className="text-white" style={{ fontSize: 11 }} />}
         </button>

        {/* Content */}
        <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setEditing(true)} onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); setCtxMenu({ x: e.clientX, y: e.clientY }); }}>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-sm font-medium ${task.completed ? "line-through text-gray-400 dark:text-gray-500" : "text-primary"}`}>
              {task.title || "Untitled"}
            </span>
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md" style={{ backgroundColor: `${p}18`, color: p }}>
              {task.priority === "high" ? "High" : task.priority === "moderate" ? "Med" : "Low"}
            </span>
            {col && (
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md" style={{ backgroundColor: `${col.color}18`, color: col.color }}>
                {col.name}
              </span>
            )}
            {task.dueDate && (
              <span className="text-[10px] text-tertiary">{new Date(task.dueDate).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span>
            )}
          </div>
          {task.description && (
            <p className={`text-xs mt-0.5 ${task.completed ? "line-through text-tertiary" : "text-secondary"}`}>{task.description}</p>
          )}
           {images.length > 0 && (
             <div className="mt-2">
               <button onClick={(e) => { e.stopPropagation(); setShowImages(!showImages); }} className="flex items-center gap-1 text-[10px] text-tertiary hover:text-[var(--accent)] transition-colors">
                 <BsImage /> {images.length} image{images.length > 1 ? "s" : ""}
               </button>
               {showImages && (
                 <div className="flex flex-wrap gap-2 mt-2" onClick={(e) => e.stopPropagation()}>
                   {images.map((img) => (
                     <img key={img.id} src={img.dataUrl} alt="" className="w-20 h-20 rounded-lg object-cover border border-subtle hover:border-[var(--accent)] transition-all" />
                   ))}
                 </div>
               )}
             </div>
           )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
          <button onClick={() => setEditing(true)} className="p-1.5 rounded-lg text-tertiary hover:text-[var(--accent)] hover:bg-accent-soft transition-all">
            <BsPencil className="text-xs" />
          </button>
          <button onClick={() => onDelete(task.id)} className="p-1.5 rounded-lg text-tertiary hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all">
            <BsTrash className="text-xs" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); setCtxMenu({ x: e.currentTarget.getBoundingClientRect().right - 140, y: e.currentTarget.getBoundingClientRect().bottom }); }} className="p-1.5 rounded-lg text-tertiary hover:text-secondary transition-all">
            <BsThreeDots className="text-xs" />
          </button>
        </div>
      </div>

      {ctxMenu && <ContextMenu position={ctxMenu} items={ctxItems} onClose={() => setCtxMenu(null)} />}
      {editing && (
        <Modal open={editing} onClose={() => setEditing(false)} title="Edit task">
          <TaskForm collections={collections} initial={task} onSubmit={(data) => { updateTask({ id: task.id, ...data }); setEditing(false); }} onCancel={() => setEditing(false)} />
        </Modal>
      )}
    </>
  );
}
