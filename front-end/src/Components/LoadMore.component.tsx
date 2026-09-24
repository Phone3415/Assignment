import { JSX } from "react";

interface LoadMoreProps {
  onClick: () => void;
  isLoading: boolean;
  isHidden: boolean;
}

export default function LoadMore({
  onClick,
  isLoading,
  isHidden,
}: LoadMoreProps): JSX.Element | null {
  if (isHidden) return null;

  return (
    <div className="w-full flex justify-center mt-10 mb-6 col-span-full">
      <button
        onClick={onClick}
        disabled={isLoading}
        className="px-8 py-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 rounded-full font-semibold shadow-sm hover:shadow transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed font-[Sarabun]"
      >
        {isLoading ? (
          <span className="flex flex-row items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-700 dark:border-zinc-300"></div>
            กำลังโหลด...
          </span>
        ) : (
          "โหลดเพิ่มเติม"
        )}
      </button>
    </div>
  );
}
