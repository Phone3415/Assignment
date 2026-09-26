import { JSX, useState } from "react";
import { useModal } from "../../Contexts/Modal.context";
import { useAssignments } from "../../Hooks/Assignment.hook";
import ModalFormLayout from "../common/ModalForm.component";

interface DeleteAssignmentModalProps {
  id: number;
  name: string;
  classId: number;
  onSuccess: () => void;
}

export default function DeleteAssignmentModal({
  id,
  name,
  classId,
  onSuccess,
}: DeleteAssignmentModalProps): JSX.Element {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { deleteAssignment } = useAssignments(classId);
  const { hideModal } = useModal();

  const handleDelete = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    const res = await deleteAssignment(id);

    setIsLoading(false);

    if (!res.success) {
      setError(res.error || "เกิดข้อผิดพลาดในการลบงาน");
      return;
    }

    onSuccess();
    hideModal();
  };

  const titleNode = (
    <div className="flex items-center gap-3">
      <div className="p-2 bg-red-100 dark:bg-red-500/20 text-red-600 rounded-full flex items-center justify-center">
        <span className="material-symbols-outlined">warning</span>
      </div>
      <h2 className="text-xl font-bold text-red-600 font-[Prompt]">ลบงาน</h2>
    </div>
  );

  return (
    <ModalFormLayout
      title={titleNode}
      error={error}
      isLoading={isLoading}
      submitText="ลบงาน"
      submitVariant="danger"
      onSubmit={handleDelete}
      onCancel={hideModal}
    >
      <div className="flex flex-col gap-2 font-[Sarabun]">
        <p className="text-slate-600 dark:text-zinc-400">
          คุณแน่ใจหรือไม่ว่าต้องการลบงาน{" "}
          <span className="font-bold text-slate-900 dark:text-zinc-100">
            {name}
          </span>
        </p>
        <p className="text-red-500 text-sm font-semibold">
          การกระทำนี้ไม่สามารถยกเลิกได้ และข้อมูลการส่งงานของนักศึกษาจะถูกลบทั้งหมด
        </p>
      </div>
    </ModalFormLayout>
  );
}
