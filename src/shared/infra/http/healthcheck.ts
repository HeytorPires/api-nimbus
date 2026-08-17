import { Request, Response } from 'express';
import { getConnection } from 'typeorm';
import { container } from 'tsyringe';
import RedisCache from '@shared/providers/cache/implementations/RedisCache';

async function checkPostgres(): Promise<boolean> {
  try {
    const connection = getConnection();
    await connection.query('SELECT 1');
    return true;
  } catch {
    return false;
  }
}

async function checkRedis(): Promise<boolean> {
  try {
    const redisCache = container.resolve<RedisCache>('CacheProvider');
    const pong = await redisCache.getClient().ping();
    return pong === 'PONG';
  } catch {
    return false;
  }
}

export function healthHandler(req: Request, res: Response): void {
  res.status(200).json({ status: 'ok', uptime: process.uptime() });
}

export async function readyHandler(req: Request, res: Response): Promise<void> {
  const [postgres, redis] = await Promise.all([checkPostgres(), checkRedis()]);
  const healthy = postgres && redis;

  res.status(healthy ? 200 : 503).json({
    status: healthy ? 'ready' : 'not ready',
    checks: { postgres, redis },
  });
}
