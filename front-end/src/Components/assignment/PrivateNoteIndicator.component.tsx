import { JSX } from "react";
import { SaveState } from "../../Hooks/PrivateNote.hook";

interface PrivateNoteIndicatorProps {
  saveState: SaveState;
}

export default function PrivateNoteIndicator({ saveState }: PrivateNoteIndicatorProps): JSX.Element | null {
  if (saveState === "idle") return null;

  const getStateConfig = () => {
    switch (saveState) {
      case "saving":
        return {
          icon: "sync",
          text: "กำลังบันทึก...",
          classes: "text-blue-500 bg-blue-50/80 dark:bg-blue-500/10 dark:text-blue-400 border-blue-200 dark:border-blue-900",
          spin: true,
        };
      case "saved":
        return {
          icon: "cloud_done",
          text: "บันทึกแล้ว",
          classes: "text-emerald-500 bg-emerald-50/80 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900",
          spin: false,
        };
      case "error":
        return {
          icon: "cloud_off",
          text: "บันทึกไม่สำเร็จ",
          classes: "text-rose-500 bg-rose-50/80 dark:bg-rose-500/10 dark:text-rose-400 border-rose-200 dark:border-rose-900",
          spin: false,
        };
      default:
        return null;
    }
  };

  const config = getStateConfig();
  if (!config) return null;

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur-md shadow-sm transition-all duration-300 ${config.classes}`}>
      <span className={`material-symbols-outlined text-[18px] ${config.spin ? 'animate-spin' : ''}`}>
        {config.icon}
      </span>
      <span className="text-sm font-semibold font-[Sarabun]">
        {config.text}
      </span>
    </div>
  );
}
