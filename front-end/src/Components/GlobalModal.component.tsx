import { ReactNode } from "react";

interface GlobalModalProps {
  isOpen: boolean;
  content: ReactNode | null;
  onClose: () => void;
}

export default function GlobalModal({
  isOpen,
  content,
  onClose,
}: GlobalModalProps) {
  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300 ${
        isOpen
          ? "opacity-100 visible"
          : "opacity-0 invisible pointer-events-none"
      }`}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Modal Card */}
      <div
        className={`relative w-full max-w-md p-6 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-zinc-800 transition-all duration-300 transform ${
          isOpen
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-4"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:text-zinc-500 dark:hover:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
          aria-label="ปิด"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        <div className="mt-2 text-slate-900 dark:text-zinc-100 font-sans">
          {content}
        </div>
      </div>
    </div>
  );
}
