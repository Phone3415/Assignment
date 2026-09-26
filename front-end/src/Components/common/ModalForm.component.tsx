import { JSX, ReactNode } from "react";

interface ModalFormLayoutProps {
  title: ReactNode;
  error?: string | null;
  isLoading?: boolean;
  submitText?: string;
  cancelText?: string;
  submitVariant?: "primary" | "danger" | "success";
  onSubmit: () => void;
  onCancel: () => void;
  children: ReactNode;
}

export default function ModalFormLayout({
  title,
  error,
  isLoading = false,
  submitText = "บันทึก",
  cancelText = "ยกเลิก",
  submitVariant = "primary",
  onSubmit,
  onCancel,
  children,
}: ModalFormLayoutProps): JSX.Element {
  const submitButtonClasses = {
    primary: "bg-indigo-600 hover:bg-indigo-700 text-white",
    danger: "bg-red-600 hover:bg-red-700 text-white",
    success: "bg-emerald-600 hover:bg-emerald-700 text-white",
  }[submitVariant];

  return (
    <div className="flex flex-col gap-5 font-[Sarabun]">
      {typeof title === "string" ? (
        <h2 className="text-xl font-bold font-[Prompt]">{title}</h2>
      ) : (
        title
      )}

      {error && (
        <p className="text-sm text-red-500 bg-red-50 dark:bg-red-500/10 p-3 rounded-lg border border-red-100 dark:border-red-500/20">
          {error}
        </p>
      )}

      {children}

      <div className="flex justify-end gap-3 mt-2">
        <button
          onClick={onCancel}
          disabled={isLoading}
          className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 dark:text-zinc-400 dark:hover:bg-zinc-800 rounded-xl font-semibold transition-colors font-[Prompt]"
        >
          {cancelText}
        </button>
        <button
          onClick={onSubmit}
          disabled={isLoading}
          className={`px-5 py-2.5 rounded-xl font-semibold transition-all shadow-sm active:scale-95 disabled:opacity-50 font-[Prompt] ${submitButtonClasses}`}
        >
          {isLoading ? "กำลังดำเนินการ..." : submitText}
        </button>
      </div>
    </div>
  );
}
