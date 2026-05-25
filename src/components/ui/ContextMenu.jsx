import { useEffect, useRef } from "react";

/**
 * Reusable right-click / context menu.
 * @param {object} position - { x, y } pixel position
 * @param {array} items - { label, icon?, onClick?, divider?, danger? }
 * @param {function} onClose - called when menu should close
 */
export default function ContextMenu({ position, items, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    const handle = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    // Delay listener to avoid the same right-click closing immediately
    requestAnimationFrame(() => {
      document.addEventListener("mousedown", handle);
      document.addEventListener("keydown", handleKey);
    });
    return () => {
      document.removeEventListener("mousedown", handle);
      document.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  if (!position) return null;

  return (
    <div
      ref={ref}
      className="fixed z-50 min-w-[160px] py-1 rounded-xl border border-subtle bg-surface-card shadow-xl"
      style={{ left: position.x, top: position.y }}
    >
      {items.map((item, i) =>
        item.divider ? (
          <div key={i} className="my-1 border-t border-subtle" />
        ) : (
          <button
            key={i}
            onClick={() => { item.onClick?.(); onClose(); }}
            className={`flex items-center gap-2.5 w-full px-3 py-1.5 text-xs text-left transition-all ${
              item.danger ? "text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20" : "text-secondary hover:bg-surface-hover-strong hover:text-primary"
            }`}
          >
            {item.icon && <span className="text-sm">{item.icon}</span>}
            {item.label}
          </button>
        )
      )}
    </div>
  );
}
