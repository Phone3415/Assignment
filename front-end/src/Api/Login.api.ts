import { AuthResponse } from "../Types";

export async function sendLogin(studentId: string): Promise<AuthResponse> {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ studentId }),
  });

  const responseData = await response.json();
  if (!response.ok) {
    throw new Error(responseData.error || "เข้าสู่ระบบไม่สำเร็จ");
  }

  return responseData.data;
}

