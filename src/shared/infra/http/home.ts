import { Request, Response } from 'express';

export function homeHandler(req: Request, res: Response): void {
  res.status(200).json({
    name: 'nimbus-api',
    status: 'ok',
    docs: '/api-docs',
    health: '/health',
    ready: '/ready',
  });
}
