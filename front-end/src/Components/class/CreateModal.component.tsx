import { JSX, useState } from "react";
import { useModal } from "../../Contexts/Modal.context";
import useApiFetch from "../../Hooks/Api.hook";

interface CreateClassModalProps {
  onSuccess: () => void;
}

export default function CreateClassModal({
  onSuccess,
}: CreateClassModalProps): JSX.Element {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiFetch = useApiFetch();
  const { hideModal } = useModal();

  const handleSave = async () => {
    if (!name.trim()) {
      setError("กรุณากรอกชื่อวิชา");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const res = await apiFetch(`/api/classes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Failed to create class");
      }

      onSuccess();
      hideModal();
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการสร้างวิชา";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-5 font-[Sarabun]">
      <h2 className="text-xl font-bold font-[Prompt]">เพิ่มวิชาเรียน</h2>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 dark:bg-red-500/10 p-3 rounded-lg border border-red-100 dark:border-red-500/20">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-2">
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

      <div className="flex justify-end gap-3 mt-2">
        <button
          onClick={hideModal}
          disabled={isLoading}
          className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 dark:text-zinc-400 dark:hover:bg-zinc-800 rounded-xl font-semibold transition-colors font-[Prompt]"
        >
          ยกเลิก
        </button>
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all shadow-sm active:scale-95 disabled:opacity-50 font-[Prompt]"
        >
          {isLoading ? "กำลังเพิ่ม..." : "เพิ่มวิชา"}
        </button>
      </div>
    </div>
  );
}
