import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import CreateUserService from '@modules/users/services/CreateUserService';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/FakeUsersRepository';

let fakeUsersRepository: FakeUsersRepository;
let CreateUser: CreateUserService;
let hashProvider: FakeHashProvider;

describe('Create User', () => {
  beforeEach(() => {
    hashProvider = new FakeHashProvider();
    fakeUsersRepository = new FakeUsersRepository();
    CreateUser = new CreateUserService(fakeUsersRepository, hashProvider);
  });

  it('should be able to create a new User', async () => {
    const User = await CreateUser.execute({
      name: 'João silva',
      email: 'João@gmail.com',
      password: '123456',
    });

    expect(User).toHaveProperty('id');
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
