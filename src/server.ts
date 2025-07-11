import app from "./app";
import config from "@/config";
import logger from "@/utils/logger";
import fs from "fs";
import path from "path";

const startServer = async () => {
  try {
    // Ensure logs directory exists
    const logsDir = path.join(process.cwd(), "logs");
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }

    const server = app.listen(config.port, () => {
      logger.info(
        `Server running on port ${config.port} in ${config.nodeEnv} mode`
      );
      logger.info("Configuration loaded", {
        port: config.port,
        nodeEnv: config.nodeEnv,
        apiVersion: config.apiVersion,
        hasGeminiEndpoint: !!config.geminiEndpoint,
        hasAuthToken: !!config.authToken,
      });
    });

    // Graceful shutdown
    process.on("SIGTERM", () => {
      logger.info("SIGTERM received, shutting down gracefully");
      server.close(() => {
        logger.info("Process terminated");
        process.exit(0);
      });
    });

    process.on("SIGINT", () => {
      logger.info("SIGINT received, shutting down gracefully");
      server.close(() => {
        logger.info("Process terminated");
        process.exit(0);
      });
    });

    process.on("unhandledRejection", (reason, promise) => {
      logger.error("Unhandled Rejection at:", promise, "reason:", reason);
      server.close(() => {
        process.exit(1);
      });
    });

    process.on("uncaughtException", (error) => {
      logger.error("Uncaught Exception:", error);
      server.close(() => {
        process.exit(1);
      });
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
