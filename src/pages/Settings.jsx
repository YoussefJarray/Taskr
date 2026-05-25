import { useApp } from "../context/AppContext";
import { BsSun, BsMoon, BsBrightnessHigh, BsStar, BsExclamationTriangle, BsFlower1, BsDroplet, BsCircleHalf, BsFire } from "react-icons/bs";
import { useState } from "react";

const THEMES = [
  { id: "light", label: "Light", desc: "Clean white", icon: BsSun, accent: "#8B5CF6", bg: "#ffffff", text: "#111827" },
  { id: "warm", label: "Warm", desc: "Amber warmth", icon: BsBrightnessHigh, accent: "#D97706", bg: "#FEFCF5", text: "#3D3222" },
  { id: "rose", label: "Rose", desc: "Soft pink glow", icon: BsFlower1, accent: "#D6336C", bg: "#fef7f7", text: "#3D2028" },
  { id: "ocean", label: "Ocean", desc: "Cyan depths", icon: BsCircleHalf, accent: "#0284c7", bg: "#f0f9fc", text: "#082f49" },
  { id: "dark", label: "Midnight", desc: "Deep blue", icon: BsMoon, accent: "#8B5CF6", bg: "#13132B", text: "#f1f1f1" },
  { id: "deep-purple", label: "Deep Purple", desc: "Rich violet", icon: BsStar, accent: "#A78BFA", bg: "#1E1040", text: "#f1e8ff" },
  { id: "emerald", label: "Emerald", desc: "Green depths", icon: BsDroplet, accent: "#34D399", bg: "#0f2a1e", text: "#e8fff0" },
  { id: "sunset", label: "Sunset", desc: "Warm glow", icon: BsFire, accent: "#ff8c4a", bg: "#2d1f18", text: "#ffe8d0" },
];

export default function Settings() {
  const { theme, setTheme, tasks, collections, moodImages } = useApp();
  const [showClear, setShowClear] = useState(false);

  const handleClear = () => {
    localStorage.clear();
    window.location.reload();
  };

  const totalImages = tasks.reduce((sum, t) => sum + (t.images?.length || 0), 0);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Settings</h1>
        <p className="text-sm text-secondary mt-0.5">Customize your experience</p>
      </div>

       {/* Theme selector */}
       <section className="rounded-xl border border-subtle bg-surface-card p-5">
         <h2 className="text-sm font-semibold text-primary mb-3">Theme</h2>
         <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
           {THEMES.map((t) => {
             const Icon = t.icon;
             const active = theme === t.id;
             return (
               <button
                 key={t.id}
                 onClick={() => setTheme(t.id)}
                 className={`relative rounded-lg p-2.5 border-2 transition-all text-center ${
                   active
                     ? "border-[var(--accent)] shadow-md"
                     : "border-transparent hover:border-[var(--border-default)]"
                 }`}
                 style={{ backgroundColor: t.bg, color: t.text, borderColor: active ? t.accent : undefined }}
                 title={t.label}
               >
                 {active && (
                   <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: t.accent }} />
                 )}
                 <Icon className="text-base mb-1" style={{ color: t.accent, margin: "0 auto" }} />
                 <p className="text-[10px] font-semibold truncate">{t.label}</p>
               </button>
             );
           })}
         </div>
       </section>

      {/* Storage stats */}
      <section className="rounded-xl border border-subtle bg-surface-card p-5">
        <h2 className="text-sm font-semibold text-primary mb-3">Storage</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
          {[
            { label: "Tasks", value: tasks.length },
            { label: "Collections", value: collections.length },
            { label: "Mood images", value: moodImages.length },
            { label: "Task images", value: totalImages },
          ].map(({ label, value }) => (
            <div key={label} className="px-3 py-2.5 rounded-lg bg-surface-secondary">
              <p className="text-xs text-secondary">{label}</p>
              <p className="text-lg font-bold text-primary">{value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Danger zone */}
      <section className="rounded-xl border border-rose-200/60 dark:border-rose-800/30 bg-rose-50/30 dark:bg-rose-950/20 p-5">
        <div className="flex items-center gap-2 mb-3">
          <BsExclamationTriangle className="text-rose-400 text-sm" />
          <h2 className="text-sm font-semibold text-rose-600 dark:text-rose-400">Danger zone</h2>
        </div>
        <p className="text-xs text-secondary mb-3">This will permanently delete all your data. This cannot be undone.</p>
        {showClear ? (
          <div className="flex items-center gap-2">
            <button onClick={handleClear} className="px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-rose-600 hover:bg-rose-500 transition-all">
              Confirm wipe
            </button>
            <button onClick={() => setShowClear(false)} className="px-3 py-1.5 rounded-lg text-xs font-medium text-secondary bg-surface-hover-strong hover:bg-surface-hover transition-all">
              Cancel
            </button>
          </div>
        ) : (
          <button onClick={() => setShowClear(true)} className="px-3 py-1.5 rounded-lg text-xs font-medium text-rose-500 hover:text-white border border-rose-300 dark:border-rose-700 hover:bg-rose-500 transition-all">
            Wipe all data
          </button>
        )}
      </section>
    </div>
  );
}
