import { ICacheProvider } from '@shared/providers/cache/models/IRedisProvider';

export default class FakeCacheProvider implements ICacheProvider {
  private cache: Record<string, string> = {};

  public async save(key: string, value: any): Promise<void> {
    this.cache[key] = JSON.stringify(value);
  }

  public async recover<T>(key: string): Promise<T | null> {
    const data = this.cache[key];

    if (!data) {
      return null;
    }

    return JSON.parse(data) as T;
  }

  public async invalidate(key: string): Promise<void> {
    delete this.cache[key];
  }
}
