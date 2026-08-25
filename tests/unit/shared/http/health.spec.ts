import request from 'supertest';

jest.mock('@shared/infra/typeorm', () => ({}));

const mockPing = jest.fn();

jest.mock('@shared/providers/cache/implementations/RedisCache', () =>
  jest.fn().mockImplementation(() => ({
    getClient: () => ({ ping: mockPing }),
    save: jest.fn(),
    recover: jest.fn(),
    invalidate: jest.fn(),
  }))
);

jest.mock('typeorm', () => ({
  ...jest.requireActual('typeorm'),
  getConnection: jest.fn(),
}));

jest.mock('@shared/infra/http/middleware/rateLimiter', () => ({
  __esModule: true,
  default: (
    req: import('express').Request,
    res: import('express').Response,
    next: import('express').NextFunction
  ) => next(),
}));

import { getConnection } from 'typeorm';
import app from '@shared/infra/http/app';

describe('Health and readiness endpoints', () => {
  it('should always return 200 on /health', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
  });

  it('should return 200 on /ready when Postgres and Redis are up', async () => {
    (getConnection as jest.Mock).mockReturnValue({
      query: jest.fn().mockResolvedValue([{ '?column?': 1 }]),
    });
    mockPing.mockResolvedValue('PONG');

    const response = await request(app).get('/ready');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: 'ready',
      checks: { postgres: true, redis: true },
    });
  });

  it('should return 503 on /ready when Redis is down', async () => {
    (getConnection as jest.Mock).mockReturnValue({
      query: jest.fn().mockResolvedValue([{ '?column?': 1 }]),
    });
    mockPing.mockRejectedValue(new Error('connection refused'));

    const response = await request(app).get('/ready');

    expect(response.status).toBe(503);
    expect(response.body).toEqual({
      status: 'not ready',
      checks: { postgres: true, redis: false },
    });
  });
});
