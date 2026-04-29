import pino from 'pino';

const isDevelopment = process.env.NODE_ENV === 'development';

// Create pino logger with appropriate configuration
export const logger = pino({
  level: process.env.LOG_LEVEL || (isDevelopment ? 'debug' : 'info'),
  transport: isDevelopment
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname',
        },
      }
    : undefined,
  serializers: {
    error: pino.stdSerializers.err,
  },
  base: {
    env: process.env.NODE_ENV || 'development',
  },
});

// Convenience methods for different log levels
export const log = {
  info: (msg, data) => logger.info(data, msg),
  error: (msg, error) => logger.error(error, msg),
  warn: (msg, data) => logger.warn(data, msg),
  debug: (msg, data) => logger.debug(data, msg),
};

export default logger;
