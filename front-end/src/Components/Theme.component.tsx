import { JSX, useEffect, useRef, useState } from "react";
import { useTheme } from "../Contexts/Theme.context";

export default function ThemeToggle(): JSX.Element {
  const { theme, setTheme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsExpanded(false);
    }, 500);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleSelect = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
    setIsExpanded(false);
  };

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  const renderIcon = (type: string) => {
    if (type === "light") {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="4"></circle>
          <path d="M12 2v2"></path>
          <path d="M12 20v2"></path>
          <path d="m4.93 4.93 1.41 1.41"></path>
          <path d="m17.66 17.66 1.41 1.41"></path>
          <path d="M2 12h2"></path>
          <path d="M20 12h2"></path>
          <path d="m6.34 17.66-1.41 1.41"></path>
          <path d="m19.07 4.93-1.41 1.41"></path>
        </svg>
      );
    }
    if (type === "system") {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect width="20" height="14" x="2" y="3" rx="2"></rect>
          <line x1="8" x2="16" y1="21" y2="21"></line>
          <line x1="12" x2="12" y1="17" y2="21"></line>
        </svg>
      );
    }
    if (type === "dark") {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
        </svg>
      );
    }
  };

  const options: Array<"light" | "system" | "dark"> = [
    "light",
    "system",
    "dark",
  ];

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Dropdown Menu */}
      <div
        className={`bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-slate-200/80 dark:border-zinc-800/80 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] p-1.5 transition-all duration-300 origin-bottom-right ${
          isExpanded
            ? "scale-100 opacity-100 translate-y-0"
            : "scale-90 opacity-0 pointer-events-none translate-y-2"
        }`}
      >
        <div className="flex flex-col gap-1 w-36 font-[Sarabun]">
          {options.map((option) => {
            const labels = {
              light: "โหมดสว่าง",
              system: "ตามระบบ",
              dark: "โหมดมืด",
            };
            return (
              <button
                key={option}
                onClick={() => handleSelect(option)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  theme === option
                    ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400"
                    : "text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800/60 hover:text-slate-900 dark:hover:text-zinc-100"
                }`}
              >
                <div
                  className={`${
                    theme === option
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-slate-400 dark:text-zinc-500"
                  }`}
                >
                  {renderIcon(option)}
                </div>
                <span>{labels[option]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Toggle Button */}
      <button
        onClick={toggleExpand}
        className="flex items-center justify-center w-12 h-12 rounded-full bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 border border-slate-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-950"
        aria-label="เปลี่ยนธีม"
        title="เปลี่ยนธีม"
      >
        {renderIcon(theme)}
      </button>
    </div>
  );
}
