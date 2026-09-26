import { JSX, useState } from "react";
import { useModal } from "../../Contexts/Modal.context";
import { useAssignments } from "../../Hooks/Assignment.hook";
import { AssignmentData, AssignmentType } from "../../Types/assignment.type";
import ModalFormLayout from "../common/ModalForm.component";

interface EditAssignmentModalProps {
  assignment: AssignmentData;
  onSuccess: () => void;
}

const formatDateForInput = (dateString?: string | null): string => {
  if (!dateString) return "";
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "";
    const pad = (n: number) => n.toString().padStart(2, "0");
    const year = d.getFullYear();
    const month = pad(d.getMonth() + 1);
    const day = pad(d.getDate());
    const hours = pad(d.getHours());
    const minutes = pad(d.getMinutes());
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  } catch {
    return "";
  }
};

export default function EditAssignmentModal({
  assignment,
  onSuccess,
}: EditAssignmentModalProps): JSX.Element {
  const [name, setName] = useState<string>(assignment.name);
  const [description, setDescription] = useState<string>(assignment.description);
  const [type, setType] = useState<AssignmentType>(assignment.type);
  const [groupSize, setGroupSize] = useState<number>(assignment.groupSize || 2);
  const [assignedDate, setAssignedDate] = useState<string>(() =>
    formatDateForInput(assignment.assignedDate)
  );
  const [deadline, setDeadline] = useState<string>(() =>
    formatDateForInput(assignment.deadline)
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { editAssignment } = useAssignments(assignment.classId);
  const { hideModal } = useModal();

  const handleSave = async (): Promise<void> => {
    if (!name.trim()) {
      setError("กรุณากรอกชื่องาน");
      return;
    }
    if (!description.trim() || description.trim().length < 10) {
      setError("รายละเอียดงานต้องมีความยาวอย่างน้อย 10 ตัวอักษร");
      return;
    }
    if (!assignedDate) {
      setError("กรุณาระบุวันที่มอบหมาย");
      return;
    }
    if (type === AssignmentType.Group && (!groupSize || groupSize < 2)) {
      setError("จำนวนสมาชิกในกลุ่มต้องมีอย่างน้อย 2 คน");
      return;
    }

    setIsLoading(true);
    setError(null);

    const payload = {
      name: name.trim(),
      description: description.trim(),
      assignedDate: new Date(assignedDate).toISOString(),
      deadline: deadline ? new Date(deadline).toISOString() : undefined,
      type,
      groupSize: type === AssignmentType.Group ? Number(groupSize) : 1,
    };

    const res = await editAssignment(assignment.id, payload);

    setIsLoading(false);

    if (!res.success) {
      setError(res.error || "เกิดข้อผิดพลาดในการแก้ไขงาน");
      return;
    }

    onSuccess();
    hideModal();
  };

  return (
    <ModalFormLayout
      title="แก้ไขงาน"
      error={error}
      isLoading={isLoading}
      submitText="บันทึกการแก้ไข"
      onSubmit={handleSave}
      onCancel={hideModal}
    >
      <div className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto p-1 -m-1">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-700 dark:text-zinc-300">
            ชื่องาน <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading}
            className="p-3 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-800 dark:text-zinc-100 font-[Sarabun] text-sm"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-700 dark:text-zinc-300">
            รายละเอียดงาน <span className="text-red-500">* (อย่างน้อย 10 ตัวอักษร)</span>
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isLoading}
            className="p-3 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-800 dark:text-zinc-100 font-[Sarabun] text-sm resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700 dark:text-zinc-300">
              ประเภทงาน
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as AssignmentType)}
              disabled={isLoading}
              className="p-3 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-800 dark:text-zinc-100 font-[Sarabun] text-sm cursor-pointer"
            >
              <option value={AssignmentType.Solo}>งานเดี่ยว</option>
              <option value={AssignmentType.Group}>งานกลุ่ม</option>
              <option value={AssignmentType.Major}>งานคณะ</option>
            </select>
          </div>

          {type === AssignmentType.Group && (
            <div className="flex flex-col gap-1.5 animate-in fade-in">
              <label className="text-sm font-semibold text-slate-700 dark:text-zinc-300">
                จำนวนสมาชิกในกลุ่ม
              </label>
              <input
                type="number"
                min={2}
                max={50}
                value={groupSize}
                onChange={(e) => setGroupSize(Math.max(2, parseInt(e.target.value) || 2))}
                disabled={isLoading}
                className="p-3 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-800 dark:text-zinc-100 font-[Sarabun] text-sm"
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700 dark:text-zinc-300">
              วันที่มอบหมาย <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              value={assignedDate}
              onChange={(e) => setAssignedDate(e.target.value)}
              disabled={isLoading}
              className="p-3 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-800 dark:text-zinc-100 font-[Sarabun] text-sm"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700 dark:text-zinc-300">
              กำหนดส่ง (Deadline)
            </label>
            <input
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              disabled={isLoading}
              className="p-3 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-800 dark:text-zinc-100 font-[Sarabun] text-sm"
            />
          </div>
        </div>
      </div>
    </ModalFormLayout>
  );
}
