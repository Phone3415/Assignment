import { Router } from "express";
import { ClassController } from "../Controllers/class.controller";
import { adminMiddleware } from "../Middleware/admin.middleware";
import { userMiddleware } from "../Middleware/user.middleware";

export const classRoute = Router();

classRoute.get("/", ClassController.get);
classRoute.post("/", adminMiddleware, ClassController.create);
classRoute.patch("/:id", adminMiddleware, ClassController.update);
classRoute.delete("/:id", adminMiddleware, ClassController.delete);
