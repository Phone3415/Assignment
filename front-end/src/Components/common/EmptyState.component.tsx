import { JSX } from "react";

export interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
}

export default function EmptyState({
  title = "ไม่พบวิชาเรียนที่คุณค้นหา",
  description = "ลองตรวจสอบตัวสะกด หรือค้นหาด้วยคำค้นหาอื่น",
  actionText,
  onAction,
}: EmptyStateProps): JSX.Element {
  return (
    <div className="col-span-full py-16 px-4 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-300">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-zinc-800/80 text-slate-400 dark:text-zinc-500 flex items-center justify-center mb-4 shadow-inner">
        <span className="material-symbols-outlined text-[32px]">search_off</span>
      </div>

      <h3 className="text-lg font-bold text-slate-700 dark:text-zinc-200 font-[Prompt] mb-1">
        {title}
      </h3>

      <p className="text-sm text-slate-500 dark:text-zinc-400 max-w-sm font-[Sarabun] mb-6">
        {description}
      </p>

      {actionText && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-500/10 dark:hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 font-semibold text-sm rounded-xl transition-all active:scale-95 font-[Prompt]"
        >
          <span className="material-symbols-outlined text-[18px]">refresh</span>
          <span>{actionText}</span>
        </button>
      )}
    </div>
  );
}
