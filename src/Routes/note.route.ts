import { Router } from "express";
import { PrivateNoteController, PublicNoteController } from "../Controllers";
import { userMiddleware } from "../Middleware/user.middleware";

export const publicNoteRoute = Router({ mergeParams: true });
export const privateNoteRoute = Router({ mergeParams: true });

// Public Note Routes
// Base route for assignment-specific endpoints: /api/assignments/:assignmentId/public-notes
publicNoteRoute.get("/", userMiddleware, PublicNoteController.getByAssignmentId);
publicNoteRoute.post("/", userMiddleware, PublicNoteController.create);

// Base route for note-specific endpoints: /api/public-notes
export const rootPublicNoteRoute = Router();
rootPublicNoteRoute.get("/:id", userMiddleware, PublicNoteController.getById);
rootPublicNoteRoute.put("/:id", userMiddleware, PublicNoteController.update);
rootPublicNoteRoute.delete("/:id", userMiddleware, PublicNoteController.delete);

// Private Note Routes
// Base route for assignment-specific endpoints: /api/assignments/:assignmentId/private-note
privateNoteRoute.get("/", userMiddleware, PrivateNoteController.getMine);
privateNoteRoute.put("/", userMiddleware, PrivateNoteController.upsert);
