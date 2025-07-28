import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/FakeUsersRepository';
import ShowProfileService from '@modules/users/services/ShowProfileService';
import CreateUserService from '@modules/users/services/CreateUserService';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';

let fakeUsersRepository: FakeUsersRepository;
let showProfile: ShowProfileService;
let createUser: CreateUserService;
let hashProvider: FakeHashProvider;

describe('Show Customer', () => {
  beforeEach(() => {
    hashProvider = new FakeHashProvider();
    fakeUsersRepository = new FakeUsersRepository();
    showProfile = new ShowProfileService(fakeUsersRepository);
    createUser = new CreateUserService(fakeUsersRepository, hashProvider);
  });
  it('should not show customer when not exist ', async () => {
    const id = '123456789abcd';

    await expect(showProfile.execute(id)).rejects.toBeInstanceOf(AppError);
  });
  it('should be able to show existent user', async () => {
    const user = await createUser.execute({
      name: 'João silva',
      email: 'João@gmail.com',
      password: '123456',
    });
    const { id } = user;
    const customerShow = await showProfile.execute(id);
    expect(customerShow).toHaveProperty('id');
  });
});
