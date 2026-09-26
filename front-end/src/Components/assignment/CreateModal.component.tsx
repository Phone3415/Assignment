import { JSX, useState } from "react";
import { useModal } from "../../Contexts/Modal.context";
import { useAssignments } from "../../Hooks/Assignment.hook";
import { AssignmentType } from "../../Types/assignment.type";
import ModalFormLayout from "../common/ModalForm.component";

interface CreateAssignmentModalProps {
  classId: number;
  onSuccess: () => void;
}

export default function CreateAssignmentModal({
  classId,
  onSuccess,
}: CreateAssignmentModalProps): JSX.Element {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [type, setType] = useState<AssignmentType>(AssignmentType.Solo);
  const [groupSize, setGroupSize] = useState<number>(2);
  const [assignedDate, setAssignedDate] = useState<string>(
    () => new Date().toISOString().slice(0, 16)
  );
  const [deadline, setDeadline] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { createAssignment } = useAssignments(classId);
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
      ...(deadline ? { deadline: new Date(deadline).toISOString() } : {}),
      type,
      ...(type === AssignmentType.Group ? { groupSize: Number(groupSize) } : { groupSize: 1 }),
    };

    const res = await createAssignment(payload);

    setIsLoading(false);

    if (!res.success) {
      setError(res.error || "เกิดข้อผิดพลาดในการสร้างงาน");
      return;
    }

    onSuccess();
    hideModal();
  };

  return (
    <ModalFormLayout
      title="เพิ่มงานใหม่"
      error={error}
      isLoading={isLoading}
      submitText="สร้างงาน"
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
            placeholder="เช่น รายงานความปลอดภัยในโรงงาน"
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
            placeholder="อธิบายรายละเอียด คำสั่ง หรือข้อกำหนดของงาน..."
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
