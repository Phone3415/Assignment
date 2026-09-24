import { Router } from "express";
import { UserController } from "../Controllers/user.controller";
import { adminMiddleware } from "../Middleware/admin.middleware";

export const userRoute = Router();

// User routes are Admin only
userRoute.use(adminMiddleware);

userRoute.get("/", UserController.getAll);
userRoute.get("/:id", UserController.getById);
userRoute.post("/", UserController.create);
userRoute.patch("/:id", UserController.update);
userRoute.put("/:id", UserController.update);
userRoute.delete("/:id", UserController.delete);
