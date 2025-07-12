import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';
import { ResponseHandler } from '@/utils/responseHandler';
import logger from '@/utils/logger';

export const validate = (schema: Schema) => {
  // @ts-ignore
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      logger.warn('Validation failed', { errors, requestId: req.headers['x-request-id'] });
      return ResponseHandler.validationError(res, errors);
    }

    next();
  };
};
