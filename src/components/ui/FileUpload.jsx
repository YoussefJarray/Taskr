import { useCallback, useRef, useState } from "react";
import { BsCloudArrowUp, BsImage, BsX } from "react-icons/bs";

/**
 * Drag-and-drop / click-to-browse file upload zone.
 * Returns `files` array of { id, dataUrl, name, size } via onChange.
 */
export default function FileUpload({ accept = "image/*", maxSizeMB = 5, multiple = true, onChange }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [previews, setPreviews] = useState([]);

  const toDataUrl = (file) =>
    new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve({ id: crypto.randomUUID(), dataUrl: reader.result, name: file.name, size: file.size });
      reader.readAsDataURL(file);
    });

  const processFiles = useCallback(async (fileList) => {
    const files = Array.from(fileList).filter((f) => f.size <= maxSizeMB * 1024 * 1024);
    if (files.length === 0) return;
    const results = await Promise.all(files.map(toDataUrl));
    setPreviews((p) => [...p, ...results]);
    onChange?.(results);
  }, [maxSizeMB, onChange]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    processFiles(e.dataTransfer.files);
  }, [processFiles]);

  const removePreview = (id) => {
    setPreviews((p) => p.filter((x) => x.id !== id));
  };

  return (
    <div className="space-y-2">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center py-6 px-4 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
          dragging
            ? "border-[var(--accent)] bg-[var(--accent-soft)]"
            : "border-[var(--border-default)] hover:border-[var(--accent)]/50 bg-surface-hover"
        }`}
      >
        <BsCloudArrowUp className={`text-2xl mb-2 transition-colors ${dragging ? "text-[var(--accent)]" : "text-tertiary"}`} />
        <p className="text-xs font-medium text-secondary">
          {dragging ? "Drop files here" : "Drag & drop or click to browse"}
        </p>
        <p className="text-[10px] text-tertiary mt-0.5">Supports images up to {maxSizeMB}MB</p>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={(e) => { if (e.target.files.length) { processFiles(e.target.files); e.target.value = ""; } }}
        />
      </div>

      {/* Previews */}
      {previews.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {previews.map((img) => (
            <div key={img.id} className="relative group w-16 h-16 rounded-lg overflow-hidden border border-subtle">
              <img src={img.dataUrl} alt={img.name} className="w-full h-full object-cover" />
              <button
                onClick={() => removePreview(img.id)}
                className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
              >
                <BsX className="text-white text-[10px]" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
