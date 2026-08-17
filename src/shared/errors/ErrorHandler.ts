import { ErrorRequestHandler } from 'express';

import moment from 'moment';
import AppError from './AppError';
import { container } from 'tsyringe';
import PinoProvider from '@shared/providers/logs/implementations/LogProvider';
import { randomUUID } from 'node:crypto';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ErrorHandler: ErrorRequestHandler = (error, request, response, _next) => {
  const logger = container.resolve<PinoProvider>('LogProvider');
  const requestId = randomUUID();

  if (error instanceof AppError) {
    response.status(error.statusCode).json({
      status: 'error',
      message: error.message,
      date: moment().format('YYYY-MM-DD HH:mm'),
    });
    logger.error({
      message: error.message,
      context: error.context,
      metadata: {
        method: request.method,
        url: request.url,
      },
      requestIp: request.ip,
      requestId,
    });

    return;
  }

  logger.error({
    message: 'Internal server error',
    requestIp: request.ip,
    requestId,
    metadata: {
      method: request.method,
      url: request.originalUrl,
      stack: error.stack,
    },
  });

  response.status(500).json({
    status: 'error',
    message: `Internal server error: ${requestId}`,
    date: moment().format('YYYY-MM-DD HH:mm'),
  });
};

export { ErrorHandler };
