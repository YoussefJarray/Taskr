import { useNavigate } from "react-router-dom";
import { BsArrowRight } from "react-icons/bs";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-surface overflow-x-hidden flex flex-col">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-surface/80 backdrop-blur-xl border-b border-subtle">
        <div className="max-w-4xl mx-auto flex items-center justify-between px-5 py-3">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 via-fuchsia-400 to-rose-400 flex items-center justify-center text-white font-bold text-xs shadow-sm">T</span>
            <span className="text-base font-black gradient-text">taskr</span>
          </div>
          <button onClick={() => navigate("/app")} className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all" style={{ backgroundColor: "var(--accent)", color: "#fff" }}>
            Get started <BsArrowRight />
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-5 py-20 text-center">
        <h1 className="text-4xl md:text-7xl font-black leading-[1.05] tracking-tight text-primary max-w-3xl">
          Organize your <span className="gradient-text">world</span>
        </h1>
        <p className="mt-4 text-base text-secondary max-w-md mx-auto leading-relaxed">
          A task manager with Kanban boards, mood boards, collections, and hand-crafted themes. No sign-up needed.
        </p>
        <div className="mt-8 flex items-center gap-3">
          <button onClick={() => navigate("/app")} className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg" style={{ backgroundColor: "var(--accent)", color: "#fff" }}>
            Launch Taskr <BsArrowRight />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-subtle py-4 px-5">
        <div className="max-w-4xl mx-auto flex items-center justify-between text-xs text-tertiary">
          <span>Taskr</span>
          <span>All data stored locally</span>
        </div>
      </footer>
    </div>
  );
}
