import 'reflect-metadata';
import { container } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import CreateUserService from '@modules/users/services/CreateUserService';
import FakeUsersRepository from '@tests/support/fakes/FakeUsersRepository';
import FakeStorageProvider from '@tests/support/fakes/FakeStorageProvider';
import FakeHashProvider from '@tests/support/fakes/FakeHashProvider';

let fakeUsersRepository: FakeUsersRepository;
let CreateUser: CreateUserService;
let hashProvider: FakeHashProvider;

describe('Create User', () => {
  beforeEach(() => {
    container.registerInstance('StorageProvider', new FakeStorageProvider());
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
