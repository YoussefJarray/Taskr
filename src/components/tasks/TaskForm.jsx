import { useState } from "react";
import FileUpload from "../ui/FileUpload";

export default function TaskForm({ collections, onSubmit, onCancel, initial }) {
  const [title, setTitle] = useState(initial?.title || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [priority, setPriority] = useState(initial?.priority || "low");
  const [collectionId, setCollectionId] = useState(initial?.collectionId || "");
  const [status, setStatus] = useState(initial?.status || "todo");
  const [dueDate, setDueDate] = useState(initial?.dueDate || "");
  const [savedImages, setSavedImages] = useState(initial?.images || []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      priority,
      collectionId: collectionId || null,
      status,
      dueDate: dueDate || null,
      images: savedImages,
    });
  };

  const base = "w-full px-3 py-2 rounded-lg text-sm border border-default bg-surface-input text-primary placeholder-tertiary focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 transition-all";

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5">
      <div>
        <label className="block text-xs font-medium text-secondary mb-1">Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="What needs to be done?" required autoFocus className={base} />
      </div>
      <div>
        <label className="block text-xs font-medium text-secondary mb-1">Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Add details..." rows={2} className={`${base} resize-none`} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-secondary mb-1">Priority</label>
          <select value={priority} onChange={(e) => setPriority(e.target.value)} className={base}>
            <option value="low">Low</option>
            <option value="moderate">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-secondary mb-1">Due date</label>
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className={base} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-secondary mb-1">Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className={base}>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
        {collections.length > 0 && (
          <div>
            <label className="block text-xs font-medium text-secondary mb-1">Collection</label>
            <select value={collectionId} onChange={(e) => setCollectionId(e.target.value)} className={base}>
              <option value="">None</option>
              {collections.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        )}
      </div>

      {/* Images */}
      <div>
        <label className="block text-xs font-medium text-secondary mb-1.5">Images</label>
        <FileUpload
          onChange={(files) => setSavedImages((prev) => [...prev, ...files])}
          multiple={true}
          maxSizeMB={5}
        />
        {initial?.images?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {initial.images.filter((img) => img.id && img.dataUrl).map((img) => (
              <div key={img.id} className="w-14 h-14 rounded-lg overflow-hidden border border-subtle">
                <img src={img.dataUrl} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-2 pt-1">
        <button type="submit" className="flex-1 px-4 py-2 rounded-lg text-sm font-medium text-white bg-violet-600 hover:bg-violet-500 active:bg-violet-700 transition-all">
          {initial ? "Save changes" : "Add task"}
        </button>
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg text-sm font-medium text-secondary bg-surface-hover-strong hover:bg-surface-hover transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
}
