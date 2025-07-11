import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { AppError } from "@/utils/appError";
import { ResponseHandler } from "@/utils/responseHandler";
import logger from "@/utils/logger";
import config from "@/config";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error("Error occurred", {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    requestId: req.headers["x-request-id"],
  });

  if (err instanceof AppError) {
    return ResponseHandler.error(res, err.message, err.statusCode);
  }

  // Handle specific error types
  if (err.name === "ValidationError") {
    return ResponseHandler.error(
      res,
      "Validation Error",
      StatusCodes.BAD_REQUEST
    );
  }

  if (err.name === "CastError") {
    return ResponseHandler.error(
      res,
      "Invalid ID format",
      StatusCodes.BAD_REQUEST
    );
  }

  // Handle fetch errors (network issues with Gemini API)
  if (err.message.includes("fetch")) {
    return ResponseHandler.error(
      res,
      "External service unavailable",
      StatusCodes.SERVICE_UNAVAILABLE
    );
  }

  // Default error
  const message =
    config.nodeEnv === "production" ? "Something went wrong!" : err.message;

  return ResponseHandler.error(res, message, StatusCodes.INTERNAL_SERVER_ERROR);
};
