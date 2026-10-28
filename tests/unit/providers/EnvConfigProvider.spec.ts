import EnvConfigProvider, {
  ENV_VARIABLE,
} from '@shared/providers/env/implementations/EnvConfigProvider';

const validEnv: Record<string, string> = {
  NODE_ENV: 'development',
  APP_SECRET: 'secret',
  REFRESH_TOKEN_SECRET: 'refresh-secret',
  CRYPTO_SECRET_KEY: 'a'.repeat(64),
  APP_API_URL: 'http://localhost:3333',
  APP_WEB_URL: 'http://localhost:5173',
};

const originalEnv = process.env;

beforeEach(() => {
  process.env = { ...validEnv };
});

afterEach(() => {
  process.env = originalEnv;
});

describe('EnvConfigProvider', () => {
  const provider = new EnvConfigProvider();

  describe('get', () => {
    it('should return the value of the variable', () => {
      expect(provider.get(ENV_VARIABLE.APP_SECRET)).toBe('secret');
    });

    it('should return undefined when the variable is not set', () => {
      expect(provider.get(ENV_VARIABLE.RESEND_API_KEY)).toBeUndefined();
    });
  });

  describe('validate', () => {
    it('should not throw when every required variable is set', () => {
      expect(() => provider.validate()).not.toThrow();
    });

    it('should list every missing variable in a single error', () => {
      process.env.APP_SECRET = '';
      delete process.env.CRYPTO_SECRET_KEY;

      expect(() => provider.validate()).toThrow(
        'Missing environment variables: APP_SECRET, CRYPTO_SECRET_KEY'
      );
    });

    it('should reject a CRYPTO_SECRET_KEY that is not 64 hex characters', () => {
      process.env.CRYPTO_SECRET_KEY = 'abc';

      expect(() => provider.validate()).toThrow(
        'Invalid environment variables: CRYPTO_SECRET_KEY'
      );
    });

    it('should report missing and invalid variables together', () => {
      delete process.env.APP_SECRET;
      process.env.CRYPTO_SECRET_KEY = 'z'.repeat(64);

      expect(() => provider.validate()).toThrow(
        /Missing environment variables: APP_SECRET\. Invalid environment variables: CRYPTO_SECRET_KEY/
      );
    });

    describe('production', () => {
      it('should require database, redis and cors settings', () => {
        process.env.NODE_ENV = 'production';

        expect(() => provider.validate()).toThrow(
          'Missing environment variables: CORS_ORIGIN, DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, REDIS_HOST'
        );
      });

      it('should not require them in development', () => {
        process.env.NODE_ENV = 'development';

        expect(() => provider.validate()).not.toThrow();
      });
    });

    describe('MAIL_DRIVER', () => {
      it('should require RESEND_API_KEY for resend', () => {
        process.env.MAIL_DRIVER = 'resend';

        expect(() => provider.validate()).toThrow(
          'Missing environment variables: RESEND_API_KEY'
        );
      });

      it('should require the SMTP settings for smtp', () => {
        process.env.MAIL_DRIVER = 'smtp';

        expect(() => provider.validate()).toThrow(
          'Missing environment variables: MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASS'
        );
      });

      it('should not require mail settings for ethereal', () => {
        process.env.MAIL_DRIVER = 'ethereal';

        expect(() => provider.validate()).not.toThrow();
      });

      it('should reject an unknown driver', () => {
        process.env.MAIL_DRIVER = 'sendgrid';

        expect(() => provider.validate()).toThrow(
          'Invalid environment variables: MAIL_DRIVER'
        );
      });
    });

    describe('STORAGE_DISK', () => {
      it('should require the S3 settings for s3', () => {
        process.env.STORAGE_DISK = 's3';

        expect(() => provider.validate()).toThrow(
          'Missing environment variables: S3_ENDPOINT, S3_ACCESS_KEY, S3_SECRET_KEY, S3_BUCKET'
        );
      });

      it('should not require S3 settings for local', () => {
        process.env.STORAGE_DISK = 'local';

        expect(() => provider.validate()).not.toThrow();
      });

      it('should reject an unknown disk', () => {
        process.env.STORAGE_DISK = 'gcs';

        expect(() => provider.validate()).toThrow(
          'Invalid environment variables: STORAGE_DISK'
        );
      });
    });
  });
});
