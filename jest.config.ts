import { pathsToModuleNameMapper } from 'ts-jest';
import type { InitialOptionsTsJest } from 'ts-jest';

/**
 * Config única das três suítes do projeto. Cada tipo de teste é um `project`
 * do Jest, com escopo declarado por `roots`:
 *
 *   tests/unit         -> serviços com fakes, sem I/O
 *   tests/integration  -> HTTP real (supertest) contra Postgres + Redis
 *   tests/e2e          -> reservado; nenhum spec ainda
 *
 * Rodar por tipo com `--selectProjects` (ver scripts do package.json). A
 * integração precisa de execução serial (o TRUNCATE de um worker derruba o
 * outro) e `maxWorkers` não é aceito dentro de `projects`, por isso a
 * serialização vem do `--runInBand` no script, não daqui.
 *
 * Este arquivo é autocontido de propósito: uma config Jest `.ts` é carregada
 * como ESM e um import relativo sem extensão falha com ERR_MODULE_NOT_FOUND.
 */

const paths = {
  '@shared/*': ['src/shared/*'],
  '@modules/*': ['src/modules/*'],
  '@config/*': ['src/config/*'],
  '@utils/*': ['src/utils/*'],
  '@tests/*': ['tests/*'],
  '@docs/*': ['src/docs/*'],
};

const aliases = pathsToModuleNameMapper(paths, { prefix: '<rootDir>/' });

const shared: InitialOptionsTsJest = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.spec.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/build/'],
  clearMocks: true,
};

const config: InitialOptionsTsJest = {
  // Opções de coverage só valem na raiz — o Jest as ignora dentro de projects.
  collectCoverageFrom: ['<rootDir>/src/modules/**/services/*.ts'],
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  coverageReporters: ['text-summary', 'lcov'],

  // O project e2e nasce vazio; sem isso a run inteira falha por "no tests found".
  passWithNoTests: true,

  projects: [
    {
      ...shared,
      displayName: 'unit',
      roots: ['<rootDir>/tests/unit'],
      moduleNameMapper: aliases,
      setupFiles: ['reflect-metadata'],
    },
    {
      ...shared,
      displayName: 'integration',
      roots: ['<rootDir>/tests/integration'],
      moduleNameMapper: {
        // Precisa vir ANTES do alias genérico '@shared/(.*)': neutraliza o
        // createConnection disparado no import de src/shared/infra/typeorm.
        '^@shared/infra/typeorm$':
          '<rootDir>/tests/support/setup/typeormStub.ts',
        ...aliases,
      },
      setupFiles: ['reflect-metadata', '<rootDir>/tests/support/setup/env.ts'],
      setupFilesAfterEnv: ['<rootDir>/tests/support/setup/hooks.ts'],
      testTimeout: 30000,
    },
    {
      ...shared,
      displayName: 'e2e',
      roots: ['<rootDir>/tests/e2e'],
      moduleNameMapper: aliases,
      setupFiles: ['reflect-metadata', '<rootDir>/tests/support/setup/env.ts'],
      // setupFilesAfterEnv entra junto com o primeiro spec e2e: o ciclo de vida
      // ainda não está definido (API compilada de verdade vs. app em memória).
      testTimeout: 60000,
    },
  ],
};

export default config;
