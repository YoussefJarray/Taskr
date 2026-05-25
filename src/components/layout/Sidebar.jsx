import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { BsGrid, BsListTask, BsKanban, BsPlusCircle, BsTrash, BsChevronLeft, BsChevronRight, BsImages, BsGear, BsInfoCircle, BsBookmark, BsStar, BsHeart, BsLightning, BsFlag, BsCalendar3, BsCheck2, BsPencil } from "react-icons/bs";
import { useApp } from "../../context/AppContext";
import Modal from "../ui/Modal";
import ContextMenu from "../ui/ContextMenu";

const nav = [
  { to: "/app", label: "Dashboard", icon: BsGrid },
  { to: "/tasks", label: "Tasks", icon: BsListTask },
  { to: "/kanban", label: "Kanban", icon: BsKanban },
  { to: "/moodboard", label: "Mood Board", icon: BsImages },
];

const COLORS = ["#8B5CF6","#EC4899","#06B6D4","#F59E0B","#10B981","#F97316","#3B82F6","#6366F1","#D6336C","#34D399"];

const ICONS = [
  { icon: BsBookmark, name: "Bookmark" },
  { icon: BsStar, name: "Star" },
  { icon: BsHeart, name: "Heart" },
  { icon: BsLightning, name: "Lightning" },
  { icon: BsFlag, name: "Flag" },
  { icon: BsCalendar3, name: "Calendar" },
  { icon: BsGrid, name: "Grid" },
  { icon: BsListTask, name: "List" },
];

