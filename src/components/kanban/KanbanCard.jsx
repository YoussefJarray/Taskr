import { useState } from "react";
import { useApp } from "../../context/AppContext";
import ContextMenu from "../ui/ContextMenu";
import Modal from "../ui/Modal";
import { BsTrash, BsPencil, BsArrowLeft, BsArrowDown, BsArrowRight, BsCheckCircle, BsClock, BsFlag, BsBookmark, BsThreeDots, BsArrowUp } from "react-icons/bs";

const PRI = { high: "#f43f5e", moderate: "#f59e0b", low: "#10b981" };

export default function KanbanCard({ task, isDragging, onEdit }) {
  const { deleteTask, updateTask, collections } = useApp();
  const [ctxMenu, setCtxMenu] = useState(null);
  const [showImages, setShowImages] = useState(false);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const col = collections.find((c) => c.id === task.collectionId);
  const p = PRI[task.priority] || PRI.low;
  const images = task.images || [];

  const handleContext = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCtxMenu({ x: e.clientX, y: e.clientY });
  };

  // Handle toggle with auto-sync status
  const handleToggleComplete = () => {
    updateTask({ id: task.id, completed: !task.completed });
    // Auto-move to Done column when marked as complete
    if (!task.completed) {
      updateTask({ id: task.id, status: "done" });
    } else {
      // Move back to To Do when unmarked
      updateTask({ id: task.id, status: "todo" });
    }
  };

  const ctxItems = [
    { label: "Edit", icon: <BsPencil />, onClick: () => onEdit(task) },
    { label: task.completed ? "Mark incomplete" : "Mark complete", icon: <BsCheckCircle />, onClick: handleToggleComplete },
    { label: "Move to", icon: <BsArrowRight />, divider: true },
    { label: "To Do", icon: <BsBookmark />, onClick: () => updateTask({ id: task.id, status: "todo", completed: false }) },
    { label: "In Progress", icon: <BsClock />, onClick: () => updateTask({ id: task.id, status: "in-progress", completed: false }) },
    { label: "Done", icon: <BsCheckCircle />, onClick: () => updateTask({ id: task.id, status: "done", completed: true }) },
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
             {/* Image Grid - Carousel only if more than 3 images */}
             {images.length > 0 && (
               <div className="mt-2">
                 {images.length <= 3 ? (
                   // Show all images inline
                   <div className="flex gap-1.5">
                     {images.map((img, idx) => (
                       <button
                         key={img.id}
                         onClick={(e) => { e.stopPropagation(); setShowImages(true); setSelectedImageIdx(idx); }}
                         className="w-14 h-14 rounded-lg overflow-hidden border border-subtle hover:border-[var(--accent)]/50 transition-all flex items-center justify-center bg-surface-hover"
                       >
                         <img src={img.dataUrl} alt="" className="max-w-full max-h-full object-contain" />
                       </button>
                     ))}
                   </div>
                 ) : (
                   // Carousel for more than 3 images
                   <div className="flex items-center gap-1.5">
                     <button
                       onClick={(e) => { e.stopPropagation(); setSelectedImageIdx(Math.max(0, selectedImageIdx - 1)); }}
                       disabled={selectedImageIdx === 0}
                       className="p-0.5 rounded text-tertiary hover:text-[var(--accent)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                     >
                       <BsArrowLeft className="text-xs" />
                     </button>
                     <button
                       onClick={(e) => { e.stopPropagation(); setShowImages(true); }}
                       className="w-16 h-16 rounded-lg overflow-hidden border border-subtle hover:border-[var(--accent)]/50 transition-all flex items-center justify-center bg-surface-hover"
                     >
                       <img src={images[selectedImageIdx].dataUrl} alt="" className="max-w-full max-h-full object-contain" />
                     </button>
                     <button
                       onClick={(e) => { e.stopPropagation(); setSelectedImageIdx(Math.min(images.length - 1, selectedImageIdx + 1)); }}
                       disabled={selectedImageIdx === images.length - 1}
                       className="p-0.5 rounded text-tertiary hover:text-[var(--accent)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                     >
                       <BsArrowRight className="text-xs" />
                     </button>
                     <span className="text-[10px] font-medium text-tertiary w-7">{selectedImageIdx + 1}/{images.length}</span>
                   </div>
                 )}
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
        </div>
       </div>
       {ctxMenu && <ContextMenu position={ctxMenu} items={ctxItems} onClose={() => setCtxMenu(null)} />}
       {showImages && images.length > 0 && (
         <Modal open={showImages} onClose={() => setShowImages(false)} title={`Image ${selectedImageIdx + 1} of ${images.length}`} wide>
           <div className="space-y-4">
             <div className="flex items-center justify-center bg-surface-secondary rounded-lg overflow-hidden w-full h-80">
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
