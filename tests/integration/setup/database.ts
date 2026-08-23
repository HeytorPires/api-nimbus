import { Connection, getConnection } from 'typeorm';
import { container } from 'tsyringe';
import { Redis } from 'ioredis';

import RedisCache from '@shared/providers/cache/implementations/RedisCache';

export function connection(): Connection {
  return getConnection();
}

/**
 * Cliente Redis do container. É o mesmo cliente que o `rateLimiter` usa, então
 * limpá-lo aqui também zera os contadores de rate limit entre testes.
 */
export function redisClient(): Redis {
  return container.resolve<RedisCache>('CacheProvider').getClient();
}

/**
 * Esvazia todas as tabelas de domínio, reiniciando sequências.
 *
 * A lista de tabelas vem das entidades registradas na conexão, então entidade
 * nova é limpa automaticamente. A ordem não importa: `CASCADE` cuida das
 * dependências entre tabelas.
 */
export async function truncateAll(): Promise<void> {
  const tables = connection().entityMetadatas.map(
    (entity) => `"${entity.tableName}"`
  );

  if (!tables.length) return;

  await connection().query(
    `TRUNCATE TABLE ${tables.join(', ')} RESTART IDENTITY CASCADE`
  );
}

/** Apaga tudo do Redis: sessões (`session:<id>`) e contadores de rate limit. */
export async function flushRedis(): Promise<void> {
  await redisClient().flushdb();
}
