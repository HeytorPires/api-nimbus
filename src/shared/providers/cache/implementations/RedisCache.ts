import Redis, { Redis as RedisClient } from 'ioredis';

export default class RedisCache {
  private readonly client: RedisClient;

  constructor() {
    this.client = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: Number(process.env.REDIS_PORT) || 6379,
      password: process.env.REDIS_PASS || undefined,
    });
  }

  public getClient(): RedisClient {
    return this.client;
  }

  public async save(key: string, value: any, seconds = 60): Promise<void> {
    await this.client.set(key, JSON.stringify(value), 'EX', seconds);
  }

  public async recover<T>(key: string): Promise<T | null> {
    const data = await this.client.get(key);

    if (!data) {
      return null;
    }

    const parsedData = JSON.parse(data);

    return parsedData;
  }

  public async invalidate(key: string): Promise<void> {
    await this.client.del(key);
  }
}
