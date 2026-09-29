import { Request, Response, NextFunction } from 'express';
import { ENV } from '../config/env';

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'An unexpected internal server error occurred.';

  // In production, mask stack traces to prevent info disclosure
  res.status(statusCode).json({
    success: false,
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message: statusCode === 500 && ENV.NODE_ENV === 'production' ? 'An unexpected server error occurred. Please try again later.' : message,
      ...(ENV.NODE_ENV !== 'production' && { stack: err.stack }),
    },
  });
};
