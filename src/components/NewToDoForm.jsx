import { useState } from "react";

export function NewToDoForm({ addTask }) {
  const [newItem, setNewItem] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newPriority, setNewPriority] = useState("low")

  function handleSubmit(e) {
    e.preventDefault();
    addTask(newItem, newDescription, newPriority);
    setNewItem("");
    setNewDescription("");
    setNewPriority("low");
  }

  return (
    <form onSubmit={handleSubmit} className="p-10">
      <div id="form-row" className="grid md:grid-cols-4">
        <label className="text-center text-xl font-semibold dark:text-white">
          Task:
        </label>
        <input
          id="item"
          value={newItem}
          className="rounded-md text-md px-3 py-1 border bg-slate-200 border-none focus:outline-none dark:text-white dark:bg-slate-800 active:outline-none active:border-none min-w-full min-h-[40px] my-2"
          type="text"
          onChange={e => setNewItem(e.target.value)}
        />
        <label className="text-center text-xl font-semibold dark:text-white">
          Description:
        </label>
        <input
          id="item"
          value={newDescription}
          onChange={e => setNewDescription(e.target.value)}
          className="rounded-md text-md px-3 py-1 border bg-slate-200 border-none focus:outline-none dark:text-white dark:bg-slate-800 active:outline-none active:border-none min-w-full min-h-[40px] my-2"
          type="text"
          required
        />

        <label className="text-center text-xl font-semibold dark:text-white">
          Priority:
        </label>
        <select
          id="priority"
          className="rounded-md text-md px-3 py-1 bg-slate-200 border-none focus:outline-none dark:text-white dark:bg-slate-800 active:outline-none active:border-none min-w-full min-h-[40px] my-2 text-center"
          value={newPriority}
          onChange={e => setNewPriority(e.target.value)}
          required
        >
          <option value="low">Low</option>
          <option value="moderate">Moderate</option>
          <option value="high">High</option>
        </select>
      </div>
      <button className="rounded-md text-md text-white px-3 bg-purple-700 min-w-full min-h-[40px] my-10 hover:outline hover:outline-2 hover:outline-purple-700 hover:outline-offset-2">
        Add Item
      </button>
    </form>
  );
}
