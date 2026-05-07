import 'reflect-metadata';
import CreateUserService from '@modules/users/services/CreateUserService';
import FakeUsersRepository from '../repositories/FakeUsersRepository';
import ResetPasswordService from '@modules/users/services/ResetPasswordservice';
import FakeUsersTokensRepository from '../repositories/FakeUsersTokensRepository';
import FakefakeHashProvider from '@shared/providers/cryptography/fakes/FakeHashProvider';
import CreateSessionsService from '@modules/users/services/CreateSessionsService';
import AppError from '@shared/errors/AppError';
import UpdateProfileService from '@modules/users/services/UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeUsersTokensRepository: FakeUsersTokensRepository;
let CreateUser: CreateUserService;
let createSession: CreateSessionsService;
let fakeHashProvider: FakefakeHashProvider;
let updateProfile: UpdateProfileService;

describe('Update profile', () => {
  beforeEach(() => {
    fakeHashProvider = new FakefakeHashProvider();
    fakeUsersRepository = new FakeUsersRepository();
    ('');
    fakeUsersTokensRepository = new FakeUsersTokensRepository();
    updateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider
    );
    CreateUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
    createSession = new CreateSessionsService(
      fakeUsersRepository,
      fakeHashProvider
    );
    updateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider
    );
  });

  it('deve ser capaz de atualizar o perfil com nova senha', async () => {
    const userCreated = await CreateUser.execute({
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

  it('não deve atualizar o perfil quando o usuário não existir', async () => {
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
  it('não deve ser capaz de criar dois usuários com o mesmo email', async () => {
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

