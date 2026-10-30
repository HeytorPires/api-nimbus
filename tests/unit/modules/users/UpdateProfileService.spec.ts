import 'reflect-metadata';
import { container } from 'tsyringe';
import CreateUserService from '@modules/users/services/CreateUserService';
import SendWelcomeEmailService from '@modules/users/services/SendWelcomeEmailService';
import FakeUsersRepository from '@tests/support/fakes/FakeUsersRepository';
import FakefakeHashProvider from '@tests/support/fakes/FakeHashProvider';
import CreateSessionsService from '@modules/users/services/CreateSessionsService';
import AppError from '@shared/errors/AppError';
import UpdateProfileService from '@modules/users/services/UpdateProfileService';
import FakeLogProvider from '@tests/support/fakes/FakeLogProvider';
import FakeCacheProvider from '@tests/support/fakes/FakeCacheProvider';
import FakeUserTokenRepository from '@tests/support/fakes/FakeUsersTokensRepository';
import FakeStorageProvider from '@tests/support/fakes/FakeStorageProvider';
import FakeJWTProvider from '@tests/support/fakes/FakeJWTProvider';

let fakeUsersRepository: FakeUsersRepository;
let CreateUser: CreateUserService;
let createSession: CreateSessionsService;
let fakeHashProvider: FakefakeHashProvider;
let updateProfile: UpdateProfileService;

describe('Update profile', () => {
  beforeEach(() => {
    container.registerInstance('StorageProvider', new FakeStorageProvider());
    fakeHashProvider = new FakefakeHashProvider();
    fakeUsersRepository = new FakeUsersRepository();
    updateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
      new FakeLogProvider()
    );
    CreateUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
      new FakeLogProvider(),
      { execute: jest.fn() } as unknown as SendWelcomeEmailService
    );
    createSession = new CreateSessionsService(
      fakeUsersRepository,
      new FakeUserTokenRepository(),
      new FakeJWTProvider(),
      fakeHashProvider,
      new FakeLogProvider(),
      new FakeCacheProvider()
    );
  });

  it('should be able to reset a password', async () => {
    const createdUser = await CreateUser.execute({
      name: 'João silva',
      email: 'João@gmail.com',
      password: '123456',
    });

    await createSession.execute({
      email: 'João@gmail.com',
      password: '123456',
    });

    const { id, name, email } = createdUser;

    const newPassword = '654321';
    const updatedUser = await updateProfile.execute({
      userId: id,
      name,
      email,
      oldPassword: '123456',
      password: newPassword,
    });

    expect(updatedUser).toHaveProperty('name');
  });

  it('should not be Update with User not exist', async () => {
    const createdUser = await CreateUser.execute({
      name: 'João silva',
      email: 'João1@gmail.com',
      password: '123456',
    });

    await createSession.execute({
      email: 'João1@gmail.com',
      password: '123456',
    });
    const { name, email } = createdUser;
    const newPassword = '654321';
    expect(
      updateProfile.execute({
        userId: '1',
        name,
        email,
        oldPassword: '123456',
        password: newPassword,
      })
    ).rejects.toBeInstanceOf(AppError);
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
