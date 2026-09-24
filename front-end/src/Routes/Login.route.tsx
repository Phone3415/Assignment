import LoginForm from "../Components/login/Form.component";
import LoginHeader from "../Components/login/Header.component";

// --- Main View ---
export default function LoginPage() {
  return (
    <section className="w-full min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-zinc-950 p-4 font-sans text-slate-900 dark:text-zinc-100 transition-colors duration-300">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 p-8 md:p-10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] border border-slate-100 dark:border-zinc-800 flex flex-col items-center gap-8 transition-colors duration-300 animate-in fade-in slide-in-from-bottom-8 ease-out">
        <LoginHeader />
        <LoginForm />

        <div className="text-center text-xs text-slate-400 dark:text-zinc-500 mt-2">
          Occupational Health & Safety
        </div>
      </div>
    </section>
  );
}
