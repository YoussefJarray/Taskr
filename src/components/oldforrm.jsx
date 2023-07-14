import { useState } from "react";

export function NewToDoForm({addTask}) {
  const [newItem, setNewItem] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    addTask(newItem);
    setNewItem("");
  }

  return (
    <form onSubmit={handleSubmit} className="p-10">
      <div id="form-row" className="flex flex-col">
        <label className="text-center text-xl font-semibold dark:text-white">
          New Item
        </label>
        <input
          id="item"
          value={newItem}
          onChange={e => setNewItem(e.target.value)}
          className="rounded-md text-md px-3 py-1 border bg-slate-200 border-none focus:outline-none dark:text-white dark:bg-slate-800 active:outline-none active:border-none min-w-full min-h-[40px] my-2"
          type="text"
        />
        
      </div>
      <button className="rounded-md text-md text-white px-3 bg-purple-700  min-w-full min-h-[40px] my-2 hover:outline hover:outline-2 hover:outline-purple-700 hover:outline-offset-2">
        Add Item
      </button>
    </form>
  );
}
