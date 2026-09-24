import { JSX } from "react";

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
  if (totalPages <= 1) return null;

  return (
    <div className="w-full flex justify-center items-center gap-4 mt-10 mb-6 col-span-full font-[Prompt]">
      <button
        disabled={page <= 1 || isLoading}
        onClick={() => onPageChange(page - 1)}
        className="px-5 py-2.5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm active:scale-95"
      >
        ก่อนหน้า
      </button>

      <span className="text-sm font-semibold text-slate-600 dark:text-zinc-400 bg-slate-100 dark:bg-zinc-800 px-4 py-2 rounded-xl font-[Sarabun]">
        หน้า {page} จาก {totalPages}
      </span>

      <button
        disabled={page >= totalPages || isLoading}
        onClick={() => onPageChange(page + 1)}
        className="px-5 py-2.5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm active:scale-95"
      >
        ถัดไป
      </button>
    </div>
  );
}
