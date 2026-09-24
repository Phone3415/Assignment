import { JSX } from "react/jsx-runtime";
import { JWTProvider } from "./JWT.context";
import { ModalProvider } from "./Modal.context";
import { ThemeProvider } from "./Theme.context";

export default function Context({ children }: { children: JSX.Element }) {
  return (
    <>
      <ThemeProvider>
        <JWTProvider>
          <ModalProvider>{children}</ModalProvider>
        </JWTProvider>
      </ThemeProvider>
    </>
  );
}
