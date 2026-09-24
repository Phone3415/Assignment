import { JSX } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function NotFoundPage(): JSX.Element {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 flex items-center justify-center p-6 relative overflow-hidden transition-colors duration-300">
      {/* Background ambient lighting effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 dark:bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/10 dark:bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <main className="relative z-10 max-w-lg w-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-zinc-800/80 p-8 sm:p-12 rounded-3xl shadow-xl flex flex-col items-center text-center">
        {/* Badge / Code */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200/60 dark:border-blue-800/50 text-blue-600 dark:text-blue-400 text-xs font-bold tracking-wide uppercase mb-6 font-[Prompt]">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
          ข้อผิดพลาด 404
        </div>

        <h1 className="text-7xl sm:text-8xl font-black tracking-tight text-slate-800 dark:text-zinc-100 font-[Prompt] mb-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 bg-clip-text text-transparent">
          404
        </h1>

        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-zinc-100 font-[Prompt] mb-3">
          ไม่พบหน้าที่คุณต้องการ
        </h2>

        <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400 font-[Sarabun] leading-relaxed mb-8 max-w-sm">
          หน้าที่คุณกำลังค้นหาอาจถูกย้าย ลบ หรือ URL ที่คุณพิมพ์เข้ามาอาจไม่ถูกต้อง
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full justify-center font-[Prompt]">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 font-semibold hover:bg-slate-50 dark:hover:bg-zinc-700/60 transition-all active:scale-95 text-sm"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>ย้อนกลับ</span>
          </button>

          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all shadow-md shadow-blue-500/20 active:scale-95 text-sm"
          >
            <span className="material-symbols-outlined text-[18px]">home</span>
            <span>กลับหน้าหลัก</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
