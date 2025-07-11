import dotenv from 'dotenv';
import { AppConfig } from '@/types';

dotenv.config();

const config: AppConfig = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  apiVersion: process.env.API_VERSION || 'v1',
  logLevel: process.env.LOG_LEVEL || 'info',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10), // 10MB
  rateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW || '900000', 10), // 15 minutes
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
  geminiEndpoint: process.env.GEMINI_ENDPOINT || '',
  authToken: process.env.AUTH_TOKEN || '',
};

// Validate required environment variables
if (!config.geminiEndpoint) {
  throw new Error('GEMINI_ENDPOINT environment variable is required');
}

if (!config.authToken) {
  throw new Error('AUTH_TOKEN environment variable is required');
}

export default config;
