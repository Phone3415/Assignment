import { JSX, useState } from "react";
import { useModal } from "../../Contexts/Modal.context";
import { useUsers } from "../../Hooks/User.hook";
import ModalFormLayout from "../common/ModalForm.component";

interface DeleteUserModalProps {
  id: number;
  name: string;
  studentId: string;
  onSuccess: () => void;
}

export default function DeleteUserModal({
  id,
  name,
  studentId,
  onSuccess,
}: DeleteUserModalProps): JSX.Element {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { deleteUser } = useUsers();
  const { hideModal } = useModal();

  const handleDelete = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    const res = await deleteUser(id);

    setIsLoading(false);

    if (!res.success) {
      setError(res.error || "เกิดข้อผิดพลาดในการลบผู้ใช้งาน");
      return;
    }

    onSuccess();
    hideModal();
  };

  return (
    <ModalFormLayout
      title="ลบผู้ใช้งาน"
      error={error}
      isLoading={isLoading}
      submitText="ลบ"
      onSubmit={handleDelete}
      onCancel={hideModal}
      submitVariant="danger"
    >
      <div className="flex flex-col gap-2">
        <p className="text-slate-700 dark:text-zinc-300 font-[Sarabun]">
          คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้งาน:
        </p>
        <p className="font-bold text-slate-800 dark:text-zinc-100 font-[Prompt]">
          {name} ({studentId})
        </p>
        <p className="text-sm text-rose-500 dark:text-rose-400 font-[Sarabun] mt-2">
          * การกระทำนี้ไม่สามารถย้อนกลับได้
        </p>
      </div>
    </ModalFormLayout>
  );
}
