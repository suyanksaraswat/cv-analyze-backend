import { Router } from "express";
import { AnalysisController } from "@/controllers/analysisController";
import { validate } from "@/middleware/validation";
import { analyzeSchema } from "@/validators/analyzeValidator";
import Joi from "joi";

const router = Router();

// Main analysis endpoint
router.post(
  "/analyze-with-ai",
  validate(analyzeSchema),
  AnalysisController.analyzeWithAI
);

// Test endpoint
const testSchema = Joi.object({
  message: Joi.string().required().min(1).max(1000),
});

router.post("/test", validate(testSchema), AnalysisController.test);

export default router;
