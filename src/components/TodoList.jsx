import { ProgressBar } from "./ProgressBar";
import { TodoItem } from "./TodoItem";
import { BsFillEmojiSmileUpsideDownFill } from "react-icons/bs";

export function TodoList({ todos, toggleTodo, deleteTodo }) {
  let progress =
    (todos.filter(todo => todo.completed !== false).length / todos.length) *
    100;

  return (
    <div className="px-10 pt-6">
      {todos.length == 0 && (
        <h2 className="text-slate-300 dark:text-slate-800 font-bold text-2xl mb-4 text-center">
          <BsFillEmojiSmileUpsideDownFill className="mx-auto w-14 h-14 m-4 text-inherit"/> Wow, such empty!
        </h2>
      )}
      {todos.length != 0 && (
        <>
          <h2 className="text-gray-900 dark:text-white font-bold text-2xl text-center mb-4">
            {todos.length} Tasks Available | {progress.toFixed(0)} % of the way there!
          </h2>
          <ProgressBar progress={progress} />
        </>
      )}
      <ul className="py-5 grid lg:grid-cols-2 gap-2">
        {todos.map(todo => {
          return (
            <TodoItem
              {...todo}
              key={todo.id}
              toggleTodo={toggleTodo}
              deleteTodo={deleteTodo}
            />
          );
        })}
      </ul>
    </div>
  );
}
