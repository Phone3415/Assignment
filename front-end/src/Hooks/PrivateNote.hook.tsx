import { useCallback, useEffect, useState, useRef } from "react";
import useApiFetch from "./Api.hook";
import debounce from "lodash.debounce";

export type SaveState = "idle" | "saving" | "saved" | "error";

export function usePrivateNote(assignmentId: string | number) {
  const apiFetch = useApiFetch();
  const [initialData, setInitialData] = useState<any>(null);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const apiFetchRef = useRef(apiFetch);
  apiFetchRef.current = apiFetch;

  // Load initial data
  useEffect(() => {
    let mounted = true;
    const loadNote = async () => {
      setIsLoading(true);
      
      const localKey = `private-note-${assignmentId}`;
      const localData = localStorage.getItem(localKey);
      
      if (localData) {
        try {
          setInitialData(JSON.parse(localData));
        } catch (e) {
          console.error("Failed to parse local note data", e);
        }
      }

      try {
        const response = await apiFetchRef.current(`/api/assignments/${assignmentId}/private-note`);
        if (response.ok) {
          const json = await response.json();
          if (json.data && json.data.content) {
            if (mounted) {
               setInitialData(json.data.content);
               localStorage.setItem(localKey, JSON.stringify(json.data.content));
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch private note:", error);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    
    loadNote();
    return () => { mounted = false; };
  }, [assignmentId]);

  const saveToBackend = useRef(
    debounce(async (payload: any, assignmentId: string | number) => {
      try {
        const response = await apiFetchRef.current(`/api/assignments/${assignmentId}/private-note`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: payload }),
        });
        if (response.ok) {
          setSaveState("saved");
        } else {
          setSaveState("error");
        }
      } catch (e) {
        setSaveState("error");
      }
    }, 1500)
  ).current;

  const saveNote = useCallback((payload: any) => {
    if (!payload) return;
    
    // 1. Sync to localStorage immediately
    localStorage.setItem(`private-note-${assignmentId}`, JSON.stringify(payload));
    setSaveState("saving");
    
    // 2. Debounce sync to backend
    saveToBackend(payload, assignmentId);
  }, [assignmentId, saveToBackend]);

  return { initialData, saveState, isLoading, saveNote };
}
