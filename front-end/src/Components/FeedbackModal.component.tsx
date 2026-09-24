export default function FeedbackModal({
  type,
  title,
  text,
}: {
  type: "warning" | "error" | "success";
  title: string;
  text: string;
}) {
  const isWarning = type === "warning";
  const isError = type === "error";
  const isSuccess = type === "success";

  return (
    <div className="text-center space-y-3 font-[Prompt] animate-in zoom-in-90 duration-300">
      <div
        className={`mx-auto flex items-center justify-center w-12 h-12 rounded-full mb-4 ${isWarning ? "bg-orange-100 text-orange-500" : isError ? "bg-red-100 text-red-500" : "bg-green-100 text-green-500"}`}
      >
        <span className="material-symbols-outlined text-[24px]">
          {isSuccess ? "check" : type}
        </span>
      </div>
      <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-100">
        {title}
      </h3>
      <p className="text-sm text-slate-500 dark:text-zinc-400">{text}</p>
    </div>
  );
}
