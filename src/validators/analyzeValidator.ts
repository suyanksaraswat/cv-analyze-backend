import Joi from 'joi';
import { AnalyzeRequest } from '@/types';

export const analyzeSchema = Joi.object<AnalyzeRequest>({
  cv: Joi.string()
    .required()
    .min(1)
    .max(10485760) // 10MB as base64
    .pattern(/^[A-Za-z0-9+/]*={0,2}$/)
    .messages({
      'string.empty': 'CV PDF is required',
      'string.pattern.base': 'CV must be a valid base64 string',
      'string.max': 'CV file is too large (max 10MB)',
    }),
  jobDescription: Joi.string()
    .required()
    .min(1)
    .max(10485760) // 10MB as base64
    .pattern(/^[A-Za-z0-9+/]*={0,2}$/)
    .messages({
      'string.empty': 'Job description PDF is required',
      'string.pattern.base': 'Job description must be a valid base64 string',
      'string.max': 'Job description file is too large (max 10MB)',
    }),
});
