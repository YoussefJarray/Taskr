import { BsCollection } from "react-icons/bs";
import { useApp } from "../../context/AppContext";

export default function CollectionFilter({ value, onChange }) {
  const { collections } = useApp();

  return (
    <div className="flex items-center gap-2">
      <BsCollection className="text-gray-400 text-sm flex-shrink-0" />
      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value || null)}
        className="px-3 py-1.5 rounded-lg text-sm border border-default bg-white bg-surface-tertiary text-primary focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 transition-all min-w-[140px]"
      >
        <option value="">All collections</option>
        {collections.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
    </div>
  );
}
