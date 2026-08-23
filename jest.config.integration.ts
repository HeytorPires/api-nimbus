import { pathsToModuleNameMapper } from 'ts-jest';
import type { InitialOptionsTsJest } from 'ts-jest';

const paths = {
  '@shared/*': ['src/shared/*'],
  '@modules/*': ['src/modules/*'],
  '@config/*': ['src/config/*'],
  '@utils/*': ['src/utils/*'],
  '@tests/*': ['tests/*'],
  '@docs/*': ['src/docs/*'],
};

const config: InitialOptionsTsJest = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/tests/integration/**/*.spec.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/build/'],

  moduleNameMapper: {
    // Precisa vir ANTES do alias genérico '@shared/(.*)': neutraliza o
    // createConnection disparado no import de src/shared/infra/typeorm.
    '^@shared/infra/typeorm$':
      '<rootDir>/tests/integration/setup/typeormStub.ts',
    ...pathsToModuleNameMapper(paths, { prefix: '<rootDir>/' }),
  },

  setupFiles: ['reflect-metadata', '<rootDir>/tests/integration/setup/env.ts'],
  setupFilesAfterEnv: ['<rootDir>/tests/integration/setup/hooks.ts'],

  collectCoverage: false,
  clearMocks: true,
  testTimeout: 30000,
  // Banco e Redis são compartilhados: o TRUNCATE de um worker quebraria o outro.
  maxWorkers: 1,
};

export default config;
