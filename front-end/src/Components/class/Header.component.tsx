import { JSX } from "react";
import { Link } from "react-router-dom";
import { useModal } from "../../Contexts/Modal.context";
import { JWTData } from "../../Types";
import CreateClassModal from "./CreateModal.component";

interface HeaderProps {
  user: JWTData;
  search: string;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
  onLogout: () => void;
  onRefresh: () => void;
}

export default function Header({
  user,
  search,
  onSearchChange,
  onClearSearch,
  onLogout,
  onRefresh,
}: HeaderProps): JSX.Element {
  const { showModal } = useModal();

  const handleAddClass = () => {
    showModal(<CreateClassModal onSuccess={onRefresh} />);
  };

  return (
    <header className="flex flex-col md:flex-row justify-between items-stretch md:items-center bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md p-6 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.04)] dark:shadow-[0_4px_20px_rgb(0,0,0,0.4)] border border-slate-200/80 dark:border-zinc-800/80 gap-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-blue-600 dark:bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
            <span className="material-symbols-outlined text-[24px]">
              school
            </span>
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold font-[Prompt] tracking-tight">
              รายการวิชาเรียน
            </h1>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <label className="group w-full sm:w-72 flex flex-row items-center gap-2 px-3.5 py-2 bg-slate-100/70 dark:bg-zinc-950/70 border border-slate-200 dark:border-zinc-800 rounded-xl focus-within:ring-2 focus-within:ring-blue-500 transition-all cursor-text">
          <span className="material-symbols-outlined text-slate-400 dark:text-zinc-500 text-[20px] pointer-events-none flex-shrink-0">
            search
          </span>
          <input
            type="text"
            name="searchClass"
            placeholder="ค้นหารายวิชา..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full min-w-0 bg-transparent border-none focus:outline-none font-[Sarabun] text-base text-slate-800 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-500"
          />
          {search && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onClearSearch();
              }}
              className="flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300 rounded-full transition-colors flex-shrink-0"
              aria-label="ล้างการค้นหา"
            >
              <span className="material-symbols-outlined text-[18px] leading-none">
                close
              </span>
            </button>
          )}
        </label>

        <div className="flex items-center gap-2">
          {user.role === "Admin" && (
            <button
              type="button"
              onClick={handleAddClass}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95 font-[Sarabun]"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span className="lg:block md:hidden">เพิ่มวิชา</span>
            </button>
          )}
          {user.role === "Admin" && (
            <Link
              to="/students"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95 font-[Sarabun]"
            >
              <span className="material-symbols-outlined text-[18px]">
                manage_accounts
              </span>
              <span className="lg:block md:hidden">จัดการนักศึกษา</span>
            </Link>
          )}
          <button
            type="button"
            onClick={onLogout}
            className="ml-auto lg:ml-0 p-2 text-slate-600 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-all font-[Prompt] flex items-center justify-center"
            title="ออกจากระบบ"
          >
            <span className="material-symbols-outlined text-[20px]">
              logout
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
