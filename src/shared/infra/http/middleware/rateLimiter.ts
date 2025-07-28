import 'dotenv/config';
import { Request, Response, NextFunction } from 'express';
import redis from 'redis';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import AppError from '@shared/errors/AppError';

export default async function rateLimiter(
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> {
  try {
    const redisHost = process.env.REDIS_HOST ?? 'localhost'; // Fornece localhost como fallback
    const redisPort = process.env.REDIS_PORT
      ? Number(process.env.REDIS_PORT)
      : 6379;

    const redisClient = redis.createClient({
      legacyMode: true,
      password: process.env.REDIS_PASS || undefined,
      socket: {
        host: redisHost,
        port: redisPort,
      },
    });

    await redisClient.connect();

    const limiter = new RateLimiterRedis({
      storeClient: redisClient,
      keyPrefix: 'ratelimit',
      points: 100, // rqs por segundo
      duration: 1, //segundo
    });

    await limiter.consume(request.ip!);

    return next();
  } catch (err) {
    throw new AppError('Too many requests.', 429);
  }
}
