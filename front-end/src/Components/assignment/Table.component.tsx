import { JSX, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../Contexts/Modal.context";
import { UserRole } from "../../Types";
import {
  AssignmentData,
  AssignmentStatus,
  AssignmentType,
} from "../../Types/assignment.type";
import DeleteAssignmentModal from "./DeleteModal.component";
import EditAssignmentModal from "./EditModal.component";
import NotesModal from "./NotesModal.component";

interface AssignmentTableProps {
  assignments: AssignmentData[];
  userRole: UserRole;
  classId: number;
  isLoading: boolean;
  onRefresh: () => void;
  onSubmit: (id: number) => Promise<{ success: boolean; error?: string }>;
  onUnsubmit: (id: number) => Promise<{ success: boolean; error?: string }>;
}

const formatThaiDate = (dateString?: string | null): string => {
  if (!dateString) return "-";
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "-";
    return d.toLocaleDateString("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateString;
  }
};

const getDeadlineTimeLeft = (deadlineStr?: string | null): string | null => {
  if (!deadlineStr) return null;
  const deadline = new Date(deadlineStr).getTime();
  const diff = deadline - Date.now();
  if (diff < 0) {
    const hours = Math.floor(Math.abs(diff) / (1000 * 60 * 60));
    if (hours < 24) return `เลยกำหนด ${hours} ชม.`;
    const days = Math.floor(hours / 24);
    return `เลยกำหนด ${days} วัน`;
  }
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 24) return `เหลืออีก ${hours} ชม.`;
  const days = Math.floor(hours / 24);
  return `เหลืออีก ${days} วัน`;
};

const getAssignmentStatusInfo = (
  assignment: AssignmentData,
): {
  status: AssignmentStatus;
  label: string;
  borderColor: string;
  badgeClass: string;
  dotColor: string;
} => {
  const isSubmitted = !!(
    assignment.assignmentChecklists &&
    assignment.assignmentChecklists.length > 0
  );

  if (isSubmitted) {
    return {
      status: AssignmentStatus.Submitted,
      label: "ส่งแล้ว",
      borderColor: "border-l-emerald-500 dark:border-l-emerald-400",
      badgeClass:
        "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60",
      dotColor: "bg-emerald-500",
    };
  }

  if (assignment.deadline) {
    const deadlineTime = new Date(assignment.deadline).getTime();
    const nowTime = Date.now();
    const threeDaysMs = 3 * 24 * 60 * 60 * 1000;

    if (deadlineTime <= nowTime) {
      return {
        status: AssignmentStatus.Overdue,
        label: "เกินกำหนด",
        borderColor: "border-l-rose-500 dark:border-l-rose-400",
        badgeClass:
          "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60",
        dotColor: "bg-rose-500",
      };
    }

    if (deadlineTime - nowTime <= threeDaysMs) {
      return {
        status: AssignmentStatus.Urgent,
        label: "ด่วน",
        borderColor: "border-l-amber-500 dark:border-l-amber-400",
        badgeClass:
          "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60",
        dotColor: "bg-amber-500",
      };
    }
  }

  return {
    status: AssignmentStatus.Unchecked,
    label: "ยังไม่ส่ง",
    borderColor: "border-l-sky-500 dark:border-l-sky-400",
    badgeClass:
      "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800/60",
    dotColor: "bg-sky-500",
  };
};

