import { RxCross2 } from "react-icons/rx";

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function TodoItem({
  completed,
  id,
  title,
  description,
  priority,
  toggleTodo,
  deleteTodo,
}) {
  return (
    <li className="min-w-full md:mr-2 rounded-3xl bg-slate-200 shadow-md dark:bg-slate-800 py-8 px-6 my-2 flex flex-row justify-between">
      <label className="flex items-center">
        <input
          type="checkbox"
          checked={completed}
          onChange={e => toggleTodo(id, e.target.value)}
          className="h-5 w-5 my-auto text-center align-middle mr-4 accent-green-600"
        />
        <div
          className={`h-full w-1 mr-4 rounded-xl drop-shadow-xl ${
            completed
              ? "bg-green-600 shadow-green-600"
              : "bg-red-500 shadow-red-500"
          }`}
        ></div>
      </label>
      <div className="flex flex-col">
        <p className="text-gray-900 dark:text-white overflow-visible font-medium text-xl">
          {completed && (
            <span className="line-through text-slate-400">{title}</span>
          )}
          {!completed && <span>{title}</span>}
        </p>
        <p className="text-gray-900 dark:text-slate-300 overflow-visible font-medium text-sm">
          {completed && (
            <span className="line-through text-slate-400">{description}</span>
          )}
          {!completed && <span>{description}</span>}
        </p>
        <p className="text-gray-900 dark:text-slate-300 overflow-visible font-medium text-sm">
          {completed && (
            <span className="line-through text-slate-400">{capitalizeFirstLetter(priority) + " Priorrity"}</span>
          )}
          {!completed && <span>{capitalizeFirstLetter(priority) + " Priorrity"}</span>}
        </p>
      </div>
      <a className="my-auto rounded-sm p-2" onClick={() => deleteTodo(id)}>
        <RxCross2 className="text-slate-500 dark:bg-slate-800" />
      </a>
    </li>
  );
}
