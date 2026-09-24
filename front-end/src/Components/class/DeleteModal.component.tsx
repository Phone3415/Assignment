import { JSX, useState } from "react";
import { useModal } from "../../Contexts/Modal.context";
import useApiFetch from "../../Hooks/Api.hook";

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

  const apiFetch = useApiFetch();
  const { hideModal } = useModal();

  const handleDelete = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiFetch(`/api/classes/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete class");
      }

      onSuccess();
      hideModal();
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการลบวิชา";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }

  };

  return (
    <div className="flex flex-col gap-5 font-[Sarabun]">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-red-100 dark:bg-red-500/20 text-red-600 rounded-full">
          <span className="material-symbols-outlined">warning</span>
        </div>
        <h2 className="text-xl font-bold text-red-600 font-[Prompt]">
          ลบวิชาเรียน
        </h2>
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 dark:bg-red-500/10 p-3 rounded-lg border border-red-100 dark:border-red-500/20">
          {error}
        </p>
      )}

      <p className="text-slate-600 dark:text-zinc-400">
        คุณแน่ใจหรือไม่ว่าต้องการลบวิชา{" "}
        <span className="font-bold text-slate-900 dark:text-zinc-100">
          {name}
        </span>
      </p>
      <p className="text-red-500 font-bold">
        การกระทำนี้ไม่สามารถยกเลิกได้ และข้อมูลที่เกี่ยวข้องทั้งหมดจะถูกลบ
      </p>

      <div className="flex justify-end gap-3 mt-2">
        <button
          onClick={hideModal}
          disabled={isLoading}
          className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 dark:text-zinc-400 dark:hover:bg-zinc-800 rounded-xl font-semibold transition-colors font-[Prompt]"
        >
          ยกเลิก
        </button>
        <button
          onClick={handleDelete}
          disabled={isLoading}
          className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-all shadow-sm active:scale-95 disabled:opacity-50 font-[Prompt]"
        >
          {isLoading ? "กำลังลบ..." : "ลบวิชา"}
        </button>
      </div>
    </div>
  );
}
