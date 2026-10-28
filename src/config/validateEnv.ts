import EnvConfigProvider from '@shared/providers/env/implementations/EnvConfigProvider';

/**
 * Valida o ambiente no boot. Importado em server.ts entre o dotenv e o app:
 * o app lê process.env no import (container, typeorm, config/auth), então a
 * checagem precisa rodar antes dele.
 */
try {
  new EnvConfigProvider().validate();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
