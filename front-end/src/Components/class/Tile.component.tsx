import { JSX } from "react";
import { Link } from "react-router-dom";
import { useModal } from "../../Contexts/Modal.context";
import { UserRole } from "../../Types";
import DeleteClassModal from "./DeleteModal.component";
import EditClassModal from "./EditModal.component";

export interface ClassTileProps {
  order: number;
  id: number;
  name: string;
  userRole: UserRole;
  onUpdated?: () => void;
}

export default function ClassTile({
  name,
  id,
  userRole,
  order,
  onUpdated,
}: ClassTileProps): JSX.Element {
  const { showModal } = useModal();

  const handleEdit = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    showModal(
      <EditClassModal
        id={id}
        currentName={name}
        onSuccess={() => onUpdated?.()}
      />,
    );
  };

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    showModal(
      <DeleteClassModal id={id} name={name} onSuccess={() => onUpdated?.()} />,
    );
  };

  return (
    <Link to={`/classes/${id}`} className="block h-full group">
      <div className="h-full flex flex-col justify-between bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800/80 p-5 rounded-2xl shadow-sm hover:shadow-lg hover:border-blue-400 dark:hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden backdrop-blur-sm">
        {/* Subtle accent corner glow */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-indigo-500/0 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-500" />

        <div className="flex flex-col gap-3 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-100 dark:border-blue-900/40 shadow-xs">
            <span className="material-symbols-outlined text-[22px]">
              menu_book
            </span>
          </div>

          <h3 className="font-bold text-lg text-slate-800 dark:text-zinc-100 font-[Prompt] leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
            {name}
          </h3>
        </div>

        <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100 dark:border-zinc-800/80 relative z-10">
          <span className="text-xs text-slate-400 dark:text-zinc-500 font-[Sarabun]">
            #{order}
          </span>

          {userRole === "Admin" && (
            <div
              className="flex items-center gap-1.5"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={handleEdit}
                aria-label={`แก้ไข ${name}`}
                className="inline-flex items-center gap-1 text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:hover:bg-indigo-500/20 dark:text-indigo-400 rounded-lg px-2.5 py-1.5 transition-colors active:scale-95"
              >
                <span className="material-symbols-outlined text-[14px]">
                  edit
                </span>
                <span>แก้ไข</span>
              </button>
              <button
                type="button"
                onClick={handleDelete}
                aria-label={`ลบ ${name}`}
                className="inline-flex items-center gap-1 text-xs font-semibold bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-500/10 dark:hover:bg-red-500/20 dark:text-red-400 rounded-lg px-2.5 py-1.5 transition-colors active:scale-95"
              >
                <span className="material-symbols-outlined text-[14px]">
                  delete
                </span>
                <span>ลบ</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
