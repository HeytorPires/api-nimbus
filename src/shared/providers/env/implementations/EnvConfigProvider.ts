import { IEnvConfigProvider } from '../models/IEnvConfigProvider';

export const ENV_VARIABLE = {
  NODE_ENV: 'NODE_ENV',
  API_PORT: 'API_PORT',
  APP_SECRET: 'APP_SECRET',
  REFRESH_TOKEN_SECRET: 'REFRESH_TOKEN_SECRET',
  CRYPTO_SECRET_KEY: 'CRYPTO_SECRET_KEY',
  APP_API_URL: 'APP_API_URL',
  APP_WEB_URL: 'APP_WEB_URL',
  CORS_ORIGIN: 'CORS_ORIGIN',
  DB_HOST: 'DB_HOST',
  DB_PORT: 'DB_PORT',
  DB_USER: 'DB_USER',
  DB_PASSWORD: 'DB_PASSWORD',
  DB_NAME: 'DB_NAME',
  REDIS_HOST: 'REDIS_HOST',
  REDIS_PORT: 'REDIS_PORT',
  MAIL_DRIVER: 'MAIL_DRIVER',
  RESEND_API_KEY: 'RESEND_API_KEY',
  RESEND_WEBHOOK_SECRET: 'RESEND_WEBHOOK_SECRET',
  MAIL_HOST: 'MAIL_HOST',
  MAIL_PORT: 'MAIL_PORT',
  MAIL_USER: 'MAIL_USER',
  MAIL_PASS: 'MAIL_PASS',
  STORAGE_DISK: 'STORAGE_DISK',
  S3_ENDPOINT: 'S3_ENDPOINT',
  S3_ACCESS_KEY: 'S3_ACCESS_KEY',
  S3_SECRET_KEY: 'S3_SECRET_KEY',
  S3_BUCKET: 'S3_BUCKET',
} as const;

export type EnvVariable = (typeof ENV_VARIABLE)[keyof typeof ENV_VARIABLE];

const MAIL_DRIVERS = ['resend', 'smtp', 'ethereal'];
const STORAGE_DISKS = ['local', 's3'];

// Obrigatórias em qualquer ambiente.
const ALWAYS_REQUIRED: EnvVariable[] = [
  ENV_VARIABLE.APP_SECRET,
  ENV_VARIABLE.REFRESH_TOKEN_SECRET,
  ENV_VARIABLE.CRYPTO_SECRET_KEY,
  ENV_VARIABLE.APP_API_URL,
  ENV_VARIABLE.APP_WEB_URL,
];

// Têm default em desenvolvimento; em produção precisam ser informadas.
const PRODUCTION_REQUIRED: EnvVariable[] = [
  ENV_VARIABLE.CORS_ORIGIN,
  ENV_VARIABLE.DB_HOST,
  ENV_VARIABLE.DB_USER,
  ENV_VARIABLE.DB_PASSWORD,
  ENV_VARIABLE.DB_NAME,
  ENV_VARIABLE.REDIS_HOST,
];

// Dependem do provider escolhido por MAIL_DRIVER / STORAGE_DISK.
const REQUIRED_BY_MAIL_DRIVER: Record<string, EnvVariable[]> = {
  resend: [ENV_VARIABLE.RESEND_API_KEY, ENV_VARIABLE.RESEND_WEBHOOK_SECRET],
  smtp: [
    ENV_VARIABLE.MAIL_HOST,
    ENV_VARIABLE.MAIL_PORT,
    ENV_VARIABLE.MAIL_USER,
    ENV_VARIABLE.MAIL_PASS,
  ],
};

const REQUIRED_BY_STORAGE_DISK: Record<string, EnvVariable[]> = {
  s3: [
    ENV_VARIABLE.S3_ENDPOINT,
    ENV_VARIABLE.S3_ACCESS_KEY,
    ENV_VARIABLE.S3_SECRET_KEY,
    ENV_VARIABLE.S3_BUCKET,
  ],
};

export default class EnvConfigProvider implements IEnvConfigProvider {
  get(name: EnvVariable): string | undefined {
    return process.env[name];
  }

  /**
   * Junta tudo que falta ou está inválido e lança um único erro, para o
   * problema aparecer inteiro no boot em vez de uma variável por vez.
   */
  validate(): void {
    const missing = this.findMissing();
    const invalid = this.findInvalid();
    const problems: string[] = [];

    if (missing.length > 0) {
      problems.push(`Missing environment variables: ${missing.join(', ')}`);
    }

    if (invalid.length > 0) {
      problems.push(`Invalid environment variables: ${invalid.join(', ')}`);
    }

    if (problems.length > 0) {
      throw new Error(problems.join('. '));
    }
  }

  private findMissing(): EnvVariable[] {
    const required = new Set<EnvVariable>(ALWAYS_REQUIRED);

    if (this.get(ENV_VARIABLE.NODE_ENV) === 'production') {
      PRODUCTION_REQUIRED.forEach((name) => required.add(name));
    }

    const mailDriver = this.get(ENV_VARIABLE.MAIL_DRIVER) ?? '';
    (REQUIRED_BY_MAIL_DRIVER[mailDriver] ?? []).forEach((name) =>
      required.add(name)
    );

    const storageDisk = this.get(ENV_VARIABLE.STORAGE_DISK) ?? '';
    (REQUIRED_BY_STORAGE_DISK[storageDisk] ?? []).forEach((name) =>
      required.add(name)
    );

    return [...required].filter((name) => !this.get(name));
  }

  private findInvalid(): string[] {
    const invalid: string[] = [];

    const cryptoKey = this.get(ENV_VARIABLE.CRYPTO_SECRET_KEY);
    if (cryptoKey && !/^[0-9a-fA-F]{64}$/.test(cryptoKey)) {
      invalid.push(
        `${ENV_VARIABLE.CRYPTO_SECRET_KEY} (must be 64 hexadecimal characters)`
      );
    }

    const mailDriver = this.get(ENV_VARIABLE.MAIL_DRIVER);
    if (mailDriver && !MAIL_DRIVERS.includes(mailDriver)) {
      invalid.push(
        `${ENV_VARIABLE.MAIL_DRIVER} (use ${MAIL_DRIVERS.join(', ')})`
      );
    }

    const storageDisk = this.get(ENV_VARIABLE.STORAGE_DISK);
    if (storageDisk && !STORAGE_DISKS.includes(storageDisk)) {
      invalid.push(
        `${ENV_VARIABLE.STORAGE_DISK} (use ${STORAGE_DISKS.join(', ')})`
      );
    }

    return invalid;
  }
}
