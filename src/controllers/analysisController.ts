import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { PDFAnalysisService } from "@/services/pdfAnalysisService";
import { ResponseHandler } from "@/utils/responseHandler";
import { asyncHandler } from "@/utils/asyncHandler";
import { AnalyzeRequest } from "@/types";
import logger from "@/utils/logger";

export class AnalysisController {
  static analyzeWithAI = asyncHandler(async (req: Request, res: Response) => {
    const data: AnalyzeRequest = req.body;

    logger.info("PDF analysis request received", {
      requestId: req.headers["x-request-id"],
      cvSize: data.cv.length,
      jobDescriptionSize: data.jobDescription.length,
    });

    const result = await PDFAnalysisService.analyzeDocuments(data);

    return ResponseHandler.success(
      res,
      result,
      "Analysis completed successfully",
      StatusCodes.OK
    );
  });

  // Test endpoint for debugging
  static test = asyncHandler(async (req: Request, res: Response) => {
    const { message } = req.body;

    logger.info("Test request received", {
      requestId: req.headers["x-request-id"],
      message,
    });

    return ResponseHandler.success(
      res,
      { success: true, echo: message },
      "Test successful",
      StatusCodes.OK
    );
  });
}
