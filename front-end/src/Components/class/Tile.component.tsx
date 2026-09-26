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
      <div className="h-full min-h-[200px] flex flex-col justify-between bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800/80 p-6 rounded-2xl shadow-[0_2px_12px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgb(0,0,0,0.06)] dark:shadow-[0_2px_12px_rgb(0,0,0,0.2)] dark:hover:shadow-[0_8px_24px_rgb(0,0,0,0.4)] hover:border-blue-400/60 dark:hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-1.5 relative overflow-hidden backdrop-blur-sm group/card">
        {/* Subtle accent corner glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-transparent rounded-bl-full pointer-events-none group-hover/card:scale-125 transition-transform duration-700 ease-out" />

        <div className="flex flex-col gap-4 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-100/50 dark:border-blue-900/30 shadow-xs">
            <span className="material-symbols-outlined text-[22px]">
              menu_book
            </span>
          </div>

          <h3 className="font-bold text-lg text-slate-800 dark:text-zinc-100 font-[Prompt] leading-snug group-hover/card:text-blue-600 dark:group-hover/card:text-blue-400 transition-colors line-clamp-2 pr-4">
            {name}
          </h3>
        </div>

        <div className="flex items-center justify-between mt-8 pt-4 border-t border-slate-100 dark:border-zinc-800/80 relative z-10">
          <span className="text-[11px] font-medium text-slate-400 dark:text-zinc-500 font-[Prompt] bg-slate-100 dark:bg-zinc-800 px-2.5 py-1 rounded-lg">
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
                title="แก้ไข"
                className="p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:hover:bg-indigo-500/20 dark:text-indigo-400 rounded-xl transition-colors active:scale-95 flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-[18px]">
                  edit
                </span>
              </button>
              <button
                type="button"
                onClick={handleDelete}
                aria-label={`ลบ ${name}`}
                title="ลบ"
                className="p-2 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-500/10 dark:hover:bg-red-500/20 dark:text-red-400 rounded-xl transition-colors active:scale-95 flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-[18px]">
                  delete
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
