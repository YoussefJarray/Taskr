import { useState, useRef, useCallback } from "react";
import { useApp } from "../context/AppContext";
import Modal from "../components/ui/Modal";
import FileUpload from "../components/ui/FileUpload";
import { BsPlus, BsImage, BsTrash, BsPencil, BsArrowsMove, BsCheck2, BsArrowsAngleExpand } from "react-icons/bs";

const MAX_W = 800;
const MAX_H = 600;
const MIN_W = 80;
const MIN_H = 60;

function loadImageData(file) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      let w = img.naturalWidth;
      let h = img.naturalHeight;
      if (w > MAX_W) { h = h * (MAX_W / w); w = MAX_W; }
      if (h > MAX_H) { w = w * (MAX_H / h); h = MAX_H; }
      resolve({
        dataUrl: file.dataUrl,
        name: file.name.replace(/\.[^/.]+$/, "") || "Untitled",
        width: Math.round(w),
        height: Math.round(h),
      });
    };
    img.onerror = () => resolve({ dataUrl: file.dataUrl, name: "Untitled", width: 240, height: 180 });
    img.src = file.dataUrl;
  });
}

export default function MoodBoard() {
  const { moodImages, addMoodImage, updateMoodImage, deleteMoodImage } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [draggingId, setDraggingId] = useState(null);
  const [resizingId, setResizingId] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const dragRef = useRef(null);

  // Track highest z-index for layering
  const maxZIndex = Math.max(...moodImages.map(img => img.zIndex || 0), 0);

  const handleUpload = useCallback(async (files) => {
    for (const f of files) {
      const info = await loadImageData(f);
      addMoodImage({
        url: info.dataUrl,
        title: info.name,
        width: info.width,
        height: info.height,
        x: 40 + Math.random() * 200,
        y: 40 + Math.random() * 140,
      });
    }
    setShowForm(false);
  }, [addMoodImage]);

   const handleMouseDown = useCallback((e, img) => {
     e.preventDefault();
     if (resizingId) return;
     setDraggingId(img.id);
     const board = e.currentTarget.closest("[data-board]");
     if (!board) return;
     const el = board.querySelector(`[data-img-id="${img.id}"]`);
     if (!el) return;

     const startX = e.clientX;
     const startY = e.clientY;
     const origLeft = parseFloat(el.style.left) || img.x;
     const origTop = parseFloat(el.style.top) || img.y;

     // Store original z-indexes of all images
     const originalZIndexes = {};
     moodImages.forEach((moodImg) => {
       originalZIndexes[moodImg.id] = moodImg.zIndex || 0;
     });

     const move = (ev) => {
       el.style.left = `${origLeft + ev.clientX - startX}px`;
       el.style.top = `${origTop + ev.clientY - startY}px`;
       
       // Find the highest z-index among all images
       const maxZ = Math.max(...Object.values(originalZIndexes), 0);
       
       // Set dragged image to max + 100 (but keep it below modal z-index of 9999)
       el.style.zIndex = Math.min(maxZ + 100, 9000);
       
       // All other images keep their relative z-index order
       moodImages.forEach((otherImg) => {
         if (otherImg.id !== img.id) {
           const otherEl = board.querySelector(`[data-img-id="${otherImg.id}"]`);
           if (otherEl) {
             otherEl.style.zIndex = otherImg.zIndex || 0;
           }
         }
       });
     };

      const up = () => {
        window.removeEventListener("mousemove", move);
        window.removeEventListener("mouseup", up);
        setDraggingId(null);
        
        const finalLeft = parseFloat(el.style.left) || origLeft;
        const finalTop = parseFloat(el.style.top) || origTop;
        const dx = finalLeft - img.x, dy = finalTop - img.y;
        
        // Find the highest z-index to keep dragged image on top
        const maxZ = Math.max(...Object.values(originalZIndexes), 0);
        
        if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
          // Position changed, update both position and z-index
          updateMoodImage({ id: img.id, x: Math.max(0, finalLeft), y: Math.max(0, finalTop), zIndex: maxZ + 50 });
        } else {
          // Position barely changed, but still update z-index to bring image to front
          updateMoodImage({ id: img.id, zIndex: maxZ + 50 });
        }
      };

     window.addEventListener("mousemove", move);
     window.addEventListener("mouseup", up);
   }, [updateMoodImage, resizingId, moodImages]);

  const handleResizeStart = useCallback((e, img) => {
    e.preventDefault();
    e.stopPropagation();
    setResizingId(img.id);
    const board = e.currentTarget.closest("[data-board]");
    if (!board) return;
    const el = board.querySelector(`[data-img-id="${img.id}"]`);
    if (!el) return;

    const startX = e.clientX;
    const startY = e.clientY;
    const origW = parseFloat(el.style.width) || img.width;
    const origH = parseFloat(el.style.height) || img.height;
    const aspect = origW / origH;

    const move = (ev) => {
      let w = origW + (ev.clientX - startX);
      let h = w / aspect;
      if (w < MIN_W) { w = MIN_W; h = w / aspect; }
      if (h < MIN_H) { h = MIN_H; w = h * aspect; }
      el.style.width = `${Math.round(w)}px`;
      el.style.height = `${Math.round(h)}px`;
    };

    const up = () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
      setResizingId(null);
      const w = parseFloat(el.style.width) || origW;
      const h = parseFloat(el.style.height) || origH;
      if (Math.round(w) !== Math.round(origW) || Math.round(h) !== Math.round(origH)) {
        updateMoodImage({ id: img.id, width: Math.round(w), height: Math.round(h) });
      }
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  }, [updateMoodImage]);

  const startEdit = (img) => {
    setEditingId(img.id);
    setEditTitle(img.title);
  };

  const saveTitle = () => {
    if (!editingId) return;
    updateMoodImage({ id: editingId, title: editTitle.trim() || "Untitled" });
    setEditingId(null);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-5 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-primary">Mood Board</h1>
          <p className="text-sm text-secondary mt-0.5">{moodImages.length} image{moodImages.length !== 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-white shadow-md transition-all"
          style={{ background: "linear-gradient(135deg, #8B5CF6, #EC4899)" }}
        >
          <BsPlus className="text-base" /> Add image
        </button>
      </div>

      {moodImages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-tertiary border-2 border-dashed border-subtle rounded-2xl min-h-[500px]">
          <BsImage className="text-4xl mb-3 opacity-30" />
          <p className="text-sm font-medium text-secondary">No images yet</p>
          <p className="text-xs mt-1">Drop images anywhere or use the button above</p>
        </div>
       ) : (
         <div
           data-board
           className="flex-1 relative border-2 border-dashed border-subtle rounded-2xl min-h-[500px] overflow-hidden bg-surface-secondary/30"
           onClick={() => setSelectedId(null)}
         >
           {moodImages.map((img) => (
             <div
               key={img.id}
               data-img-id={img.id}
               className={`absolute group rounded-lg overflow-hidden border shadow-md transition-shadow ${
                 draggingId === img.id ? "shadow-xl cursor-grabbing" : "hover:shadow-lg"
               } ${resizingId === img.id ? "select-none" : ""} ${
                 selectedId === img.id ? "ring-2 ring-[var(--accent)] ring-offset-2" : ""
               }`}
               style={{
                 left: img.x,
                 top: img.y,
                 width: img.width,
                 height: img.height,
                 borderColor: "var(--border-subtle)",
                 cursor: draggingId === img.id ? "grabbing" : "grab",
                 zIndex: img.zIndex || 1,
               }}
               onMouseDown={(e) => {
                 setSelectedId(img.id);
                 handleMouseDown(e, img);
               }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedId(img.id);
                  const maxZ = Math.max(...moodImages.map(i => i.zIndex || 0), 0);
                  updateMoodImage({ id: img.id, zIndex: maxZ + 1 });
                }}
            >
              {(img.url.startsWith("data:") || img.url.startsWith("http")) ? (
                <img
                  src={img.url}
                  alt={img.title}
                  className="w-full h-full object-cover pointer-events-none"
                  draggable={false}
                  onError={(e) => { e.target.style.display = "none"; }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-surface-secondary text-tertiary text-xs">Invalid</div>
              )}

              {/* Overlay controls */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              <div className="absolute bottom-0 left-0 right-0 px-2 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <span className="text-[11px] text-white/90 font-medium drop-shadow-sm">{img.title}</span>
              </div>
              <div className="absolute top-1 left-1 p-1 rounded bg-black/40 text-white/60 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <BsArrowsMove className="text-xs" />
              </div>
              <div className="absolute top-1 right-1 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto">
                <button onClick={(e) => { e.stopPropagation(); startEdit(img); }}
                  className="p-1 rounded bg-black/50 text-white hover:bg-violet-500/80 transition-colors text-[10px]">
                  <BsPencil />
                </button>
                <button onClick={(e) => { e.stopPropagation(); deleteMoodImage(img.id); }}
                  className="p-1 rounded bg-black/50 text-white hover:bg-rose-500/80 transition-colors text-[10px]">
                  <BsTrash />
                </button>
              </div>

              {/* Resize handle */}
              <div
                onMouseDown={(e) => handleResizeStart(e, img)}
                className={`absolute bottom-0 right-0 w-5 h-5 cursor-se-resize flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto ${
                  resizingId === img.id ? "opacity-100" : ""
                }`}
              >
                <div className="w-3 h-3 rounded-sm bg-black/50 text-white flex items-center justify-center">
                  <BsArrowsAngleExpand className="text-[8px]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={showForm} onClose={() => setShowForm(false)} title="Upload images" wide>
        <div className="space-y-4">
          <FileUpload onChange={handleUpload} multiple maxSizeMB={10} accept="image/*" />
          <div className="flex items-center gap-2 p-3 rounded-lg bg-surface-secondary text-xs text-secondary">
            <BsCheck2 className="text-emerald-400 flex-shrink-0" />
            Images are stored in your browser. Supported formats: JPG, PNG, GIF, WebP.
          </div>
          <button onClick={() => setShowForm(false)}
            className="w-full px-4 py-2 rounded-xl text-sm font-medium text-secondary bg-surface-hover-strong hover:bg-surface-hover transition-all">
            Done
          </button>
        </div>
      </Modal>

      <Modal open={!!editingId} onClose={() => setEditingId(null)} title="Edit image">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-secondary mb-1">Name</label>
            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && saveTitle()}
              className="w-full px-3 py-2 rounded-lg text-sm border border-default bg-surface-input text-primary placeholder-tertiary focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 transition-all"
            />
          </div>
          <div className="flex gap-2">
            <button onClick={saveTitle} className="flex-1 px-4 py-2 rounded-lg text-sm font-medium text-white transition-all" style={{ backgroundColor: "var(--accent)" }}>Save</button>
            <button onClick={() => setEditingId(null)} className="px-4 py-2 rounded-lg text-sm font-medium text-secondary bg-surface-hover-strong hover:bg-surface-hover transition-all">Cancel</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
