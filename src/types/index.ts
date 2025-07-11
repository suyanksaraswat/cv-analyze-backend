export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
    timestamp: string;
    requestId: string;
  }
  
  export interface AnalyzeRequest {
    cv: string;
    jobDescription: string;
  }
  
  export interface AnalyzeResponse {
    analysis: string;
    jobDescriptionLength: number;
    cvLength: number;
    processingTime: number;
  }
  
  export interface GeminiResponse {
    candidates?: Array<{
      content: {
        parts: Array<{
          text: string;
        }>;
      };
    }>;
  }
  
  export interface AppConfig {
    port: number;
    nodeEnv: string;
    apiVersion: string;
    logLevel: string;
    corsOrigin: string;
    maxFileSize: number;
    rateLimitWindow: number;
    rateLimitMax: number;
    geminiEndpoint: string;
    authToken: string;
  }
  