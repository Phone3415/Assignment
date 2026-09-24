import { JSX } from "react/jsx-runtime";

export default function LoginHeader(): JSX.Element {
  return (
    <div className="w-full text-center space-y-2">
      <div className="w-12 h-12 bg-blue-50 dark:bg-zinc-800 text-blue-600 dark:text-zinc-300 rounded-xl flex items-center justify-center mx-auto mb-4 transition-colors duration-300">
        <span className="material-symbols-outlined text-[28px]">lock</span>
      </div>
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight font-[Prompt]">
        ยินดีต้อนรับ
      </h1>
      <p className="text-slate-500 dark:text-zinc-400 text-sm font-medium font-[Sarabun]">
        กรุณากรอกรหัสนักศึกษาเพื่อเข้าสู่ระบบ
      </p>
    </div>
  );
}
