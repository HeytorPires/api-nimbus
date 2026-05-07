import 'reflect-metadata';
import CreateUserService from '@modules/users/services/CreateUserService';
import FakeUsersRepository from '../repositories/FakeUsersRepository';
import ResetPasswordService from '@modules/users/services/ResetPasswordservice';
import FakeUsersTokensRepository from '../repositories/FakeUsersTokensRepository';
import FakeHashProvider from '@shared/providers/cryptography/fakes/FakeHashProvider';
import CreateSessionsService from '@modules/users/services/CreateSessionsService';
import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeUsersTokensRepository: FakeUsersTokensRepository;
let CreateUser: CreateUserService;
let ResetPassword: ResetPasswordService;
let hashProvider: FakeHashProvider;
let createSession: CreateSessionsService;

describe('Create User', () => {
  beforeEach(() => {
    hashProvider = new FakeHashProvider();
    fakeUsersRepository = new FakeUsersRepository();
    fakeUsersTokensRepository = new FakeUsersTokensRepository();
    createSession = new CreateSessionsService(
      fakeUsersRepository,
      hashProvider
    );
    CreateUser = new CreateUserService(fakeUsersRepository, hashProvider);
    ResetPassword = new ResetPasswordService(
      fakeUsersRepository,
      fakeUsersTokensRepository
    );
    createSession = new CreateSessionsService(
      fakeUsersRepository,
      hashProvider
    );
  });

  it('deve ser capaz de redefinir uma senha', async () => {
    const User = await CreateUser.execute({
      name: 'João silva',
      email: 'João@gmail.com',
      password: '123456',
    });

    const session = await createSession.execute({
      email: 'João@gmail.com',
      password: '123456',
    });
    const { password, id } = session.user;

    const response = await fakeUsersTokensRepository.generate(id);
    const { token } = response;

    await ResetPassword.execute({ token, password });
    expect(User).toHaveProperty('email');
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

