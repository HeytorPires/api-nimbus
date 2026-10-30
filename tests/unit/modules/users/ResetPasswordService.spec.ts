import 'reflect-metadata';
import { container } from 'tsyringe';
import CreateUserService from '@modules/users/services/CreateUserService';
import SendWelcomeEmailService from '@modules/users/services/SendWelcomeEmailService';
import FakeUsersRepository from '@tests/support/fakes/FakeUsersRepository';
import ResetPasswordService from '@modules/users/services/ResetPasswordservice';
import FakeUsersTokensRepository from '@tests/support/fakes/FakeUsersTokensRepository';
import FakeHashProvider from '@tests/support/fakes/FakeHashProvider';
import CreateSessionsService from '@modules/users/services/CreateSessionsService';
import AppError from '@shared/errors/AppError';
import FakeLogProvider from '@tests/support/fakes/FakeLogProvider';
import FakeCacheProvider from '@tests/support/fakes/FakeCacheProvider';
import FakeUserTokenRepository from '@tests/support/fakes/FakeUsersTokensRepository';
import FakeStorageProvider from '@tests/support/fakes/FakeStorageProvider';
import FakeJWTProvider from '@tests/support/fakes/FakeJWTProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeUsersTokensRepository: FakeUsersTokensRepository;
let CreateUser: CreateUserService;
let ResetPassword: ResetPasswordService;
let hashProvider: FakeHashProvider;
let createSession: CreateSessionsService;

describe('Create User', () => {
  beforeEach(() => {
    container.registerInstance('StorageProvider', new FakeStorageProvider());
    hashProvider = new FakeHashProvider();
    fakeUsersRepository = new FakeUsersRepository();
    fakeUsersTokensRepository = new FakeUsersTokensRepository();
    createSession = new CreateSessionsService(
      fakeUsersRepository,
      new FakeUserTokenRepository(),
      new FakeJWTProvider(),
      hashProvider,
      new FakeLogProvider(),
      new FakeCacheProvider()
    );
    CreateUser = new CreateUserService(
      fakeUsersRepository,
      hashProvider,
      new FakeLogProvider(),
      { execute: jest.fn() } as unknown as SendWelcomeEmailService
    );
    ResetPassword = new ResetPasswordService(
      fakeUsersRepository,
      fakeUsersTokensRepository,
      new FakeLogProvider()
    );
  });

  it('should be able to reset a password', async () => {
    const User = await CreateUser.execute({
      name: 'João silva',
      email: 'João@gmail.com',
      password: '123456',
    });

    await createSession.execute({
      email: 'João@gmail.com',
      password: '123456',
    });

    const response = await fakeUsersTokensRepository.generate(User.id);
    const { token } = response;

    await ResetPassword.execute({ token, password: '123456' });
    expect(User).toHaveProperty('email');
  });
  it('should not be able to create two users with the same email', async () => {
    await CreateUser.execute({
      name: 'João silva',
      email: 'João@gmail.com',
      password: '123456',
    });
    expect(
      CreateUser.execute({
        name: 'João silva',
        email: 'João@gmail.com',
        password: '123456',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
