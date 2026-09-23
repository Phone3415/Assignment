import { Router } from "express";
import { AssignmentController } from "../Controllers/assignment.controller";
import { adminMiddleware } from "../Middleware/admin.middleware";
import { userMiddleware } from "../Middleware/user.middleware";

export const assignmentRoute = Router();
assignmentRoute.use(userMiddleware);

assignmentRoute.get("/:classId", AssignmentController.getAll);
assignmentRoute.get("/:classId/:id", AssignmentController.get);
assignmentRoute.post("/:classId", adminMiddleware, AssignmentController.create);
assignmentRoute.patch("/:id", adminMiddleware, AssignmentController.update);
assignmentRoute.delete("/:id", adminMiddleware, AssignmentController.delete);

assignmentRoute.put("/:classId/:id/submit", AssignmentController.submit);
assignmentRoute.put("/:classId/:id/unsubmit", AssignmentController.unsubmit);
