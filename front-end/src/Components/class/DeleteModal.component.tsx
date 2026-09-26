import { JSX, useState } from "react";
import { useModal } from "../../Contexts/Modal.context";
import { useClasses } from "../../Hooks/Class.hook";
import ModalFormLayout from "../common/ModalForm.component";

interface DeleteClassModalProps {
  id: number;
  name: string;
  onSuccess: () => void;
}

export default function DeleteClassModal({
  id,
  name,
  onSuccess,
}: DeleteClassModalProps): JSX.Element {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { deleteClass } = useClasses();
  const { hideModal } = useModal();

  const handleDelete = async () => {
    setIsLoading(true);
    setError(null);

    const res = await deleteClass(id);

    setIsLoading(false);

    if (!res.success) {
      setError(res.error || "เกิดข้อผิดพลาดในการลบวิชา");
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
      <h2 className="text-xl font-bold text-red-600 font-[Prompt]">
        ลบวิชาเรียน
      </h2>
    </div>
  );

  return (
    <ModalFormLayout
      title={titleNode}
      error={error}
      isLoading={isLoading}
      submitText="ลบวิชา"
      submitVariant="danger"
      onSubmit={handleDelete}
      onCancel={hideModal}
    >
      <p className="text-slate-600 dark:text-zinc-400">
        คุณแน่ใจหรือไม่ว่าต้องการลบวิชา{" "}
        <span className="font-bold text-slate-900 dark:text-zinc-100">
          {name}
        </span>
      </p>
      <p className="text-red-500 font-bold">
        การกระทำนี้ไม่สามารถยกเลิกได้ และข้อมูลที่เกี่ยวข้องทั้งหมดจะถูกลบ
      </p>
    </ModalFormLayout>
  );
}
