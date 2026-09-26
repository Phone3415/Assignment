import { Excalidraw } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import { JSX, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PrivateNoteIndicator from "../Components/assignment/PrivateNoteIndicator.component";
import { usePrivateNote } from "../Hooks/PrivateNote.hook";

export default function PrivateNoteRoute(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const assignmentId = id ? parseInt(id, 10) : 0;

  const { initialData, saveState, isLoading, saveNote } =
    usePrivateNote(assignmentId);
  const [excalidrawAPI, setExcalidrawAPI] = useState<any>(null);

  // Update theme based on document class
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          const currentlyDark =
            document.documentElement.classList.contains("dark");
          setTheme(currentlyDark ? "dark" : "light");
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  if (!assignmentId) {
    return (
      <div className="flex h-screen items-center justify-center font-[Sarabun]">
        <p className="text-slate-500">ไม่พบข้อมูลงาน</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center flex-col gap-4 font-[Sarabun] bg-slate-50 dark:bg-zinc-950">
        <span className="material-symbols-outlined text-4xl text-indigo-500 animate-spin">
          sync
        </span>
        <p className="text-slate-600 dark:text-slate-400 font-semibold">
          กำลังโหลดกระดานโน้ตส่วนตัว...
        </p>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen flex flex-col bg-slate-50 dark:bg-zinc-950 font-[Sarabun]">
      {/* Dedicated Navbar */}
      <div className="flex-none h-14 bg-white dark:bg-zinc-950 border-b border-slate-200 dark:border-zinc-800 px-4 flex items-center justify-between z-10">
        <div className="flex-1 flex items-center justify-start">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-zinc-900 hover:bg-slate-200 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 rounded-lg transition-colors font-semibold font-[Prompt] text-sm active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">
              arrow_back
            </span>
            กลับ
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center font-[Prompt] text-slate-800 dark:text-zinc-100 font-semibold text-sm">
          กระดานโน้ตส่วนตัว
        </div>
        <div className="flex-1" />
      </div>

      {/* Canvas Area */}
      <div className="flex-1 relative">
        <Excalidraw
          excalidrawAPI={(api) => setExcalidrawAPI(api)}
          initialData={initialData || undefined}
          onChange={(elements, appState) => {
            // Avoid triggering saves on initial load by checking if user actually interacted
            // Save note passing elements and relevant appState
            saveNote({ elements, appState: { ...appState, collaborators: [] } });
          }}
          theme={theme}
        />
        <PrivateNoteIndicator saveState={saveState} />
      </div>
    </div>
  );
}
