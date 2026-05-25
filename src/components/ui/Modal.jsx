import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { RxCross2 } from "react-icons/rx";

export default function Modal({ open, onClose, title, children, wide }) {
  const overlayRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

   return createPortal(
     <div
       ref={overlayRef}
       className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
       onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
     >
      <div
        className={`relative w-full shadow-2xl border border-subtle bg-surface-card animate-enter ${
          wide ? "max-w-2xl rounded-2xl p-6" : "max-w-lg rounded-2xl p-6"
        }`}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-primary">{title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface-hover-strong transition-colors">
            <RxCross2 className="text-secondary text-lg" />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body
  );
}
