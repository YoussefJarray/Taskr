import { useState } from "react";
import { RxCheck } from "react-icons/rx";
import { BsTrash, BsPencil, BsArrowLeft, BsArrowRight, BsArrowUp, BsArrowDown, BsCheckCircle, BsThreeDots, BsClock, BsFlag, BsBookmark } from "react-icons/bs";
import Modal from "../ui/Modal";
import ContextMenu from "../ui/ContextMenu";
import TaskForm from "./TaskForm";
import { useApp } from "../../context/AppContext";

const PRI = { high: "#f43f5e", moderate: "#f59e0b", low: "#10b981" };

export default function TaskCard({ task, onToggle, onDelete }) {
  const { updateTask, collections } = useApp();
  const [editing, setEditing] = useState(false);
  const [showImages, setShowImages] = useState(false);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
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
           {/* Image Grid - Carousel only if more than 4 images */}
           {images.length > 0 && (
             <div className="mt-3">
               {images.length <= 4 ? (
                 // Show all images inline
                 <div className="flex gap-2 flex-wrap">
                   {images.map((img, idx) => (
                     <button
                       key={img.id}
                       onClick={(e) => { e.stopPropagation(); setShowImages(true); setSelectedImageIdx(idx); }}
                       className="w-16 h-16 rounded-lg overflow-hidden border border-subtle hover:border-[var(--accent)]/50 transition-all flex items-center justify-center bg-surface-hover"
                     >
                       <img src={img.dataUrl} alt="" className="max-w-full max-h-full object-contain" />
                     </button>
                   ))}
                 </div>
               ) : (
                 // Carousel for more than 4 images
                 <div className="flex items-center gap-2">
                   <button
                     onClick={(e) => { e.stopPropagation(); setSelectedImageIdx(Math.max(0, selectedImageIdx - 1)); }}
                     disabled={selectedImageIdx === 0}
                     className="p-1 rounded text-tertiary hover:text-[var(--accent)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                   >
                     <BsArrowLeft className="text-sm" />
                   </button>
                   <button
                     onClick={(e) => { e.stopPropagation(); setShowImages(true); }}
                     className="flex-1 h-24 rounded-lg overflow-hidden border border-subtle hover:border-[var(--accent)]/50 transition-all flex items-center justify-center bg-surface-hover"
                   >
                     <img src={images[selectedImageIdx].dataUrl} alt="" className="max-w-full max-h-full object-contain" />
                   </button>
                   <button
                     onClick={(e) => { e.stopPropagation(); setSelectedImageIdx(Math.min(images.length - 1, selectedImageIdx + 1)); }}
                     disabled={selectedImageIdx === images.length - 1}
                     className="p-1 rounded text-tertiary hover:text-[var(--accent)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                   >
                     <BsArrowRight className="text-sm" />
                   </button>
                   <span className="text-[10px] font-medium text-tertiary w-6 text-right">{selectedImageIdx + 1}/{images.length}</span>
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
       {showImages && images.length > 0 && (
         <Modal open={showImages} onClose={() => setShowImages(false)} title={`Image ${selectedImageIdx + 1} of ${images.length}`} wide>
           <div className="space-y-4">
             <div className="flex items-center justify-center bg-surface-secondary rounded-lg overflow-hidden w-full h-96">
               <img src={images[selectedImageIdx].dataUrl} alt="" className="max-w-full max-h-full object-contain" />
             </div>
             <div className="flex gap-2 justify-between">
               <div className="flex gap-1 flex-wrap">
                 {images.map((img, idx) => (
                   <button
                     key={img.id}
                     onClick={() => setSelectedImageIdx(idx)}
                     className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                       selectedImageIdx === idx ? "border-[var(--accent)]" : "border-subtle hover:border-[var(--accent)]/50"
                     }`}
                   >
                     <img src={img.dataUrl} alt="" className="w-full h-full object-cover" />
                   </button>
                 ))}
               </div>
               <div className="flex gap-2">
                 <button
                   onClick={() => setSelectedImageIdx(Math.max(0, selectedImageIdx - 1))}
                   disabled={selectedImageIdx === 0}
                   className="px-3 py-2 rounded-lg text-sm font-medium border border-subtle hover:border-[var(--accent)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                 >
                   ← Prev
                 </button>
                 <button
                   onClick={() => setSelectedImageIdx(Math.min(images.length - 1, selectedImageIdx + 1))}
                   disabled={selectedImageIdx === images.length - 1}
                   className="px-3 py-2 rounded-lg text-sm font-medium border border-subtle hover:border-[var(--accent)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                 >
                   Next →
                 </button>
               </div>
             </div>
           </div>
         </Modal>
       )}
    </>
  );
}