export default function AssignmentTable({
  assignments,
  userRole,
  classId,
  isLoading,
  onRefresh,
  onSubmit,
  onUnsubmit,
}: AssignmentTableProps): JSX.Element {
  const navigate = useNavigate();
  const { showModal } = useModal();
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

  const handleEdit = (assignment: AssignmentData): void => {
    showModal(
      <EditAssignmentModal assignment={assignment} onSuccess={onRefresh} />,
      { maxWidth: "max-w-2xl" },
    );
  };

  const handleDelete = (assignment: AssignmentData): void => {
    showModal(
      <DeleteAssignmentModal
        id={assignment.id}
        name={assignment.name}
        classId={classId}
        onSuccess={onRefresh}
      />,
    );
  };

  const handleViewNotes = (
    assignment: AssignmentData,
    type: "public" | "private",
  ): void => {
    if (type === "private") {
      navigate(`/assignments/${assignment.id}/private-note`);
    } else {
      navigate(`/assignments/${assignment.id}/public-notes`);
    }
  };

  const handleToggleSubmit = async (
    assignment: AssignmentData,
  ): Promise<void> => {
    const isSubmitted = !!(
      assignment.assignmentChecklists &&
      assignment.assignmentChecklists.length > 0
    );

    setActionLoadingId(assignment.id);

    if (isSubmitted) {
      await onUnsubmit(assignment.id);
    } else {
      await onSubmit(assignment.id);
    }

    setActionLoadingId(null);
    onRefresh();
  };

  if (isLoading && assignments.length === 0) {
    return (
      <div className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
        {[1, 2, 3, 4].map((n) => (
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
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/70 dark:bg-zinc-950/40 text-xs font-[Prompt] text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
              <th className="py-4 px-4 pl-6 w-[60%] min-w-[240px]">
                ชื่องานและรายละเอียด
              </th>
              <th className="py-4 px-4 text-center hidden lg:table-cell w-[15%] whitespace-nowrap">
                วันที่มอบหมาย
              </th>
              <th className="py-4 px-4 text-center hidden md:table-cell w-[15%] whitespace-nowrap">
                กำหนดส่ง
              </th>
              <th className="py-4 px-4 text-center sm:px-6 w-[10%] whitespace-nowrap">
                การจัดการ
              </th>
            </tr>
          </thead>
          <tbody className="text-base font-[Sarabun]">
            {assignments.map((assignment) => {
              const statusInfo = getAssignmentStatusInfo(assignment);
              const isSubmitted =
                statusInfo.status === AssignmentStatus.Submitted;
              const isOverdue = statusInfo.status === AssignmentStatus.Overdue;
              const timeLeft = getDeadlineTimeLeft(assignment.deadline);
              const isRowActionLoading = actionLoadingId === assignment.id;

              return (
                <tr key={assignment.id} className="group">
                  <td
                    className={`bg-white dark:bg-zinc-900 border-y border-slate-100 dark:border-zinc-800 group-hover:bg-slate-50/80 dark:group-hover:bg-zinc-800/40 transition-colors py-4 px-4 pl-6 align-top ${
                      userRole === "Student"
                        ? `border-l-[6px] ${statusInfo.borderColor}`
                        : "border-l border-slate-100 dark:border-zinc-800"
                    }`}
                  >
                    <div className="flex flex-col gap-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-slate-800 dark:text-zinc-100 font-[Prompt] text-lg group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {assignment.name}
                        </span>

                        {/* Status Badge */}
                        {userRole === "Student" && (
                          <span
                            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium border ${statusInfo.badgeClass} font-[Prompt]`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${statusInfo.dotColor}`}
                            />
                            {statusInfo.label}
                          </span>
                        )}

                        {/* Type badge */}
                        {assignment.type === AssignmentType.Group && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-950/30 dark:text-purple-300 dark:border-purple-800/50">
                            <span className="material-symbols-outlined text-[13px]">
                              groups
                            </span>
                            กลุ่ม ({assignment.groupSize || 2} คน)
                          </span>
                        )}
                        {assignment.type === AssignmentType.Major && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950/30 dark:text-indigo-300 dark:border-indigo-800/50">
                            <span className="material-symbols-outlined text-[13px]">
                              star
                            </span>
                            งานคณะ
                          </span>
                        )}
                      </div>

                      <p className="text-slate-700 dark:text-zinc-300 text-sm sm:text-base line-clamp-2 leading-relaxed">
                        {assignment.description}
                      </p>

                      {/* Mobile/Tablet Dates Display */}
                      <div className="flex flex-wrap items-center gap-2 pt-2">
                        {/* Assigned Date (Hidden on lg and up) */}
                        <div className="lg:hidden flex items-center gap-1.5 text-xs sm:text-sm text-slate-500 dark:text-zinc-400 bg-slate-100/80 dark:bg-zinc-800/50 border border-slate-200/60 dark:border-zinc-700/50 px-2.5 py-1 rounded-lg">
                          <span className="material-symbols-outlined text-[14px] sm:text-[16px]">
                            calendar_today
                          </span>
                          <span>
                            มอบหมาย: {formatThaiDate(assignment.assignedDate)}
                          </span>
                        </div>

                        {/* Deadline (Hidden on md and up) */}
                        <div className="md:hidden flex flex-wrap items-center gap-1.5 text-xs text-slate-500 dark:text-zinc-400 bg-slate-100/80 dark:bg-zinc-800/50 border border-slate-200/60 dark:border-zinc-700/50 px-2.5 py-1 rounded-lg">
                          <span className="material-symbols-outlined text-[14px]">
                            event
                          </span>
                          <span
                            className={
                              isOverdue
                                ? "text-rose-600 dark:text-rose-400 font-semibold"
                                : ""
                            }
                          >
                            กำหนดส่ง: {formatThaiDate(assignment.deadline)}
                          </span>
                          {timeLeft && (
                            <span
                              className={`ml-0.5 font-semibold ${
                                isOverdue
                                  ? "text-rose-600 dark:text-rose-400"
                                  : "text-amber-600 dark:text-amber-400"
                              }`}
                            >
                              ({timeLeft})
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Assigned Date Column */}
                  <td className="bg-white dark:bg-zinc-900 border-y border-slate-100 dark:border-zinc-800 group-hover:bg-slate-50/80 dark:group-hover:bg-zinc-800/40 transition-colors py-4 px-4 text-center hidden lg:table-cell align-top text-sm text-slate-600 dark:text-zinc-400">
                    <div className="flex items-center justify-center gap-1.5 whitespace-nowrap">
                      <span className="material-symbols-outlined text-[16px] text-slate-400 dark:text-zinc-500">
                        calendar_today
                      </span>
                      <span>{formatThaiDate(assignment.assignedDate)}</span>
                    </div>
                  </td>

                  {/* Deadline Column */}
                  <td className="bg-white dark:bg-zinc-900 border-y border-slate-100 dark:border-zinc-800 group-hover:bg-slate-50/80 dark:group-hover:bg-zinc-800/40 transition-colors py-4 px-4 text-center hidden md:table-cell align-top text-sm">
                    <div className="flex flex-col items-center justify-center gap-1.5 text-slate-600 dark:text-zinc-300 font-medium whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-slate-400 dark:text-zinc-500">
                          event
                        </span>
                        <span
                          className={
                            isOverdue ? "text-rose-600 dark:text-rose-400" : ""
                          }
                        >
                          {formatThaiDate(assignment.deadline)}
                        </span>
                      </div>
                      {timeLeft && (
                        <div className="flex items-center justify-center">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold font-[Prompt] border ${
                              isOverdue
                                ? "bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950/30 dark:border-rose-800/50 dark:text-rose-400"
                                : "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800/50 dark:text-amber-400"
                            }`}
                          >
                            {timeLeft}
                          </span>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Actions Column */}
                  <td className="bg-white dark:bg-zinc-900 border-y border-r border-slate-100 dark:border-zinc-800 group-hover:bg-slate-50/80 dark:group-hover:bg-zinc-800/40 transition-colors py-4 px-4 sm:px-6 align-top">
                    <div className="flex items-center justify-center gap-1.5 flex-wrap">
                      {/* Student Actions */}
                      {userRole === "Student" && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleToggleSubmit(assignment)}
                            disabled={isRowActionLoading}
                            className={`p-2 rounded-xl transition-all active:scale-95 shadow-sm disabled:opacity-50 flex items-center justify-center ${
                              isSubmitted
                                ? "bg-amber-50 hover:bg-amber-100 text-amber-600 dark:bg-amber-950/30 dark:hover:bg-amber-900/40 dark:text-amber-400"
                                : "bg-emerald-500 hover:bg-emerald-600 text-white dark:bg-emerald-600 dark:hover:bg-emerald-500"
                            }`}
                            title={
                              isSubmitted
                                ? "คลิกเพื่อยกเลิกการส่ง"
                                : "คลิกเพื่อส่งงาน"
                            }
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              {isSubmitted ? "undo" : "check_circle"}
                            </span>
                          </button>

                          {/* Student Public Notes Entry Point */}
                          <button
                            type="button"
                            onClick={() =>
                              handleViewNotes(assignment, "public")
                            }
                            className="p-2 bg-teal-50 hover:bg-teal-100 text-teal-600 dark:bg-teal-500/10 dark:hover:bg-teal-500/20 dark:text-teal-400 rounded-xl transition-colors flex items-center justify-center"
                            title="โน้ตสาธารณะ"
                            aria-label="โน้ตสาธารณะ"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              forum
                            </span>
                          </button>

                          {/* Student Private Notes Entry Point */}
                          <button
                            type="button"
                            onClick={() =>
                              handleViewNotes(assignment, "private")
                            }
                            className="p-2 bg-violet-50 hover:bg-violet-100 text-violet-600 dark:bg-violet-500/10 dark:hover:bg-violet-500/20 dark:text-violet-400 rounded-xl transition-colors flex items-center justify-center"
                            title="โน้ตส่วนตัว"
                            aria-label="โน้ตส่วนตัว"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              edit_note
                            </span>
                          </button>
                        </>
                      )}

                      {/* Admin Actions */}
                      {userRole === "Admin" && (
                        <>
                          {/* Admin Public Notes Entry Point */}
                          <button
                            type="button"
                            onClick={() =>
                              handleViewNotes(assignment, "public")
                            }
                            className="p-2 bg-teal-50 hover:bg-teal-100 text-teal-600 dark:bg-teal-500/10 dark:hover:bg-teal-500/20 dark:text-teal-400 rounded-xl transition-colors flex items-center justify-center"
                            title="โน้ตสาธารณะ"
                            aria-label="โน้ตสาธารณะ"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              forum
                            </span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleEdit(assignment)}
                            className="p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:hover:bg-indigo-500/20 dark:text-indigo-400 rounded-xl transition-colors active:scale-95 flex items-center justify-center"
                            title="แก้ไขงาน"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              edit
                            </span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(assignment)}
                            className="p-2 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-500/10 dark:hover:bg-red-500/20 dark:text-red-400 rounded-xl transition-colors active:scale-95 flex items-center justify-center"
                            title="ลบงาน"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              delete
                            </span>
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
