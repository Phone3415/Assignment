import { JSX, useState } from "react";
import { useModal } from "../../Contexts/Modal.context";
import { useUsers } from "../../Hooks/User.hook";
import { UserRole } from "../../Types/auth.type";
import ModalFormLayout from "../common/ModalForm.component";

interface CreateUserModalProps {
  onSuccess: () => void;
}

export default function CreateUserModal({
  onSuccess,
}: CreateUserModalProps): JSX.Element {
  const [studentId, setStudentId] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [role, setRole] = useState<UserRole>("Student");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { createUser } = useUsers();
  const { hideModal } = useModal();

  const handleSave = async (): Promise<void> => {
    if (!studentId.trim()) {
      setError("กรุณากรอกรหัสนักศึกษา");
      return;
    }
    if (!name.trim()) {
      setError("กรุณากรอกชื่อ-นามสกุล");
      return;
    }

    setIsLoading(true);
    setError(null);

    const payload = {
      studentId: studentId.trim(),
      name: name.trim(),
      role,
    };

    const res = await createUser(payload);

    setIsLoading(false);

    if (!res.success) {
      setError(res.error || "เกิดข้อผิดพลาดในการเพิ่มผู้ใช้งาน");
      return;
    }

    onSuccess();
    hideModal();
  };

  return (
    <ModalFormLayout
      title="เพิ่มผู้ใช้งานใหม่"
      error={error}
      isLoading={isLoading}
      submitText="เพิ่ม"
      onSubmit={handleSave}
      onCancel={hideModal}
    >
      <div className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto p-1 -m-1">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-700 dark:text-zinc-300">
            รหัสนักศึกษา <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={studentId}
            placeholder="เช่น 64010001"
            onChange={(e) => setStudentId(e.target.value)}
            disabled={isLoading}
            className="p-3 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-800 dark:text-zinc-100 font-[Sarabun] text-sm"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-700 dark:text-zinc-300">
            ชื่อ-นามสกุล <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            placeholder="เช่น สมชาย ใจดี"
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading}
            className="p-3 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-800 dark:text-zinc-100 font-[Sarabun] text-sm"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-700 dark:text-zinc-300">
            สิทธิ์การใช้งาน
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
            disabled={isLoading}
            className="p-3 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-800 dark:text-zinc-100 font-[Sarabun] text-sm cursor-pointer"
          >
            <option value="Student">นักศึกษา</option>
            <option value="Admin">ผู้ดูแลระบบ</option>
          </select>
        </div>
      </div>
    </ModalFormLayout>
  );
}
