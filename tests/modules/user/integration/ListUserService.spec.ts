import 'reflect-metadata';
import FakeUsersRepository from '../repositories/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import ListUserService from '@modules/users/services/ListUserService';

let fakeUsersRepository: FakeUsersRepository;
let ListUser: ListUserService;
let hashProvider: FakeHashProvider;

describe('List Users', () => {
  beforeEach(() => {
    hashProvider = new FakeHashProvider();
    fakeUsersRepository = new FakeUsersRepository();
    ListUser = new ListUserService(fakeUsersRepository);
  });

  it('should be able to authenticate', async () => {
    const user = await fakeUsersRepository.create({
      name: 'joao',
      email: 'João@gmail.com',
      password: '123456',
    });

    const response = await ListUser.execute();
    expect(response).not.toHaveLength(0);
  });
  it('should be able to authenticate', async () => {
    const response = await ListUser.execute();
    expect(response).toHaveLength(0);
  });
});
