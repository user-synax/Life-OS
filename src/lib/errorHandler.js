/**
 * Centralized error handler for API routes
 * Provides generic error messages in production to avoid leaking sensitive information
 */
import { log } from './logger';

export class ApiError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ApiError';
  }
}

export function handleApiError(error, req) {
  const isDevelopment = process.env.NODE_ENV === 'development';

  // Log error for debugging
  log.error('API Error', error);

  // Handle known API errors
  if (error instanceof ApiError) {
    return {
      error: error.message,
      statusCode: error.statusCode,
    };
  }

  // Handle Mongoose validation errors
  if (error.name === 'ValidationError') {
    return {
      error: 'Validation failed. Please check your input.',
      statusCode: 400,
    };
  }

  // Handle Mongoose duplicate key errors
  if (error.code === 11000) {
    return {
      error: 'A record with this information already exists.',
      statusCode: 409,
    };
  }

  // Handle JWT errors
  if (error.name === 'JsonWebTokenError') {
    return {
      error: 'Invalid authentication token.',
      statusCode: 401,
    };
  }

  if (error.name === 'TokenExpiredError') {
    return {
      error: 'Authentication token has expired.',
      statusCode: 401,
    };
  }

  // Handle Mongoose connection errors
  if (error.name === 'MongooseError' || error.name === 'MongoError') {
    return {
      error: 'Database connection error. Please try again later.',
      statusCode: 503,
    };
  }

  // Generic error - don't leak stack traces in production
  if (isDevelopment) {
    return {
      error: error.message || 'Internal Server Error',
      statusCode: 500,
    };
  }

  return {
    error: 'An unexpected error occurred. Please try again later.',
    statusCode: 500,
  };
}

export function createErrorResponse(error, req) {
  const { error: message, statusCode } = handleApiError(error, req);
  return {
    error: message,
    statusCode,
  };
}
