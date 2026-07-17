import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import AppError from '@shared/errors/AppError';
import RedisCache from '@shared/providers/cache/implementations/RedisCache';

let limiter: RateLimiterRedis;

function initializeLimiter(): void {
  if (limiter) return;

  const redisCache = container.resolve<RedisCache>('CacheProvider');
  limiter = new RateLimiterRedis({
    storeClient: redisCache.getClient(),
    keyPrefix: 'ratelimit:refresh',
    points: 10, // máximo 10 requisições

    duration: 15 * 60, // a cada 15 minutos
  });
}

export default async function refreshTokenRateLimiter(
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> {
  initializeLimiter();

  try {
    await limiter.consume(request.ip || '0.0.0.0');
    return next();
  } catch {
    throw new AppError(
      'Too many refresh attempts. Try again later.',
      'refreshTokenRateLimiter',
      429
    );
  }
}
