import { JSX } from "react";
import { useModal } from "../../Contexts/Modal.context";

interface NotesModalProps {
  assignmentName: string;
  type: "public" | "private";
}

export default function NotesModal({
  assignmentName,
  type,
}: NotesModalProps): JSX.Element {
  const { hideModal } = useModal();
  const isPublic = type === "public";

  return (
    <div className="flex flex-col gap-5 font-[Sarabun]">
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            isPublic
              ? "bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400"
              : "bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400"
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">
            {isPublic ? "public" : "lock"}
          </span>
        </div>
        <div>
          <h2 className="text-xl font-bold font-[Prompt] text-slate-800 dark:text-zinc-100">
            {isPublic ? "โน้ตสาธารณะ (Public Note)" : "โน้ตส่วนตัว (Private Note)"}
          </h2>
          <p className="text-xs text-slate-500 dark:text-zinc-400">
            {assignmentName}
          </p>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 flex flex-col gap-2">
        <div className="flex items-center gap-2 text-slate-700 dark:text-zinc-300 font-semibold text-sm">
          <span className="material-symbols-outlined text-[18px] text-blue-500">
            info
          </span>
          <span>จุดเชื่อมต่อข้อมูลโน้ต (Entry Point)</span>
        </div>
        <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
          {isPublic
            ? "โน้ตสาธารณะเปิดให้นักศึกษาทุกคนในห้องเรียนเข้าถึงข้อมูลสำคัญร่วมกันได้ ขณะนี้ระบบพร้อมสำหรับการเชื่อมต่อ API โน้ตในขั้นตอนถัดไป"
            : "โน้ตส่วนตัวสำหรับบันทึกความคืบหน้า รายละเอียดส่วนบุคคล หรือข้อสงสัยเฉพาะตัวของคุณ ขณะนี้พร้อมสำหรับการเชื่อมต่อ API ในขั้นตอนถัดไป"}
        </p>
      </div>

      <div className="flex justify-end mt-2">
        <button
          type="button"
          onClick={hideModal}
          className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 rounded-xl font-semibold transition-colors font-[Prompt] text-sm"
        >
          ปิดหน้าต่าง
        </button>
      </div>
    </div>
  );
}
