import { AssignmentType } from "../../generated/prisma/enums";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface HealthStatus {
  status: "ok" | "degraded" | "error";
  uptimeSeconds: number;
  environment: string;
  database: "connected" | "disconnected";
}

export interface AssignmentItem {
  id: number;
  name: string;
  description: string;
  deadline: string | null;
  assignedDate: string;
  type: AssignmentType;
  groupSize: number;
  className?: string;
}

export interface CreateAssignmentDto {
  name: string;
  description: string;
  assignedDate?: string;
  deadline?: string;
  type: AssignmentType;
  groupSize?: number;
  className?: string;
}

export interface ClassItem {
  id: number;
  name: string;
  assignmentCount: number;
  createdAt: string;
}

export interface CreateClassDto {
  name: string;
}
