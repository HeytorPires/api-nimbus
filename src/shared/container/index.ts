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
import NodeMailerProvider from '@shared/providers/email/implementations/NodeMailerProvider';
import LocalStorageProvider from '@shared/providers/storage/implementations/LocalStorageProvider';
import MinioStorageProvider from '@shared/providers/storage/implementations/MinioStorageProvider';

//Dominios
import { IUserRepository } from '@modules/users/domain/repositories/IUserRepository';
import { IUserTokensRepository } from '@modules/users/domain/repositories/IUserTokensRepository';
import { ICacheProvider } from '@shared/providers/cache/models/ICacheProvider';
import { IHashProvider } from '@shared/providers/cryptography/models/IHashProvider';
import { ICryptographyProvider } from '@shared/providers/cryptography/models/ICryptographyProvider';
import { IProjectRepository } from '@modules/projects/domain/repositories/IProjectRepository';
import { ITagRepository } from '@modules/tags/domain/repositories/ITagRepository';
import { ISmtpProvider } from '@shared/providers/email/models/ISmtpProvider';
import { ILogProvider } from '@shared/providers/logs/models/ILogProvider';
import { IStorageProvider } from '@shared/providers/storage/models/IStorageProvider';

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

// providers
container.registerSingleton<ICacheProvider>('CacheProvider', RedisCache);
container.registerSingleton<IHashProvider>('HashProvider', BcryptHashProvider);
container.registerSingleton<ICryptographyProvider>(
  'CryptoProvider',
  cryptoProvider
);
container.registerSingleton<ISmtpProvider>('EmailProvider', NodeMailerProvider);

container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  process.env.STORAGE_DISK === 'minio'
    ? MinioStorageProvider
    : LocalStorageProvider
);

container.registerSingleton<ILogProvider>('LogProvider', LogProvider);
