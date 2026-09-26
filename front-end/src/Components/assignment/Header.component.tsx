import { JSX } from "react";
import { Link } from "react-router-dom";
import { useModal } from "../../Contexts/Modal.context";
import { JWTData } from "../../Types";
import { AssignmentStatus } from "../../Types/assignment.type";
import CreateAssignmentModal from "./CreateModal.component";

interface AssignmentHeaderProps {
  classId: number;
  user: JWTData;
  search: string;
  statusFilter: AssignmentStatus | "";
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
  onStatusFilterChange: (status: AssignmentStatus | "") => void;
  onLogout: () => void;
  onRefresh: () => void;
}

export default function AssignmentHeader({
  classId,
  user,
  search,
  statusFilter,
  onSearchChange,
  onClearSearch,
  onStatusFilterChange,
  onLogout,
  onRefresh,
}: AssignmentHeaderProps): JSX.Element {
  const { showModal } = useModal();

  const handleAddAssignment = (): void => {
    showModal(
      <CreateAssignmentModal classId={classId} onSuccess={onRefresh} />,
      { maxWidth: "max-w-2xl" }
    );
  };

  return (
    <header className="flex flex-col gap-4 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md p-5 md:p-6 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.04)] dark:shadow-[0_4px_20px_rgb(0,0,0,0.4)] border border-slate-200/80 dark:border-zinc-800/80">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Title and Back Link */}
        <div className="flex items-start md:items-center gap-3">
          <Link
            to="/"
            className="w-10 h-10 shrink-0 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 flex items-center justify-center transition-colors shadow-xs mt-1 md:mt-0"
            title="กลับหน้ารายวิชา"
            aria-label="กลับหน้ารายวิชา"
          >
            <span className="material-symbols-outlined text-[20px]">
              arrow_back
            </span>
          </Link>

          <div className="flex items-start md:items-center gap-3">
            <div className="w-11 h-11 shrink-0 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 mt-0.5 md:mt-0">
              <span className="material-symbols-outlined text-[24px]">
                assignment
              </span>
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl md:text-2xl font-bold font-[Prompt] tracking-tight text-slate-900 dark:text-zinc-100">
                  รายงานและการบ้าน
                </h1>
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 font-[Sarabun] whitespace-nowrap">
                  ห้องเรียน #{classId}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-zinc-400 font-[Sarabun] mt-0.5 line-clamp-1">
                ตรวจสอบ กำหนดการ และสถานะการส่งงานของคุณ
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
          {user.role === "Admin" && (
            <button
              type="button"
              onClick={handleAddAssignment}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95 font-[Sarabun]"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span>เพิ่มงาน</span>
            </button>
          )}

          <button
            type="button"
            onClick={onRefresh}
            className="p-2.5 text-slate-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 rounded-xl transition-all"
            title="รีเฟรชข้อมูล"
            aria-label="รีเฟรชข้อมูล"
          >
            <span className="material-symbols-outlined text-[20px]">
              refresh
            </span>
          </button>

          <button
            type="button"
            onClick={onLogout}
            className="p-2 text-slate-600 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-all font-[Prompt] flex items-center justify-center"
            title="ออกจากระบบ"
          >
            <span className="material-symbols-outlined text-[20px]">
              logout
            </span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center pt-3 border-t border-slate-100 dark:border-zinc-800/80">
        {/* Search Input */}
        <label className="group flex-1 flex flex-row items-center gap-2 px-3.5 py-2 bg-slate-100/70 dark:bg-zinc-950/70 border border-slate-200 dark:border-zinc-800 rounded-xl focus-within:ring-2 focus-within:ring-indigo-500 transition-all cursor-text">
          <span className="material-symbols-outlined text-slate-400 dark:text-zinc-500 text-[20px] pointer-events-none flex-shrink-0">
            search
          </span>
          <input
            type="text"
            name="searchAssignment"
            placeholder="ค้นหาชื่องาน หรือคำอธิบาย..."
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

        {/* Status Filter Dropdown / Pill selector */}
        {user.role === "Student" && (
          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
            <span className="text-xs text-slate-400 dark:text-zinc-500 font-[Sarabun] whitespace-nowrap hidden lg:inline">
              สถานะ:
            </span>
            <select
              value={statusFilter}
              onChange={(e) =>
                onStatusFilterChange(e.target.value as AssignmentStatus | "")
              }
              className="w-full sm:w-auto px-3.5 py-2 bg-slate-100/70 dark:bg-zinc-950/70 border border-slate-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base font-[Prompt] text-slate-800 dark:text-zinc-100 cursor-pointer transition-all"
            >
              <option value="">ทั้งหมด</option>
              <option value={AssignmentStatus.Unchecked}>ยังไม่ส่ง</option>
              <option value={AssignmentStatus.Submitted}>ส่งแล้ว</option>
              <option value={AssignmentStatus.Urgent}>เร่งด่วน</option>
              <option value={AssignmentStatus.Overdue}>เกินกำหนด</option>
            </select>
          </div>
        )}
      </div>
    </header>
  );
}
