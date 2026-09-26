import { JSX } from "react";
import { Link } from "react-router-dom";
import { useModal } from "../../Contexts/Modal.context";
import CreateUserModal from "./CreateModal.component";

interface HeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onRefresh: () => void;
}

export default function Header({
  searchTerm,
  onSearchChange,
  onRefresh,
}: HeaderProps): JSX.Element {
  const { showModal } = useModal();

  return (
    <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
      {/* Title & Back Button */}
      <div className="flex items-center gap-3">
        <Link
          to="/"
          className="w-10 h-10 flex items-center justify-center bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-600 dark:text-zinc-300 rounded-xl transition-all active:scale-95"
          title="กลับไปหน้าหลัก"
        >
          <span className="material-symbols-outlined text-[20px]">
            arrow_back
          </span>
        </Link>
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-zinc-100 font-[Prompt]">
            จัดการผู้ใช้งาน
          </h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400 font-[Sarabun]">
            เพิ่ม ลบ หรือแก้ไขข้อมูลนักศึกษาและผู้ดูแลระบบ
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row w-full md:w-auto items-stretch sm:items-center gap-3">
        {/* Search */}
        <div className="relative flex-grow sm:flex-grow-0 sm:w-64 lg:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-[18px] text-slate-400 dark:text-zinc-500">
              search
            </span>
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-[Sarabun] text-slate-800 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 shadow-sm transition-all"
            placeholder="ค้นหาชื่อ หรือรหัสนักศึกษา..."
          />
        </div>

        {/* Add Button */}
        <button
          type="button"
          onClick={() => showModal(<CreateUserModal onSuccess={onRefresh} />)}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95 font-[Sarabun] shrink-0"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>เพิ่มผู้ใช้งาน</span>
        </button>
      </div>
    </header>
  );
}
