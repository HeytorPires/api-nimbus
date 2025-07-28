import '@modules/users/providers';
import { container } from 'tsyringe';
import RedisCache from '@shared/providers/cache/implementations/RedisCache';

//repositories
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';
import UserTokensRepository from '@modules/users/infra/typeorm/repositories/UserTokensRepository';

//Dominios
import { IUserRepository } from '@modules/users/domain/repositories/IUserRepository';
import { IUserTokensRepository } from '@modules/users/domain/repositories/IUserTokensRepository';
import { ICacheProvider } from '@shared/providers/cache/models/IRedisProvider';


container.registerSingleton<IUserRepository>(
  'UsersRepository',
  UsersRepository
);
container.registerSingleton<IUserTokensRepository>(
  'UsersTokensRepository',
  UserTokensRepository
);

container.registerSingleton<ICacheProvider>('cacheProvider', RedisCache);
