import { JSX } from "react";
import { useModal } from "../../Contexts/Modal.context";
import { User } from "../../Types/auth.type";
import DeleteUserModal from "./DeleteModal.component";
import EditUserModal from "./EditModal.component";

interface UserTableProps {
  users: User[];
  isLoading: boolean;
  onRefresh: () => void;
}

export default function UserTable({
  users,
  isLoading,
  onRefresh,
}: UserTableProps): JSX.Element {
  const { showModal } = useModal();

  const handleEdit = (user: User): void => {
    showModal(<EditUserModal user={user} onSuccess={onRefresh} />);
  };

  const handleDelete = (user: User): void => {
    showModal(
      <DeleteUserModal
        id={user.id}
        name={user.name}
        studentId={user.studentId}
        onSuccess={onRefresh}
      />
    );
  };

  if (isLoading && users.length === 0) {
    return (
      <div className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
        {[1, 2, 3, 4, 5].map((n) => (
          <div
            key={n}
            className="h-16 w-full rounded-xl bg-slate-100 dark:bg-zinc-800/60 animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="w-full bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800/80 rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-separate border-spacing-y-2">
          <thead>
            <tr className="bg-slate-50/70 dark:bg-zinc-950/40 text-xs font-[Prompt] text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
              <th className="py-4 px-4 pl-6 w-[70%] min-w-[200px]">
                ชื่อ-นามสกุล / รหัสนักศึกษา
              </th>
              <th className="py-4 px-4 w-[15%] hidden sm:table-cell whitespace-nowrap">
                สิทธิ์การใช้งาน
              </th>
              <th className="py-4 px-4 text-center sm:px-6 w-[15%] whitespace-nowrap">
                การจัดการ
              </th>
            </tr>
          </thead>
          <tbody className="text-base font-[Sarabun]">
            {users.length === 0 ? (
              <tr>
                <td colSpan={3} className="py-12 text-center text-slate-500 dark:text-zinc-400">
                  ไม่พบข้อมูลผู้ใช้งาน
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user.id}
                  className="bg-white dark:bg-zinc-900 shadow-sm border border-slate-100 dark:border-zinc-800 hover:bg-slate-50/80 dark:hover:bg-zinc-800/40 transition-colors group rounded-xl overflow-hidden"
                >
                  <td className="py-4 px-4 pl-6 align-top">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-800 dark:text-zinc-100 font-[Prompt] text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {user.name}
                        </span>
                        {/* Mobile Role Badge */}
                        <div className="sm:hidden">
                          {user.role === "Admin" ? (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-800/50 font-[Prompt]">
                              <span className="material-symbols-outlined text-[12px]">shield_person</span>
                              Admin
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800/50 font-[Prompt]">
                              <span className="material-symbols-outlined text-[12px]">school</span>
                              Student
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-zinc-400 font-[Sarabun]">
                        <span className="material-symbols-outlined text-[16px]">
                          badge
                        </span>
                        <span>{user.studentId}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4 align-top hidden sm:table-cell">
                    <div className="flex items-center h-full pt-1">
                      {user.role === "Admin" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-800/50 font-[Prompt]">
                          <span className="material-symbols-outlined text-[14px]">
                            shield_person
                          </span>
                          Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800/50 font-[Prompt]">
                          <span className="material-symbols-outlined text-[14px]">
                            school
                          </span>
                          Student
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-4 px-4 sm:px-6 align-top text-right">
                    <div className="flex items-center justify-center gap-1.5 flex-wrap h-full pt-1">
                      <button
                        type="button"
                        onClick={() => handleEdit(user)}
                        className="p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:hover:bg-indigo-500/20 dark:text-indigo-400 rounded-xl transition-colors active:scale-95 flex items-center justify-center"
                        title="แก้ไขข้อมูล"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          edit
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(user)}
                        className="p-2 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-500/10 dark:hover:bg-red-500/20 dark:text-red-400 rounded-xl transition-colors active:scale-95 flex items-center justify-center"
                        title="ลบผู้ใช้งาน"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          delete
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
