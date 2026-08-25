import { Connection, createConnection, getConnectionManager } from 'typeorm';

// Registra os providers/repositórios no tsyringe antes de qualquer teste, para
// que `redisClient()` resolva o mesmo RedisCache que o app usa.
import '@shared/container';

import { flushRedis, redisClient, truncateAll } from './database';
import testOrmConfig from './ormconfig';

const silenceLogs = process.env.TEST_LOGS !== 'true';
const originalConsole = { log: console.log, error: console.error };

/**
 * Abre a conexão default esperando a infra subir.
 *
 * Precisa acontecer antes da primeira request: os repositórios são singletons
 * que chamam `getRepository()` no construtor.
 */
// attempts fica abaixo do testTimeout (30s) de propósito: se estourar o hook, o
// Jest reporta "Exceeded timeout" e esconde a mensagem útil sobre a infra.
async function connectWithRetry(attempts = 10): Promise<Connection> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await createConnection(testOrmConfig);
    } catch (error) {
      lastError = error;
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  throw new Error(
    `Postgres de teste indisponível após ${attempts}s. ` +
      `Suba a infra com "yarn test:integration:up". Último erro: ${String(lastError)}`
  );
}

beforeAll(async () => {
  if (silenceLogs) {
    // O LogProvider escreve JSON no console em toda request e todo erro.
    console.log = () => {};
    console.error = () => {};
  }

  const connection = getConnectionManager().has('default')
    ? getConnectionManager().get('default')
    : await connectWithRetry();

  // Idempotente: nas execuções seguintes o TypeORM só lê a tabela migrations.
  await connection.runMigrations();
});

beforeEach(async () => {
  await truncateAll();
  await flushRedis();
});

afterAll(async () => {
  const manager = getConnectionManager();

  if (manager.has('default') && manager.get('default').isConnected) {
    await manager.get('default').close();
  }

  await redisClient().quit();

  if (silenceLogs) {
    console.log = originalConsole.log;
    console.error = originalConsole.error;
  }
});
