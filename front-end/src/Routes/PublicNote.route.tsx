import { JSX, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ModalFormLayout from "../Components/common/ModalForm.component";
import { useJWT } from "../Contexts/JWT.context";
import { useModal } from "../Contexts/Modal.context";
import { usePublicNotes } from "../Hooks/PublicNote.hook";
export default function PublicNoteRoute(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const assignmentId = id ? parseInt(id, 10) : 0;
  const { user } = useJWT();
  const { showModal, hideModal } = useModal();

  const {
    notes,
    isLoading,
    isPosting,
    error,
    nextCursor,
    getNotes,
    postNote,
    deleteNote,
    editNote,
  } = usePublicNotes(assignmentId);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (assignmentId) {
      getNotes();
    }
  }, [assignmentId, getNotes]);

  useEffect(() => {
    if (isLoading || !nextCursor) return;

    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        getNotes(nextCursor);
      }
    });

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [isLoading, nextCursor, getNotes]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const success = await postNote({ title, content });
    if (success) {
      setTitle("");
      setContent("");
    }
  };

  const handleEditSubmit = async (noteId: number) => {
    if (!editTitle.trim() || !editContent.trim()) return;

    const success = await editNote(noteId, {
      title: editTitle,
      content: editContent,
    });
    if (success) {
      setEditingId(null);
    }
  };

  if (!assignmentId) {
    return (
      <div className="flex h-screen items-center justify-center font-[Sarabun] bg-slate-50 dark:bg-zinc-950">
        <p className="text-slate-500">ไม่พบข้อมูลงาน</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 flex flex-col font-[Sarabun] transition-colors duration-300">
      {/* Header */}
      <div className="sticky top-0 z-20 flex-none h-14 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-slate-200 dark:border-zinc-800 px-4 flex items-center justify-between">
        <div className="flex-1 flex items-center justify-start">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-zinc-900 hover:bg-slate-200 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 rounded-lg transition-colors font-semibold font-[Prompt] text-sm active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">
              arrow_back
            </span>
            กลับ
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center font-[Prompt] font-semibold text-lg text-slate-800 dark:text-zinc-100">
          กระดานโน็ตสาธารณะ
        </div>
        <div className="flex-1" />
      </div>

      <div className="flex-1 max-w-2xl w-full mx-auto p-4 md:py-8 flex flex-col gap-6">
        {/* Composer */}
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-zinc-900 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-zinc-800 flex flex-col gap-3 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all duration-300"
        >
          <input
            type="text"
            placeholder="หัวข้อ..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isPosting}
            className="w-full bg-transparent border-none text-lg font-bold font-[Prompt] placeholder-slate-400 focus:ring-0 px-2 py-1 dark:text-zinc-100 focus:outline-none"
            required
          />
          <textarea
            placeholder="มีอะไรเกิดขึ้นบ้าง?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isPosting}
            className="w-full bg-transparent border-none resize-none min-h-[100px] placeholder-slate-400 focus:ring-0 px-2 py-1 dark:text-zinc-100 focus:outline-none"
            required
          />
          <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-zinc-800">
            <button
              type="submit"
              disabled={isPosting || !title.trim() || !content.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 dark:disabled:bg-indigo-800 disabled:cursor-not-allowed text-white font-semibold font-[Prompt] px-6 py-2.5 rounded-full transition-all duration-300 flex items-center gap-2 shadow-sm hover:shadow-md active:scale-95"
            >
              {isPosting && (
                <span className="material-symbols-outlined animate-spin text-[18px]">
                  sync
                </span>
              )}
              เพิ่มโน็ต
            </button>
          </div>
        </form>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm text-center font-medium border border-red-100 dark:border-red-900/30">
            {error}
          </div>
        )}

        {/* Feed */}
        <div className="flex flex-col gap-4">
          {notes.map((note) => (
            <div
              key={note.id}
              className="bg-white dark:bg-zinc-900 rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 transition-colors duration-300 animate-in fade-in slide-in-from-bottom-4"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="flex flex-col">
                  <span className="font-semibold font-[Prompt] text-slate-900 dark:text-zinc-100 leading-tight">
                    {note.user.name}
                  </span>
                  <span className="text-sm text-slate-500 dark:text-zinc-400">
                    @{note.user.studentId} •{" "}
                    {new Date(note.createdAt).toLocaleDateString("th-TH", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-start gap-4 mb-2">
                {editingId === note.id ? (
                  <div className="flex-1 flex flex-col gap-3">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 rounded-lg text-lg font-bold font-[Prompt] px-3 py-2 dark:text-zinc-100 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                      placeholder="หัวข้อ..."
                    />
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 rounded-lg min-h-[100px] px-3 py-2 dark:text-zinc-100 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none"
                      placeholder="มีอะไรเกิดขึ้นบ้าง?"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-4 py-1.5 rounded-lg text-sm font-semibold font-[Prompt] text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                      >
                        ยกเลิก
                      </button>
                      <button
                        onClick={() => handleEditSubmit(note.id)}
                        disabled={isLoading}
                        className="px-4 py-1.5 rounded-lg text-sm font-semibold font-[Prompt] bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white transition-colors"
                      >
                        บันทึก
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 className="text-xl font-bold font-[Prompt] text-slate-800 dark:text-zinc-200">
                      {note.title}
                    </h3>
                    <div className="flex items-center gap-1">
                      {user?.id === note.userId && (
                        <button
                          onClick={() => {
                            setEditingId(note.id);
                            setEditTitle(note.title);
                            setEditContent(note.content);
                          }}
                          className="flex-shrink-0 text-slate-400 hover:text-indigo-500 dark:text-zinc-500 dark:hover:text-indigo-400 transition-colors p-1 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/30"
                          title="แก้ไขโน็ต"
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            edit
                          </span>
                        </button>
                      )}
                      {(user?.role === "Admin" || user?.id === note.userId) && (
                        <button
                          onClick={() => {
                            showModal(
                              <ModalFormLayout
                                title={
                                  <div className="flex items-center gap-3">
                                    <div className="p-2 bg-red-100 dark:bg-red-500/20 text-red-600 rounded-full flex items-center justify-center">
                                      <span className="material-symbols-outlined">
                                        warning
                                      </span>
                                    </div>
                                    <h2 className="text-xl font-bold text-red-600 font-[Prompt]">
                                      ลบโน็ต
                                    </h2>
                                  </div>
                                }
                                submitText="ลบโน็ต"
                                submitVariant="danger"
                                isLoading={isLoading}
                                onSubmit={async () => {
                                  await deleteNote(note.id);
                                  hideModal();
                                }}
                                onCancel={hideModal}
                              >
                                <div className="flex flex-col gap-2 font-[Sarabun]">
                                  <p className="text-slate-600 dark:text-zinc-400">
                                    คุณแน่ใจหรือไม่ว่าต้องการลบโน็ตนี้
                                  </p>
                                  <p className="text-red-500 text-sm font-semibold">
                                    การกระทำนี้ไม่สามารถยกเลิกได้
                                  </p>
                                </div>
                              </ModalFormLayout>,
                            );
                          }}
                          className="flex-shrink-0 text-slate-400 hover:text-red-500 dark:text-zinc-500 dark:hover:text-red-400 transition-colors p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30"
                          title="ลบโน็ต"
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            delete
                          </span>
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
              {editingId !== note.id && (
                <p className="text-slate-700 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed text-[15px]">
                  {note.content}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Loading / End indicator */}
        <div
          ref={loadMoreRef}
          className="py-8 flex justify-center items-center text-slate-400 dark:text-zinc-500 h-24"
        >
          {isLoading ? (
            <span className="material-symbols-outlined animate-spin text-3xl text-indigo-500">
              sync
            </span>
          ) : notes.length > 0 && !nextCursor ? (
            <div className="flex flex-col items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-zinc-700 mb-1" />
              <p className="text-sm font-medium text-slate-400 dark:text-zinc-500">
                สิ้นสุดหน้าฟีด
              </p>
            </div>
          ) : notes.length === 0 && !isLoading ? (
            <div className="flex flex-col items-center gap-2 py-8 text-slate-400 dark:text-zinc-500">
              <p className="font-medium text-sm">ยังไม่มีข้อความ</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
