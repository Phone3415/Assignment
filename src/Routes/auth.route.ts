import { Router } from "express";
import { AuthController } from "../Controllers/auth.controller";

export const authRoute = Router();

authRoute.post("/login", AuthController.login);
authRoute.post("/refresh-token", AuthController.refreshToken);
