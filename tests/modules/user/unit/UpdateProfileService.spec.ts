import 'reflect-metadata';
import { container } from 'tsyringe';
import CreateUserService from '@modules/users/services/CreateUserService';
import FakeUsersRepository from '../repositories/FakeUsersRepository';
import FakefakeHashProvider from '@shared/providers/cryptography/fakes/FakeHashProvider';
import CreateSessionsService from '@modules/users/services/CreateSessionsService';
import AppError from '@shared/errors/AppError';
import UpdateProfileService from '@modules/users/services/UpdateProfileService';
import FakeLogProvider from '../../../providers/fakes/FakeLogProvider';
import FakeCacheProvider from '../../../providers/fakes/FakeCacheProvider';
import FakeUserTokenRepository from '../repositories/FakeUsersTokensRepository';
import FakeStorageProvider from '../../../providers/fakes/FakeStorageProvider';

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
    CreateUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
    createSession = new CreateSessionsService(
      fakeUsersRepository,
      new FakeUserTokenRepository(),
      fakeHashProvider,
      new FakeLogProvider(),
      new FakeCacheProvider()
    );
  });

  it('should be able to reset a password', async () => {
    await CreateUser.execute({
      name: 'João silva',
      email: 'João@gmail.com',
      password: '123456',
    });

    const session = await createSession.execute({
      email: 'João@gmail.com',
      password: '123456',
    });

    const { id, name, email } = session.user;

    const newPassword = '654321';
    const updatedUser = await updateProfile.execute({
      user_id: id,
      name,
      email,
      old_password: '123456',
      password: newPassword,
    });

    expect(updatedUser).toHaveProperty('name');
  });

  it('should not be Update with User not exist', async () => {
    await CreateUser.execute({
      name: 'João silva',
      email: 'João1@gmail.com',
      password: '123456',
    });

    const session = await createSession.execute({
      email: 'João1@gmail.com',
      password: '123456',
    });
    const { name, email } = session.user;
    const newPassword = '654321';
    expect(
      updateProfile.execute({
        user_id: '1',
        name,
        email,
        old_password: '123456',
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
