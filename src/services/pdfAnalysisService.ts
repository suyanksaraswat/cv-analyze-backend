import { AnalyzeRequest, AnalyzeResponse } from '@/types';
import { extractTextFromPDF } from '@/utils/pdfExtractor';
import { GeminiService } from './geminiService';
import logger from '@/utils/logger';
import { AppError } from '@/utils/appError';
import { StatusCodes } from 'http-status-codes';

export class PDFAnalysisService {
  static async analyzeDocuments(data: AnalyzeRequest): Promise<AnalyzeResponse> {
    const startTime = Date.now();
    
    try {
      logger.info('Starting PDF analysis', {
        cvLength: data.cv.length,
        jobDescriptionLength: data.jobDescription.length,
      });

      // Extract text from PDFs
      const [jobDescriptionText, cvText] = await Promise.all([
        extractTextFromPDF(data.jobDescription),
        extractTextFromPDF(data.cv),
      ]);

      // Validate extracted text
      if (!jobDescriptionText.trim()) {
        throw new AppError(
          'Could not extract text from job description PDF',
          StatusCodes.BAD_REQUEST
        );
      }

      if (!cvText.trim()) {
        throw new AppError(
          'Could not extract text from CV PDF',
          StatusCodes.BAD_REQUEST
        );
      }

      logger.info('PDF text extraction completed', {
        jobDescriptionTextLength: jobDescriptionText.length,
        cvTextLength: cvText.length,
      });

      // Analyze with AI
      const analysis = await GeminiService.analyzeWithAI(
        jobDescriptionText,
        cvText
      );

      const processingTime = Date.now() - startTime;

      const result: AnalyzeResponse = {
        analysis,
        jobDescriptionLength: jobDescriptionText.length,
        cvLength: cvText.length,
        processingTime,
      };

      logger.info('PDF analysis completed successfully', {
        processingTime,
        analysisLength: analysis.length,
      });

      return result;
    } catch (error) {
      const processingTime = Date.now() - startTime;
      logger.error('PDF analysis failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
        processingTime,
      });
      
      // Re-throw AppError as-is, wrap others
      if (error instanceof AppError) {
        throw error;
      }
      
      throw new AppError(
        'An unexpected error occurred during analysis',
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}
