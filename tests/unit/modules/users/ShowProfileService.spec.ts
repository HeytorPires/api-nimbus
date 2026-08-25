import 'reflect-metadata';
import { container } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/FakeUsersRepository';
import ShowProfileService from '@modules/users/services/ShowProfileService';
import CreateUserService from '@modules/users/services/CreateUserService';
import CreateSessionsService from '@modules/users/services/CreateSessionsService';
import FakeLogProvider from '../../../providers/fakes/FakeLogProvider';
import FakeCacheProvider from '../../../providers/fakes/FakeCacheProvider';
import FakeUserTokenRepository from '../repositories/FakeUsersTokensRepository';
import FakeStorageProvider from '../../../providers/fakes/FakeStorageProvider';
import FakeJWTProvider from '../../../providers/fakes/FakeJWTProvider';
import FakeHashProvider from '../../../providers/fakes/FakeHashProvider';

let fakeUsersRepository: FakeUsersRepository;
let showProfile: ShowProfileService;
let createSession: CreateSessionsService;
let createUser: CreateUserService;
let hashProvider: FakeHashProvider;

describe('Show Customer', () => {
  beforeEach(() => {
    container.registerInstance('StorageProvider', new FakeStorageProvider());
    hashProvider = new FakeHashProvider();
    fakeUsersRepository = new FakeUsersRepository();
    showProfile = new ShowProfileService(fakeUsersRepository);
    createUser = new CreateUserService(fakeUsersRepository, hashProvider);
    createSession = new CreateSessionsService(
      fakeUsersRepository,
      new FakeUserTokenRepository(),
      new FakeJWTProvider(),
      hashProvider,
      new FakeLogProvider(),
      new FakeCacheProvider()
    );
  });
  it('should not show customer when not exist ', async () => {
    const id = '123456789abcd';

    await expect(showProfile.execute(id)).rejects.toBeInstanceOf(AppError);
  });
  it('should be able to show existent user', async () => {
    const createdUser = await createUser.execute({
      name: 'João silva',
      email: 'João@gmail.com',
      password: '123456',
    });

    await createSession.execute({
      email: 'João@gmail.com',
      password: '123456',
    });

    const customerShow = await showProfile.execute(createdUser.id);
    expect(customerShow).toHaveProperty('id');
  });
});
