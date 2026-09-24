import { useState } from "react";
import { sendLogin } from "../Api/Login.api";
import { useJWT } from "../Contexts/JWT.context";
import { LoginResult } from "../Types";

export interface LoginFormHook {
  studentId: string;
  setStudentId: React.Dispatch<React.SetStateAction<string>>;
  handleLogin: () => Promise<LoginResult>;
  isLoading: boolean;
}

export default function useLoginForm(): LoginFormHook {
  const [studentId, setStudentId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const jwt = useJWT();

  const handleLogin = async (): Promise<LoginResult> => {
    if (!studentId.trim()) {
      return { success: false, error: "กรุณากรอกรหัสนักศึกษาก่อนเข้าสู่ระบบ" };
    }

    setIsLoading(true);
    try {
      const data = await sendLogin(studentId.trim());
      jwt.set(data.accessToken, data.refreshToken, data.user);
      return { success: true };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "เกิดข้อผิดพลาดในการเชื่อมต่อ";
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return { studentId, setStudentId, handleLogin, isLoading };
}

