import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import CreateUserService from '@modules/users/services/CreateUserService';
import FakeUsersRepository from '../repositories/FakeUsersRepository';
import FakeHashProvider from '@shared/providers/cryptography/fakes/FakeHashProvider';

let fakeUsersRepository: FakeUsersRepository;
let CreateUser: CreateUserService;
let hashProvider: FakeHashProvider;

describe('Create User', () => {
  beforeEach(() => {
    hashProvider = new FakeHashProvider();
    fakeUsersRepository = new FakeUsersRepository();
    CreateUser = new CreateUserService(fakeUsersRepository, hashProvider);
  });

  it('deve ser capaz de criar um novo usuário', async () => {
    const User = await CreateUser.execute({
      name: 'João silva',
      email: 'João@gmail.com',
      password: '123456',
    });

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

