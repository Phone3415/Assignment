export enum AssignmentStatus {
  Submitted = "Submitted",
  Unchecked = "Unchecked",
  Overdue = "Overdue",
  Urgent = "Urgent",
}

export enum AssignmentType {
  Solo = "Solo",
  Group = "Group",
  Major = "Major",
}

export interface AssignmentData {
  id: number;
  name: string;
  description: string;
  deadline: string | null;
  assignedDate: string;
  type: AssignmentType;
  groupSize: number | null;
  classId: number;
  createdAt: string;
  updatedAt: string | null;
  assignmentChecklists?: { id: number; userId: number }[];
}

export interface AssignmentListResponse {
  success: boolean;
  data: AssignmentData[];
  totalPages?: number;
}

