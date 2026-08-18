import { requestContext } from '@config/context';
import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'node:crypto';

export default async function requestContextMiddleware(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const id = randomUUID();
  request.id = id;

  requestContext.run({ requestId: id, requestIp: String(request.ip) }, () => {
    next();
  });
}