export default function Sidebar() {
  const { collections, addCollection, deleteCollection, updateCollection, collectionFilter, setCollectionFilter } = useApp();
  const [newCol, setNewCol] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const [showCredits, setShowCredits] = useState(false);
  const [ctxCol, setCtxCol] = useState(null);
  const [ctxPos, setCtxPos] = useState(null);
  const [editCol, setEditCol] = useState(null);
  const [editName, setEditName] = useState("");
  const [editColor, setEditColor] = useState("");
  const [editIcon, setEditIcon] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const handleAddCol = () => {
    const name = newCol.trim();
    if (!name) return;
    addCollection({ name, color: COLORS[collections.length % COLORS.length], icon: "BsBookmark" });
    setNewCol("");
  };

  const openEdit = (c) => {
    setEditCol(c.id);
    setEditName(c.name);
    setEditColor(c.color);
    setEditIcon(c.icon || "BsBookmark");
  };

  const saveEdit = () => {
    if (!editName.trim() || !editCol) return;
    updateCollection({ id: editCol, name: editName.trim(), color: editColor, icon: editIcon });
    setEditCol(null);
  };

  const handleColCtx = (e, c) => {
    e.preventDefault();
    setCtxCol(c);
    setCtxPos({ x: e.clientX, y: e.clientY });
  };

  const colCtxItems = (c) => [
    { label: "Edit", icon: <BsPencil />, onClick: () => openEdit(c) },
    { label: "Go to tasks", icon: <BsListTask />, onClick: () => { setCollectionFilter(c.id); navigate("/tasks"); } },
    { label: "Delete", icon: <BsTrash />, divider: true, danger: true, onClick: () => deleteCollection(c.id) },
  ];

  return (
    <>
      <aside
        className={`fixed left-0 top-0 h-screen z-40 flex flex-col border-r border-subtle bg-surface-sidebar backdrop-blur-xl transition-all duration-300 overflow-hidden ${
          collapsed ? "w-14" : "w-56"
        }`}
      >
        {/* Logo header */}
        <div className={`flex items-center border-b border-subtle flex-shrink-0 ${collapsed ? "justify-center px-0 py-3" : "justify-between px-4 py-4"}`}>
          {collapsed ? (
            <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 via-fuchsia-400 to-rose-400 flex items-center justify-center text-white font-bold text-xs shadow-sm flex-shrink-0">T</span>
          ) : (
            <>
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 via-fuchsia-400 to-rose-400 flex items-center justify-center text-white font-bold text-sm shadow-sm flex-shrink-0">T</span>
                <h1 className="text-base font-black tracking-tight whitespace-nowrap"><span className="gradient-text">taskr</span></h1>
              </div>
              <button onClick={() => setCollapsed(true)} className="p-1 rounded-md text-tertiary hover:text-secondary hover:bg-surface-hover-strong transition-all flex-shrink-0" title="Collapse sidebar"><BsChevronLeft className="text-sm" /></button>
            </>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-1.5 py-2 space-y-0.5">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} end={to === "/app"}
              className={`flex items-center rounded-lg text-sm font-medium transition-all duration-200 ${
                collapsed ? "justify-center w-[44px] h-[36px] mx-auto" : "gap-2.5 px-3 py-2"
              } ${
                location.pathname === to || (to !== "/app" && location.pathname.startsWith(to))
                  ? "bg-accent-soft text-[var(--accent)]" : "text-secondary hover:bg-surface-hover-strong hover:text-primary"
              }`}
              title={collapsed ? label : undefined}
            >
              <Icon className="text-sm flex-shrink-0" />
              {!collapsed && <span className="truncate">{label}</span>}
            </NavLink>
          ))}

          {/* Collections */}
          {!collapsed && (
            <>
              <div className="pt-4 pb-1 px-3">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-tertiary">Collections</span>
              </div>
              {collections.map((c) => {
                const active = collectionFilter === c.id;
                const ColIcon = ICONS.find((i) => i.name === c.icon)?.icon || BsBookmark;
                return (
                  <div
                    key={c.id}
                    onClick={() => { setCollectionFilter(c.id); navigate("/tasks"); }}
                    onContextMenu={(e) => handleColCtx(e, c)}
                    className={`group flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm cursor-pointer transition-all ${
                      active ? "bg-accent-soft text-[var(--accent)]" : "text-secondary hover:bg-surface-hover-strong"
                    }`}
                  >
                    <ColIcon className="text-xs flex-shrink-0" style={{ color: c.color }} />
                    <span className="flex-1 truncate text-xs">{c.name}</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); openEdit(c); }}
                      className="opacity-0 group-hover:opacity-100 text-tertiary hover:text-[var(--accent)] transition-all flex-shrink-0"
                    >
                      <BsPencil className="text-[11px]" />
                    </button>
                  </div>
                );
              })}
              <div className="flex gap-1 px-3 pt-1.5">
                <input value={newCol} onChange={(e) => setNewCol(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAddCol()}
                  placeholder="New collection..."
                  className="flex-1 text-xs px-2 py-1 rounded-md bg-surface-hover-strong border border-transparent focus:outline-none focus:border-[var(--accent)]/30 text-primary placeholder-tertiary transition-colors min-w-0"
                />
                <button onClick={handleAddCol} className="p-1 text-[var(--accent)] hover:opacity-80 transition-colors flex-shrink-0"><BsPlusCircle className="text-sm" /></button>
              </div>
            </>
          )}
        </nav>

        {/* Bottom controls */}
        <div className={`border-t border-subtle py-2 flex items-center transition-all ${collapsed ? "flex-col gap-1 px-0" : "justify-between px-3"}`}>
          {collapsed && (
            <button onClick={() => setCollapsed(false)} className="p-2 rounded-lg text-tertiary hover:text-secondary hover:bg-surface-hover-strong transition-all" title="Expand sidebar">
              <BsChevronRight className="text-sm" />
            </button>
          )}
          <button onClick={() => setShowCredits(true)} className="p-2 rounded-lg text-tertiary hover:text-secondary hover:bg-surface-hover-strong transition-all" title="About Taskr">
            <BsInfoCircle className="text-sm" />
          </button>
          <NavLink to="/settings" className={`p-2 rounded-lg transition-all ${location.pathname === "/settings" ? "bg-accent-soft text-[var(--accent)]" : "text-tertiary hover:text-secondary hover:bg-surface-hover-strong"}`} title="Settings">
            <BsGear className="text-sm" />
          </NavLink>
        </div>
      </aside>

      {/* Context menu */}
      {ctxPos && ctxCol && <ContextMenu position={ctxPos} items={colCtxItems(ctxCol)} onClose={() => { setCtxPos(null); setCtxCol(null); }} />}

      {/* Credits Modal */}
      <Modal open={showCredits} onClose={() => setShowCredits(false)} title="About Taskr">
        <div className="space-y-4 text-sm text-secondary">
          <p><strong className="text-primary">Taskr</strong> — a modern task management app built with React, Tailwind, and GSAP.</p>
          <div className="space-y-1">
            <p className="text-primary font-medium text-xs uppercase tracking-wider">Tech Stack</p>
            <ul className="space-y-0.5"><li>React 18 + Vite</li><li>Tailwind CSS</li><li>GSAP</li><li>@hello-pangea/dnd</li><li>react-router-dom</li><li>react-icons</li></ul>
          </div>
          <div className="pt-2 border-t border-subtle">
            <p className="text-xs text-tertiary">All data stored locally in your browser.</p>
          </div>
        </div>
      </Modal>

      {/* Edit Collection Modal */}
      <Modal open={!!editCol} onClose={() => setEditCol(null)} title="Edit collection">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-secondary mb-1">Name</label>
            <input value={editName} onChange={(e) => setEditName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && saveEdit()}
              className="w-full px-3 py-2 rounded-lg text-sm border border-default bg-surface-input text-primary placeholder-tertiary focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-secondary mb-1.5">Color</label>
            <div className="flex gap-1.5 flex-wrap">
              {COLORS.map((c) => (
                <button key={c} onClick={() => setEditColor(c)}
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${editColor === c ? "ring-2 ring-offset-2 ring-offset-surface-card scale-110" : ""}`}
                  style={{ backgroundColor: c }}
                >{editColor === c && <BsCheck2 className="text-white text-xs" />}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-secondary mb-1.5">Icon</label>
            <div className="flex gap-2 flex-wrap">
              {ICONS.map(({ icon: Icn, name }) => (
                <button key={name} onClick={() => setEditIcon(name)}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-all ${
                    editIcon === name ? "bg-[var(--accent)] text-white shadow-md" : "bg-surface-hover-strong text-secondary hover:bg-surface-hover"
                  }`}
                ><Icn /></button>
              ))}
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <button onClick={saveEdit} className="flex-1 px-4 py-2 rounded-lg text-sm font-medium text-white transition-all" style={{ backgroundColor: "var(--accent)" }}>Save</button>
            <button onClick={() => setEditCol(null)} className="px-4 py-2 rounded-lg text-sm font-medium text-secondary bg-surface-hover-strong hover:bg-surface-hover transition-all">Cancel</button>
          </div>
        </div>
      </Modal>
    </>
  );
}
