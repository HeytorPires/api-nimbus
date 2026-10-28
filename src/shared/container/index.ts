import { container } from 'tsyringe';

//providers
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';
import BcryptHashProvider from '@shared/providers/cryptography/implementations/BcryptHashProvider';
import cryptoProvider from '@shared/providers/cryptography/implementations/CryptoProvider';
import UserTokensRepository from '@modules/users/infra/typeorm/repositories/UserTokensRepository';
import ProjectsRepository from '@modules/projects/infra/typeorm/repositories/ProjectsRepository';
import TagsRepository from '@modules/tags/infra/typeorm/repositories/TagsRepository';
import LogProvider from '@shared/providers/logs/implementations/LogProvider';
import RedisCache from '@shared/providers/cache/implementations/RedisCache';
import SmtpEmailProvider from '@shared/providers/email/implementations/smtp/SmtpEmailProvider';
import EtherealEmailProvider from '@shared/providers/email/implementations/smtp/EtherealEmailProvider';
import ResendEmailProvider from '@shared/providers/email/implementations/api/ResendEmailProvider';
import LocalStorageProvider from '@shared/providers/storage/implementations/LocalStorageProvider';
import S3StorageProvider from '@shared/providers/storage/implementations/S3StorageProvider';
import EnvConfigProvider from '@shared/providers/env/implementations/EnvConfigProvider';
import CookieProvider from '@shared/providers/cookie/implementations/CookieProvider';

//Dominios
import { IUserRepository } from '@modules/users/domain/repositories/IUserRepository';
import { IUserTokensRepository } from '@modules/users/domain/repositories/IUserTokensRepository';
import { ICacheProvider } from '@shared/providers/cache/models/ICacheProvider';
import { IHashProvider } from '@shared/providers/cryptography/models/IHashProvider';
import { ICryptographyProvider } from '@shared/providers/cryptography/models/ICryptographyProvider';
import { IProjectRepository } from '@modules/projects/domain/repositories/IProjectRepository';
import { ITagRepository } from '@modules/tags/domain/repositories/ITagRepository';
import { IEmailProvider } from '@shared/providers/email/models/IEmailProvider';
import { ILogProvider } from '@shared/providers/logs/models/ILogProvider';
import { IStorageProvider } from '@shared/providers/storage/models/IStorageProvider';
import { IEnvConfigProvider } from '@shared/providers/env/models/IEnvConfigProvider';
import { ICookieProvider } from '@shared/providers/cookie/models/ICookieProvider';
import JsonWebTokenProvider from '@shared/providers/jwt/implementations/JsonWebTokenProvider';
import { IJWTProvider } from '@shared/providers/jwt/models/IJWTProvider';
import RefreshTokenService from '@modules/users/services/RefreshTokenService';

container.registerSingleton<IUserRepository>(
  'UsersRepository',
  UsersRepository
);
container.registerSingleton<IUserTokensRepository>(
  'UsersTokensRepository',
  UserTokensRepository
);
container.registerSingleton<IProjectRepository>(
  'ProjectsRepository',
  ProjectsRepository
);

container.registerSingleton<ITagRepository>('TagsRepository', TagsRepository);

//transient, criando uma instancia a cada injeção
container.register<RefreshTokenService>(RefreshTokenService, {
  useClass: RefreshTokenService,
});

// providers
container.registerSingleton<ICacheProvider>('CacheProvider', RedisCache);
container.registerSingleton<IHashProvider>('HashProvider', BcryptHashProvider);
container.registerSingleton<ICryptographyProvider>(
  'CryptoProvider',
  cryptoProvider
);

container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  process.env.STORAGE_DISK === 's3' ? S3StorageProvider : LocalStorageProvider
);

container.registerSingleton<IJWTProvider>('JWTProvider', JsonWebTokenProvider);
container.registerSingleton<ILogProvider>('LogProvider', LogProvider);
container.registerSingleton<ICookieProvider>('CookieProvider', CookieProvider);
container.registerSingleton<IEnvConfigProvider>(
  'EnvConfigProvider',
  EnvConfigProvider
);

let emailProvider:
  | typeof SmtpEmailProvider
  | typeof ResendEmailProvider
  | typeof EtherealEmailProvider;

emailProvider = EtherealEmailProvider;

switch (process.env.MAIL_DRIVER) {
  case 'smtp':
    emailProvider = SmtpEmailProvider;
    break;
  case 'resend':
    emailProvider = ResendEmailProvider;
    break;
  case 'ethereal':
    emailProvider = EtherealEmailProvider;
    break;
  default:
    emailProvider = EtherealEmailProvider;
}

container.registerSingleton<IEmailProvider>('EmailProvider', emailProvider);
