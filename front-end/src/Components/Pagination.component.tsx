import { JSX, useState, useEffect } from "react";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export default function Pagination({
  page,
  totalPages,
  onPageChange,
  isLoading,
}: PaginationProps): JSX.Element | null {
  const [maxPageSeen, setMaxPageSeen] = useState(page);

  useEffect(() => {
    if (page > maxPageSeen) {
      setMaxPageSeen(page);
    }
  }, [page, maxPageSeen]);

  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const highestToShow = Math.min(totalPages, maxPageSeen + 1);

    pages.push(1);
    
    if (page > 3) {
      pages.push('...');
    }
    
    const start = Math.max(2, page - 1);
    const end = Math.min(highestToShow, page + 1);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    if (highestToShow > end + 1) {
      pages.push('...');
    }
    
    if (highestToShow > end) {
      pages.push(highestToShow);
    }
    
    return pages;
  };

  return (
    <div className="w-full flex justify-center items-center gap-1.5 mt-10 mb-6 col-span-full font-[Prompt]">
      <button
        disabled={page <= 1 || isLoading}
        onClick={() => onPageChange(page - 1)}
        className="w-10 h-10 flex items-center justify-center bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-100 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:hover:bg-white dark:disabled:hover:bg-zinc-900 disabled:cursor-not-allowed transition-all shadow-sm active:scale-95"
        aria-label="หน้าก่อนหน้า"
      >
        <span className="material-symbols-outlined text-[20px]">chevron_left</span>
      </button>

      <div className="flex items-center gap-1.5 px-1">
        {getPageNumbers().map((p, index) => {
          if (p === '...') {
            return (
              <span key={`ellipsis-${index}`} className="w-8 flex justify-center text-slate-400 dark:text-zinc-500 font-bold tracking-widest">
                ...
              </span>
            );
          }
          const isCurrent = p === page;
          return (
            <button
              key={`page-${p}`}
              disabled={isLoading}
              onClick={() => onPageChange(p as number)}
              className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-semibold transition-all shadow-sm active:scale-95 ${
                isCurrent
                  ? "bg-indigo-600 text-white shadow-indigo-500/30 border border-indigo-600"
                  : "bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-slate-50 dark:hover:bg-zinc-800 disabled:opacity-50"
              }`}
            >
              {p}
            </button>
          );
        })}
      </div>

      <button
        disabled={page >= totalPages || isLoading}
        onClick={() => onPageChange(page + 1)}
        className="w-10 h-10 flex items-center justify-center bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-100 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:hover:bg-white dark:disabled:hover:bg-zinc-900 disabled:cursor-not-allowed transition-all shadow-sm active:scale-95"
        aria-label="หน้าถัดไป"
      >
        <span className="material-symbols-outlined text-[20px]">chevron_right</span>
      </button>
    </div>
  );
}
