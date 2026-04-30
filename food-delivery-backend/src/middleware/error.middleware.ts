import { Request, Response, NextFunction } from "express";

export interface AppError extends Error {
  statusCode?: number;
}

// 404 handler — must be registered after all routes
export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    errors: [`Route ${req.method} ${req.originalUrl} not found`],
  });
}

// Global error handler — must have 4 params for Express to recognise it
export function errorHandler(
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error(`[Error] ${err.message}`);

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    errors: [err.message || "Internal server error"],
  });
}
