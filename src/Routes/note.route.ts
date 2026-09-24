import { Router } from "express";
import { PrivateNoteController, PublicNoteController } from "../Controllers";

export const publicNoteRoute = Router({ mergeParams: true });
export const privateNoteRoute = Router({ mergeParams: true });

publicNoteRoute.get(
  "/",

  PublicNoteController.getByAssignmentId,
);
publicNoteRoute.post("/", PublicNoteController.create);

export const rootPublicNoteRoute = Router();
rootPublicNoteRoute.get("/:id", PublicNoteController.getById);
rootPublicNoteRoute.put("/:id", PublicNoteController.update);
rootPublicNoteRoute.delete("/:id", PublicNoteController.delete);

privateNoteRoute.get("/", PrivateNoteController.getMine);
privateNoteRoute.put("/", PrivateNoteController.upsert);
