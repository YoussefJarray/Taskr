import { TodoItem } from "./TodoItem";
import { BsFillEmojiSmileUpsideDownFill } from "react-icons/bs";
import { CircularProgress } from './CircularProgress';

function sortByPriority(array) {
  const priorityOrder = { high: 3, moderate: 2, low: 1 };

  array.sort((a, b) => {
    const priorityA = priorityOrder[a.priority.toLowerCase()];
    const priorityB = priorityOrder[b.priority.toLowerCase()];

    return priorityB - priorityA;
  });

  return array;
}

export function TodoList({ todos, toggleTodo, deleteTodo }) {

  todos = sortByPriority(todos);
  console.log(todos);
  
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
        <div className="flex flex-row py-6 px-16 bg-slate-200 dark:bg-slate-800 rounded-xl">
          <section className="flex flex-col my-auto mr-5">
            <h2 className="text-gray-900 dark:text-white font-extrabold text-2xl">Your Tasks</h2>
            <p className="text-gray-900 dark:text-white font-normal text-lg">You Have {todos.length} Active Tasks</p>
          </section>
          <div className="py-4 ml-auto">
            <CircularProgress progress={Math.floor(progress)}/>
          </div>
        </div>
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
