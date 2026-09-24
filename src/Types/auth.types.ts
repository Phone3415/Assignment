import { Role } from "../../generated/prisma/enums";

export interface JWTData {
  id: number;
  studentId: string;
  name: string;
  role: Role;
}
