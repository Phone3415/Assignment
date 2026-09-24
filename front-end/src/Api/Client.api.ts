import { AuthResponse } from "../Types";

export async function sendRefreshToken(refreshToken: string): Promise<AuthResponse> {
  const response = await fetch("/api/auth/refresh-token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.error || "ต่ออายุเซสชันไม่สำเร็จ");
  }

  return responseData.data;
}


export async function executeFetch(
  input: RequestInfo | URL,
  init: RequestInit | undefined,
  accessToken: string | null,
): Promise<Response> {
  const headers = new Headers(init?.headers);
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const config: RequestInit = {
    ...init,
    headers,
  };

  return fetch(input, config);
}
