import { Router } from "express";
import analysisRoutes from "./analysisRoutes";

const router = Router();

router.use("/", analysisRoutes);

// Health check endpoint
router.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
  });
});

export default router;
