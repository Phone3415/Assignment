import { JSX } from "react";

export interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export default function ErrorState({
  title = "เกิดข้อผิดพลาดในการโหลดข้อมูล",
  message,
  onRetry,
}: ErrorStateProps): JSX.Element {
  return (
    <div className="col-span-full py-16 px-4 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-300">
      <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-950/40 text-red-500 dark:text-red-400 flex items-center justify-center mb-4 border border-red-100 dark:border-red-900/40 shadow-xs">
        <span className="material-symbols-outlined text-[32px]">cloud_off</span>
      </div>

      <h3 className="text-lg font-bold text-slate-800 dark:text-zinc-200 font-[Prompt] mb-1">
        {title}
      </h3>

      <p className="text-sm text-red-600/80 dark:text-red-400/80 max-w-md font-[Sarabun] mb-6">
        {message}
      </p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition-all shadow-sm hover:shadow active:scale-95 font-[Prompt]"
        >
          <span className="material-symbols-outlined text-[18px]">replay</span>
          <span>ลองใหม่อีกครั้ง</span>
        </button>
      )}
    </div>
  );
}
