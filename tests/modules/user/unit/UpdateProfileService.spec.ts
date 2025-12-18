import 'reflect-metadata';
import CreateUserService from '@modules/users/services/CreateUserService';
import FakeUsersRepository from '../repositories/FakeUsersRepository';
import ResetPasswordService from '@modules/users/services/ResetPasswordservice';
import FakeUsersTokensRepository from '../repositories/FakeUsersTokensRepository';
import FakeHashProvider from '@shared/providers/cryptography/fakes/FakeHashProvider';
import CreateSessionsService from '@modules/users/services/CreateSessionsService';
import AppError from '@shared/errors/AppError';
import UpdateProfileService from '@modules/users/services/UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeUsersTokensRepository: FakeUsersTokensRepository;
let CreateUser: CreateUserService;
let createSession: CreateSessionsService;
let hashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('Update profile', () => {
  beforeEach(() => {
    hashProvider = new FakeHashProvider();
    fakeUsersRepository = new FakeUsersRepository();
    ('');
    fakeUsersTokensRepository = new FakeUsersTokensRepository();
    updateProfile = new UpdateProfileService(fakeUsersRepository);
    CreateUser = new CreateUserService(fakeUsersRepository, hashProvider);
    createSession = new CreateSessionsService(
      fakeUsersRepository,
      hashProvider
    );
    updateProfile = new UpdateProfileService(fakeUsersRepository);
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
    const { name, email, password } = session.user;
    const newPassword = '654321';
    expect(
      updateProfile.execute({
        user_id: '1',
        name,
        email,
        old_password: password,
        password: newPassword,
      })
    ).rejects.toBeInstanceOf(AppError);
  });
  // it('should not be able to create two users with the same email', async () => {
  //   await CreateUser.execute({
  //     name: 'João silva',
  //     email: 'João@gmail.com',
  //     password: '123456',
  //   });
  //   expect(
  //     CreateUser.execute({
  //       name: 'João silva',
  //       email: 'João@gmail.com',
  //       password: '123456',
  //     })
  //   ).rejects.toBeInstanceOf(AppError);
  // });
});

