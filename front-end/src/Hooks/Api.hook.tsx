import { useCallback, useRef } from "react";
import { executeFetch, sendRefreshToken } from "../Api/Client.api";
import { useJWT } from "../Contexts/JWT.context";

export type ApiFetchFn = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

export default function useApiFetch(): ApiFetchFn {

  const jwt = useJWT();
  const jwtRef = useRef(jwt);
  jwtRef.current = jwt;

  const apiFetch = useCallback(
    async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
      let currentAccessToken = jwtRef.current.accessToken;

      let response = await executeFetch(input, init, currentAccessToken);
      if (response.status === 401 && jwtRef.current.refreshToken) {
        try {
          const data = await sendRefreshToken(jwtRef.current.refreshToken);
          jwtRef.current.set(data.accessToken, data.refreshToken, data.user);
          currentAccessToken = data.accessToken;

          response = await executeFetch(input, init, currentAccessToken);
        } catch (error) {
          jwtRef.current.logout();
        }
      }

      return response;
    },
    [],
  );

  return apiFetch;
}
