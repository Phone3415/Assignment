import { Router } from "express";
import { assignmentRoute } from "./assignment.route";
import { authRoute } from "./auth.route";
import { classRoute } from "./class.route";
import { userRoute } from "./user.route";
import { publicNoteRoute, privateNoteRoute, rootPublicNoteRoute } from "./note.route";
import { userMiddleware } from "../Middleware/user.middleware";

export const apiRoute = Router();

// Public routes (login / logout)
apiRoute.use("/auth", authRoute);

// Protect all remaining API routes
apiRoute.use(userMiddleware);

apiRoute.use("/assignments/:assignmentId/public-notes", publicNoteRoute);
apiRoute.use("/assignments/:assignmentId/private-note", privateNoteRoute);
apiRoute.use("/public-notes", rootPublicNoteRoute);

apiRoute.use("/assignments", assignmentRoute);
apiRoute.use("/classes", classRoute);
apiRoute.use("/users", userRoute);
