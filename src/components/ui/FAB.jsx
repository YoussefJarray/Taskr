import { useApp } from "../../context/AppContext";

export default function FAB() {
  const { addTask } = useApp();

  return (
    <button
      onClick={() => addTask({ title: "New task", description: "", priority: "low" })}
      className="fixed bottom-6 right-6 w-12 h-12 rounded-full text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center z-30"
      style={{ fontSize: 24, backgroundColor: "var(--accent)" }}
      title="Quick add task"
    >
      +
    </button>
  );
}
