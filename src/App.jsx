import { useEffect, useState } from "react";
import { CgDarkMode } from "react-icons/cg";
import "./styles.css";
import { DarkModeToggle } from "./components/darkmodetoggle";
import { NewToDoForm } from "./components/NewToDoForm";
import { TodoList } from "./components/TodoList";

const todosFromStorage = JSON.parse(localStorage.getItem("todos-list") || "[]");
const isDark = JSON.parse(localStorage.getItem("isDark") || false);

export default function App() {
  const [todos, setTodos] = useState(todosFromStorage);
  const [darkMode, setDarkMode] = useState(isDark);

  function toggleTodo(id, completed) {
    setTodos(currentList => {
      return currentList.map(todo => {
        if (id === todo.id) {
          return { ...todo, completed: !todo.completed };
        }
        return todo;
      });
    });
  }

  function addTodo(newItem, newDescription, newPriority) {
    if (newItem != "") {
      setTodos(currentList => {
        return [
          ...currentList,
          {
            id: crypto.randomUUID(),
            title: newItem,
            description: newDescription,
            priority: newPriority,
            completed: false,
          },
        ];
      });
    }
  }

  function deleteTodo(id) {
    setTodos(currentList => {
      return currentList.filter(todo => todo.id !== id);
    });
  }

  useEffect(() => {
    if (todosFromStorage!=[]) {
      setTodos(todosFromStorage);
    }
    if(isDark=="true"){
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if(todos!=null){
      localStorage.setItem("todos-list", JSON.stringify(todos));
    }
  }, [todos]);

  useEffect(() => {
    localStorage.setItem("isDark", JSON.stringify(darkMode));
  }, [darkMode]);

  return (
    <div className={darkMode ? "dark" : ""}>
      <section className="bg-slate-100 dark:bg-gray-900 min-h-screen transition-all duration-300">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-center text-5xl mx-10 mt-10 font-black bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-amber-200 via-violet-600 to-sky-900 bg-clip-text text-transparent duration-700 cursor-pointer select-none">
            Taskr
          </h1>
          <h2 className="text-center text-xl mx-10 my-2 font-semibold dark:text-white cursor-default select-none">
            By Yuki
          </h2>
          <a onClick={() => setDarkMode(!darkMode)}>
            <DarkModeToggle />
          </a>
        </div>
        <NewToDoForm addTask={addTodo} />
        <TodoList
          todos={todos}
          toggleTodo={toggleTodo}
          deleteTodo={deleteTodo}
        />
      </section>
    </div>
  );
}
