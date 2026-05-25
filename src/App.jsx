import { useState, useEffect, useRef } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { useApp } from "./context/AppContext";
import Sidebar from "./components/layout/Sidebar";
import FAB from "./components/ui/FAB";
import CollectionFilter from "./components/tasks/CollectionFilter";
import Confetti from "./components/ui/Confetti";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Kanban from "./pages/Kanban";
import MoodBoard from "./pages/MoodBoard";
import Settings from "./pages/Settings";

const FILTER_ROUTES = ["/tasks", "/kanban"];

function AppLayout({ children }) {
  const { collectionFilter, setCollectionFilter } = useApp();
  const location = useLocation();
  const showFilter = FILTER_ROUTES.includes(location.pathname);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[var(--body-bg-from)] via-[var(--body-bg-via)] to-[var(--body-bg-to)] transition-colors duration-500">
      <Sidebar />
      <main className="flex-1 ml-56 p-5 overflow-y-auto max-h-screen relative">
        {showFilter && (
          <div className="mb-5">
            <CollectionFilter value={collectionFilter} onChange={setCollectionFilter} />
          </div>
        )}
        {children}
        <FAB />
      </main>
    </div>
  );
}

export default function App() {
  const { tasks } = useApp();
  const [showConfetti, setShowConfetti] = useState(false);
  const prevAllDone = useRef(false);

  useEffect(() => {
    const count = tasks.length;
    const allDone = count > 0 && tasks.every((t) => t.completed);
    if (allDone && !prevAllDone.current) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
    }
    prevAllDone.current = allDone;
  }, [tasks]);

  return (
    <>
      {showConfetti && <Confetti count={120} />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/app" element={<AppLayout><Dashboard /></AppLayout>} />
        <Route path="/tasks" element={<AppLayout><Tasks /></AppLayout>} />
        <Route path="/kanban" element={<AppLayout><Kanban /></AppLayout>} />
        <Route path="/moodboard" element={<AppLayout><MoodBoard /></AppLayout>} />
        <Route path="/settings" element={<AppLayout><Settings /></AppLayout>} />
      </Routes>
    </>
  );
}
