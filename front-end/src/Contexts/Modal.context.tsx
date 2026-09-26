import {
  createContext,
  JSX,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import GlobalModal from "../Components/GlobalModal.component";

interface ModalContextType {
  showModal: (content: ReactNode, options?: { maxWidth?: string }) => void;
  hideModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState<ReactNode | null>(null);
  const [modalOptions, setModalOptions] = useState<{ maxWidth?: string }>({});
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);


  const showModal = (modalContent: ReactNode, options?: { maxWidth?: string }) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setContent(modalContent);
    setModalOptions(options || {});
    setIsOpen(true);
  };

  const hideModal = () => {
    setIsOpen(false);
    // Wait for the exit animation (300ms) to complete before unmounting content
    timeoutRef.current = setTimeout(() => setContent(null), 300);
  };

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) hideModal();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <ModalContext.Provider value={{ showModal, hideModal }}>
      {children}
      <GlobalModal isOpen={isOpen} content={content} onClose={hideModal} maxWidth={modalOptions.maxWidth} />
    </ModalContext.Provider>
  );
}

export function useModal(): ModalContextType {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
}
