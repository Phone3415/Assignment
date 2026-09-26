import { createContext, JSX, ReactNode, useContext, useState } from "react";
import { JWTData } from "../Types";

export type { JWTData } from "../Types";

interface JWTContextType {
  accessToken: string | null;
  refreshToken: string | null;
  user: JWTData | null;
  logout: () => void;
  set: (accessToken: string, refreshToken: string, user: JWTData) => void;
}

const JWTContext = createContext<JWTContextType | undefined>(undefined);

export function JWTProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const [accessToken, setAccessToken] = useState<string | null>(
    localStorage.getItem("accessToken"),
  );
  const [refreshToken, setRefreshToken] = useState<string | null>(
    localStorage.getItem("refreshToken"),
  );
  const [user, setUser] = useState<JWTData | null>(() => {
    try {
      const stored = localStorage.getItem("user");
      if (!stored || stored === "undefined") return null;
      return JSON.parse(stored) as JWTData;
    } catch {
      return null;
    }
  });

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    window.location.href = "/login";
  };

  const set = (accessToken: string, refreshToken: string, user: JWTData) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("user", JSON.stringify(user));

    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    setUser(user);
  };

  return (
    <JWTContext.Provider
      value={{
        accessToken,
        refreshToken,
        user,
        logout,
        set,
      }}
    >
      {children}
    </JWTContext.Provider>
  );
}

export function useJWT(): JWTContextType {
  const context = useContext(JWTContext);
  if (context === undefined) {
    throw new Error("useJWT ต้องใช้งานภายใน JWTProvider");
  }
  return context;
}
