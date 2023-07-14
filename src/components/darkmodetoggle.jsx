import "../styles.css";
import { BsFillSunFill, BsFillMoonFill } from "react-icons/bs";

export function DarkModeToggle() {
  return (
    <div
      className="h-8 w-16 bg-slate-300 dark:bg-gray-800 rounded-full flex transition-all duration-500"
    >
      <div className="h-6 w-6 bg-slate-100 dark:bg-slate-600 rounded-full my-auto ml-1 dark:ml-9 flex transition-all duration-500">
        <BsFillMoonFill className="hidden dark:block dark:text-slate-300 m-auto transition-all delay-500" />
        <BsFillSunFill className="dark:hidden text-yellow-500 m-auto transition-all delay-500" />
      </div>
    </div>
  );
}
