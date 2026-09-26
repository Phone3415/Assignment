import { JSX, useState } from "react";
import { useModal } from "../../Contexts/Modal.context";
import { useClasses } from "../../Hooks/Class.hook";
import ModalFormLayout from "../common/ModalForm.component";

interface CreateClassModalProps {
  onSuccess: () => void;
}

export default function CreateClassModal({
  onSuccess,
}: CreateClassModalProps): JSX.Element {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { createClass } = useClasses();
  const { hideModal } = useModal();

  const handleSave = async () => {
    if (!name.trim()) return setError("กรุณากรอกชื่อวิชา");

    setIsLoading(true);
    setError(null);

    const res = await createClass(name);

    setIsLoading(false);

    if (!res.success) {
      setError(res.error || "เกิดข้อผิดพลาดในการสร้างวิชา");
      return;
    }

    onSuccess();
    hideModal();
  };

  return (
    <ModalFormLayout
      title="เพิ่มวิชาเรียน"
      error={error}
      isLoading={isLoading}
      submitText="เพิ่มวิชา"
      onSubmit={handleSave}
      onCancel={hideModal}
    >
      <div className="flex flex-col gap-2 p-1">
        <label className="text-sm font-semibold text-slate-700 dark:text-zinc-300">
          ชื่อวิชา
        </label>
        <input
          type="text"
          value={name}
          placeholder="เช่น วิทยาศาสตร์พื้นฐาน"
          onChange={(e) => setName(e.target.value)}
          disabled={isLoading}
          className="p-3.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-800 dark:text-zinc-100"
        />
      </div>
    </ModalFormLayout>
  );
}
