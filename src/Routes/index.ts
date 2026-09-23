import { Router } from "express";
import { assignmentRoute } from "./assignment.route";
import { authRoute } from "./auth.route";
import { classRoute } from "./class.route";
import { publicNoteRoute, privateNoteRoute, rootPublicNoteRoute } from "./note.route";

export const apiRoute = Router();

apiRoute.use("/assignments/:assignmentId/public-notes", publicNoteRoute);
apiRoute.use("/assignments/:assignmentId/private-note", privateNoteRoute);
apiRoute.use("/public-notes", rootPublicNoteRoute);

apiRoute.use("/assignments", assignmentRoute);
apiRoute.use("/classes", classRoute);
apiRoute.use("/auth", authRoute);

