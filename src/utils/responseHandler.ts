import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ApiResponse } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export class ResponseHandler {
  static success<T>(
    res: Response,
    data?: T,
    message?: string,
    statusCode: number = StatusCodes.OK
  ): Response {
    const response = {
      success: true,
      data,
      message,
      timestamp: new Date().toISOString(),
      requestId: uuidv4(),
    } as ApiResponse<T>;
    return res.status(statusCode).json(response);
  }

  static error(
    res: Response,
    error: string,
    statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR
  ): Response {
    const response: ApiResponse = {
      success: false,
      error,
      timestamp: new Date().toISOString(),
      requestId: uuidv4(),
    };
    return res.status(statusCode).json(response);
  }

  static validationError(res: Response, errors: any[]): Response {
    const response: ApiResponse = {
      success: false,
      error: 'Validation failed',
      data: errors,
      timestamp: new Date().toISOString(),
      requestId: uuidv4(),
    };
    return res.status(StatusCodes.BAD_REQUEST).json(response);
  }
}
