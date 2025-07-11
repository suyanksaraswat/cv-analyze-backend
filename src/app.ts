import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import { StatusCodes } from "http-status-codes";
import config from "@/config";
import routes from "@/routes";
import { errorHandler } from "@/middleware/errorHandler";
import { requestLogger } from "@/middleware/requestLogger";
import { ResponseHandler } from "@/utils/responseHandler";

const app = express();

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: config.corsOrigin,
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimitWindow,
  max: config.rateLimitMax,
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Compression
app.use(compression());

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Logging
app.use(requestLogger);

// Routes
app.use(`/api/${config.apiVersion}`, routes);

// 404 handler
app.all("*", (req, res) => {
  ResponseHandler.error(
    res,
    `Can't find ${req.originalUrl} on this server!`,
    StatusCodes.NOT_FOUND
  );
});

// Global error handler
app.use(errorHandler);

export default app;
