/**
 * Stub de `@shared/infra/typeorm`.
 *
 * O módulo original (src/shared/infra/typeorm/index.ts) chama `createConnection`
 * como side effect do import, sem `await` e sem expor a Promise. Nos testes de
 * integração quem controla o ciclo de vida da conexão é `hooks.ts`, então o
 * `moduleNameMapper` de jest.config.integration.ts redireciona aquele import
 * para cá — evitando uma segunda conexão órfã que o teste não poderia fechar.
 */
export {};
