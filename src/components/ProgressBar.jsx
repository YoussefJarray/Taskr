export function ProgressBar({ progress }) {
  return (
      <div className="w-full bg-slate-200 rounded-full h-2.5 dark:bg-gray-700">
          <div className={`bg-purple-700 h-2.5 rounded-full transition-all delay-100 duration-500 ease-out`} style={{width: progress + "%"}} />
      </div>
  );
}