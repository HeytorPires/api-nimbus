import 'reflect-metadata';
import CreateUserService from '@modules/users/services/CreateUserService';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/FakeUsersRepository';
import ResetPasswordService from '@modules/users/services/ResetPasswordservice';
import FakeUsersTokensRepository from '../repositories/FakeUsersTokensRepository';

let fakeUsersRepository: FakeUsersRepository;
let fakeUsersTokensRepository: FakeUsersTokensRepository;
let CreateUser: CreateUserService;
let ResetPassword: ResetPasswordService;
let hashProvider: FakeHashProvider;

describe('Create User', () => {
  beforeEach(() => {
    hashProvider = new FakeHashProvider();
    fakeUsersRepository = new FakeUsersRepository();
    fakeUsersTokensRepository = new FakeUsersTokensRepository();

    CreateUser = new CreateUserService(fakeUsersRepository, hashProvider);
    ResetPassword = new ResetPasswordService(
      fakeUsersRepository,
      fakeUsersTokensRepository
    );
  });

  it('should be able to reset a password', async () => {
    const User = await CreateUser.execute({
      name: 'João silva',
      email: 'João@gmail.com',
      password: '123456',
    });
    const { password, id } = User;

    const response = await fakeUsersTokensRepository.generate(id);
    const { token } = response;

    await ResetPassword.execute({ token, password });
    expect(User).toHaveProperty('id');
  });
  //   it('should not be able to create two users with the same email', async () => {
  //     await CreateUser.execute({
  //       name: 'João silva',
  //       email: 'João@gmail.com',
  //       password: '123456',
  //     });
  //     expect(
  //       CreateUser.execute({
  //         name: 'João silva',
  //         email: 'João@gmail.com',
  //         password: '123456',
  //       })
  //     ).rejects.toBeInstanceOf(AppError);
  //   });
});
