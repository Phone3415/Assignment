import { useNavigate } from "react-router-dom";
import { JSX } from "react/jsx-runtime";
import { useModal } from "../../Contexts/Modal.context";
import useLoginForm from "../../Hooks/Login.hook";
import FeedbackModal from "../FeedbackModal.component";

export default function LoginForm(): JSX.Element {
  const { studentId, setStudentId, handleLogin, isLoading } = useLoginForm();
  const { showModal } = useModal();
  const navigate = useNavigate();
  const inputId = "studentId";

  const onSubmit = async () => {
    const result = await handleLogin();

    if (result.success) {
      navigate("/");
    } else {
      showModal(
        <FeedbackModal
          type={!studentId ? "warning" : "error"}
          title={!studentId ? "ข้อมูลไม่ครบถ้วน" : "เข้าสู่ระบบไม่สำเร็จ"}
          text={result.error || "มีข้อผิดพลาดเกิดขึ้น"}
        />,
      );
    }
  };

  return (
    <div className="w-full space-y-5">
      <div className="space-y-2 text-left">
        <label
          htmlFor={inputId}
          className="block text-sm font-semibold text-slate-700 dark:text-zinc-300 font-[Sarabun] ml-1"
        >
          รหัสนักศึกษา
        </label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 group-focus-within:text-blue-500 dark:text-zinc-500 dark:group-focus-within:text-blue-400 transition-colors duration-300">
            <span className="material-symbols-outlined text-[20px]">badge</span>
          </div>
          <input
            id={inputId}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            name={inputId}
            value={studentId}
            placeholder="เช่น 123456789"
            onChange={(e) => setStudentId(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-slate-50/50 hover:bg-slate-100/80 dark:bg-zinc-900/50 dark:hover:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500 transition-all duration-300 text-slate-800 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 font-[Sarabun] shadow-sm focus:shadow-md"
            disabled={isLoading}
          />
        </div>
      </div>

      <button
        className="w-full py-3.5 bg-blue-600 dark:bg-blue-600 text-white font-semibold rounded-xl shadow-sm hover:bg-blue-700 dark:hover:bg-blue-500 hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900 transition-all duration-200 ease-in-out active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none font-[Prompt]"
        onClick={onSubmit}
        disabled={isLoading}
      >
        {isLoading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
      </button>
    </div>
  );
}
