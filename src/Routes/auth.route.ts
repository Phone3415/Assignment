import { Router, type Request, type Response } from "express";
import { AuthController } from "../Controllers/auth.controller";
import { frontEnd } from "../Utils/path.util";

export const authRoute = Router();

authRoute.get("/login", (_: Request, res: Response) => {
  res.sendFile(frontEnd("auth", "login"));
});

authRoute.post("/login", AuthController.login);
