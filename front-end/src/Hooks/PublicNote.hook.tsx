import { useCallback, useState } from "react";
import { CreatePublicNoteData, PublicNoteItem } from "../Types/note.type";
import useApiFetch from "./Api.hook";

export function usePublicNotes(assignmentId: number) {
  const apiFetch = useApiFetch();
  const [notes, setNotes] = useState<PublicNoteItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPosting, setIsPosting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  const getNotes = useCallback(
    async (cursor?: string) => {
      setIsLoading(true);
      setError(null);
      try {
        let url = `/api/assignments/${assignmentId}/public-notes`;
        if (cursor) {
          url += `?cursor=${encodeURIComponent(cursor)}`;
        }
        const response = await apiFetch(url, { method: "GET" });
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch notes");
        }

        setNotes((prev) =>
          cursor ? [...prev, ...data.data.items] : data.data.items
        );
        setNextCursor(data.data.nextCursor);
      } catch (err: any) {
        setError(err.message || "Failed to fetch notes");
      } finally {
        setIsLoading(false);
      }
    },
    [apiFetch, assignmentId]
  );

  const postNote = useCallback(
    async (data: CreatePublicNoteData) => {
      setIsPosting(true);
      setError(null);
      try {
        const response = await apiFetch(`/api/assignments/${assignmentId}/public-notes`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        
        const json = await response.json();
        if (!response.ok) {
          throw new Error(json.error || "Failed to post note");
        }
        
        // Add new note to the top of the feed
        setNotes((prev) => [json.data, ...prev]);
        return true;
      } catch (err: any) {
        setError(err.message || "Failed to post note");
        return false;
      } finally {
        setIsPosting(false);
      }
    },
    [apiFetch, assignmentId]
  );

  const editNote = useCallback(
    async (noteId: number, data: Partial<CreatePublicNoteData>) => {
      try {
        const response = await apiFetch(`/api/public-notes/${noteId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        
        const json = await response.json();
        if (!response.ok) {
          throw new Error(json.error || "Failed to edit note");
        }

        setNotes((prev) =>
          prev.map((note) => (note.id === noteId ? { ...note, ...json.data } : note))
        );
        return true;
      } catch (err: any) {
        setError(err.message || "Failed to edit note");
        return false;
      }
    },
    [apiFetch]
  );

  const deleteNote = useCallback(
    async (noteId: number) => {
      try {
        const response = await apiFetch(`/api/public-notes/${noteId}`, {
          method: "DELETE",
        });
        
        if (!response.ok) {
          const json = await response.json();
          throw new Error(json.error || "Failed to delete note");
        }

        setNotes((prev) => prev.filter((note) => note.id !== noteId));
        return true;
      } catch (err: any) {
        setError(err.message || "Failed to delete note");
        return false;
      }
    },
    [apiFetch]
  );

  return {
    notes,
    isLoading,
    isPosting,
    error,
    nextCursor,
    getNotes,
    postNote,
    editNote,
    deleteNote,
  };
}
