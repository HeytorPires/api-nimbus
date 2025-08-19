// import '@modules/users/providers';
import { container } from 'tsyringe';
import RedisCache from '@shared/providers/cache/implementations/RedisCache';

//repositories
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';
import BcryptHashProvider from '@shared/providers/cryptography/implementations/BcryptHashProvider';
import cryptoProvider from '@shared/providers/cryptography/implementations/cryptoProvider';
import UserTokensRepository from '@modules/users/infra/typeorm/repositories/UserTokensRepository';
import TasksRepository from '@modules/tasks/infra/typeorm/repositories/TasksRepository';

//Dominios
import { IUserRepository } from '@modules/users/domain/repositories/IUserRepository';
import { IUserTokensRepository } from '@modules/users/domain/repositories/IUserTokensRepository';
import { ICacheProvider } from '@shared/providers/cache/models/IRedisProvider';
import { IHashProvider } from '@shared/providers/Cryptography/models/IHashProvider';
import { ICryptographyProvider } from '@shared/providers/cryptography/models/ICryptographyProvider';
import { ITaskRepository } from '@modules/tasks/domain/repositories/ITaskRepository';


container.registerSingleton<IUserRepository>(
    'UsersRepository',
    UsersRepository
);
container.registerSingleton<IUserTokensRepository>(
    'UsersTokensRepository',
    UserTokensRepository
);
container.registerSingleton<ITaskRepository>(
    'TasksRepository',
    TasksRepository
);

// providers
container.registerSingleton<ICacheProvider>('cacheProvider', RedisCache);
container.registerSingleton<IHashProvider>('HashProvider', BcryptHashProvider);
container.registerSingleton<ICryptographyProvider>('CryptoProvider', cryptoProvider);

