import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import AppError from '@shared/errors/AppError';
import RedisCache from '@shared/providers/cache/implementations/RedisCache';

const redisCache = container.resolve<RedisCache>('CacheProvider');

const limiter = new RateLimiterRedis({
  storeClient: redisCache.getClient(),
  keyPrefix: 'ratelimit',
  points: 100,
  duration: 1,
});

export default async function rateLimiter(
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> {
  try {
    await limiter.consume(request.ip!);

    return next();
  } catch (error) {
    console.log(error);
    throw new AppError('Too many requests.', 'RateLimiter', 429);
  }
}
