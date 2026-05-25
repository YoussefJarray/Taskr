import { useNavigate } from "react-router-dom";
import { BsArrowRight, BsCheck2, BsKanban, BsImage, BsBookmark, BsPalette } from "react-icons/bs";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      icon: BsKanban,
      title: "Kanban Boards",
      desc: "Visualize your workflow with drag-and-drop boards",
    },
    {
      icon: BsImage,
      title: "Mood Boards",
      desc: "Collect inspiration and organize creative ideas",
    },
    {
      icon: BsBookmark,
      title: "Smart Collections",
      desc: "Organize tasks into customizable collections",
    },
    {
      icon: BsPalette,
      title: "8 Themes",
      desc: "Express yourself with curated, hand-crafted themes",
    },
  ];

  return (
    <div className="min-h-screen bg-surface overflow-x-hidden flex flex-col">
      {/* Animated gradient background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: "radial-gradient(circle at 20% 50%, var(--accent) 0%, transparent 50%)",
            transform: `translateY(${scrollY * 0.5}px)`,
          }}
        />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: "radial-gradient(circle at 80% 50%, var(--accent) 0%, transparent 50%)",
            transform: `translateY(${scrollY * -0.3}px)`,
          }}
        />
      </div>

      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-surface/50 backdrop-blur-xl border-b border-subtle">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 via-fuchsia-400 to-rose-400 flex items-center justify-center text-white font-black text-sm shadow-lg">
              T
            </span>
            <span className="text-lg font-black gradient-text">taskr</span>
          </div>
          <button
            onClick={() => navigate("/app")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            style={{
              background: "linear-gradient(135deg, var(--accent) 0%, rgba(255, 140, 74, 0.8) 100%)",
            }}
          >
            Launch <BsArrowRight className="text-base" />
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-5 py-24 text-center relative">
        <div className="max-w-4xl">
          <h1 className="text-5xl md:text-8xl font-black leading-[1.1] tracking-tight text-primary mb-6 animate-enter">
            Organize your <span className="gradient-text inline-block">world</span>
          </h1>
          <p className="text-lg md:text-xl text-secondary max-w-2xl mx-auto leading-relaxed mb-8 animate-enter" style={{ animationDelay: "0.1s" }}>
            A beautifully designed task manager with Kanban boards, mood boards, collections, and hand-crafted themes. Everything stored locally. No sign-up needed.
          </p>

          {/* CTA Buttons */}
          <div className="flex items-center justify-center gap-4 mb-16 flex-wrap animate-enter" style={{ animationDelay: "0.2s" }}>
            <button
              onClick={() => navigate("/app")}
              className="flex items-center gap-2 px-7 py-3.5 rounded-xl text-base font-semibold text-white transition-all shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95"
              style={{
                background: "linear-gradient(135deg, var(--accent) 0%, rgba(255, 140, 74, 0.8) 100%)",
              }}
            >
              Start Now <BsArrowRight />
            </button>
            <button
              onClick={() => {
                document.querySelector("#features")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-7 py-3.5 rounded-xl text-base font-semibold text-primary border-2 border-subtle hover:border-[var(--accent)] transition-all"
            >
              Explore Features
            </button>
          </div>

          {/* Feature highlight cards */}
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12 animate-enter"
            style={{ animationDelay: "0.3s" }}
          >
            {[
              { emoji: "⚡", text: "Lightning fast", desc: "Everything runs locally" },
              { emoji: "🎨", text: "8 Themes", desc: "Hand-crafted designs" },
              { emoji: "💾", text: "Auto-save", desc: "Never lose your work" },
              { emoji: "🔒", text: "100% Private", desc: "Zero data tracking" },
            ].map((item, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-surface-card border border-subtle/50 hover:border-[var(--accent)]/30 transition-all"
              >
                <div className="text-2xl mb-2">{item.emoji}</div>
                <p className="font-semibold text-primary text-sm">{item.text}</p>
                <p className="text-xs text-tertiary mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-primary mb-4">
              Everything you need
            </h2>
            <p className="text-lg text-secondary max-w-2xl mx-auto">
              A complete task management solution with powerful features designed for your workflow
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={i}
                  className="group p-8 rounded-2xl border border-subtle bg-surface-card hover:border-[var(--accent)]/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="w-12 h-12 rounded-xl bg-accent-soft flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="text-xl" style={{ color: "var(--accent)" }} />
                  </div>
                  <h3 className="text-lg font-bold text-primary mb-2">{feature.title}</h3>
                  <p className="text-tertiary leading-relaxed">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Taskr */}
      <section className="py-20 px-5 bg-surface-secondary/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-primary mb-12 text-center">
            Why choose Taskr?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "No Friction",
                items: [
                  "No account creation",
                  "No login required",
                  "Instant setup",
                ],
              },
              {
                title: "Your Data",
                items: [
                  "All stored locally",
                  "Never synced",
                  "100% private",
                ],
              },
              {
                title: "Beautiful Design",
                items: [
                  "8 hand-crafted themes",
                  "Smooth animations",
                  "Responsive layouts",
                ],
              },
            ].map((section, i) => (
              <div
                key={i}
                className="p-6 rounded-xl bg-surface-card border border-subtle"
              >
                <h3 className="font-bold text-primary mb-4">{section.title}</h3>
                <ul className="space-y-3">
                  {section.items.map((item, j) => (
                    <li key={j} className="flex items-center gap-3 text-tertiary">
                      <BsCheck2 className="text-accent flex-shrink-0" style={{ color: "var(--accent)" }} />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black text-primary mb-6">
            Ready to get organized?
          </h2>
          <p className="text-lg text-secondary mb-8">
            Start using Taskr right now. No sign-up, no nonsense.
          </p>
          <button
            onClick={() => navigate("/app")}
            className="flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-bold text-white mx-auto transition-all shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95"
            style={{
              background: "linear-gradient(135deg, var(--accent) 0%, rgba(255, 140, 74, 0.8) 100%)",
            }}
          >
            Launch Taskr <BsArrowRight className="text-xl" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-subtle py-6 px-5 mt-auto">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-xs text-tertiary flex-col sm:flex-row gap-4">
          <span className="font-semibold text-primary">Taskr</span>
          <div className="flex items-center gap-6 text-center sm:text-left">
            <span>All data stored locally</span>
            <span>No tracking</span>
            <span>100% Free</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
