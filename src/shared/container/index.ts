// import '@modules/users/providers';
import { container } from 'tsyringe';
import RedisCache from '@shared/providers/cache/implementations/RedisCache';

//repositories
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';
import BcryptHashProvider from '@shared/providers/cryptography/implementations/BcryptHashProvider';
import cryptoProvider from '@shared/providers/cryptography/implementations/CryptoProvider';
import UserTokensRepository from '@modules/users/infra/typeorm/repositories/UserTokensRepository';
import ProjectsRepository from '@modules/projects/infra/typeorm/repositories/ProjectsRepository';
import TagsRepository from '@modules/tags/infra/typeorm/repositories/TagsRepository';

//Dominios
import { IUserRepository } from '@modules/users/domain/repositories/IUserRepository';
import { IUserTokensRepository } from '@modules/users/domain/repositories/IUserTokensRepository';
import { ICacheProvider } from '@shared/providers/cache/models/IRedisProvider';
import { IHashProvider } from '@shared/providers/cryptography/models/IHashProvider';
import { ICryptographyProvider } from '@shared/providers/cryptography/models/ICryptographyProvider';
import { IProjectRepository } from '@modules/projects/domain/repositories/IProjectRepository';
import { ITagRepository } from '@modules/tags/domain/repositories/ITagRepository';

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
container.registerSingleton<ICacheProvider>('cacheProvider', RedisCache);
container.registerSingleton<IHashProvider>('HashProvider', BcryptHashProvider);
container.registerSingleton<ICryptographyProvider>(
  'CryptoProvider',
  cryptoProvider
);

