import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(err);

  let status = 500;
  let message = err instanceof Error ? err.message : "Internal Server Error";

  if (err instanceof ZodError) {
    status = 400;
    message = err.issues.map((e: any) => e.message).join(", ");
  } else if (err?.code === "P2025") {
    status = 404;
    message = "Record not found";
  } else if (message.toLowerCase().includes("forbidden")) {
    status = 403;
  }

  res.status(status).json({
    success: false,
    error: message,
    timestamp: new Date().toISOString(),
  });
};
