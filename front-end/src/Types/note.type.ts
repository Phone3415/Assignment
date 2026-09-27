export interface PublicNoteUser {
  id: number;
  studentId: string;
  name: string;
}

export interface PublicNoteItem {
  id: number;
  assignmentId: number;
  userId: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string | null;
  user: PublicNoteUser;
}

export interface GetPublicNotesResponse {
  success: boolean;
  data: {
    items: PublicNoteItem[];
    nextCursor: string | null;
  };
}

export interface CreatePublicNoteData {
  title: string;
  content: string;
}
