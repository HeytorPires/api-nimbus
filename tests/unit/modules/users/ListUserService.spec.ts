import 'reflect-metadata';
import { container } from 'tsyringe';
import FakeUsersRepository from '../repositories/FakeUsersRepository';
import ListUserService from '@modules/users/services/ListUserService';
import FakeStorageProvider from '../../../providers/fakes/FakeStorageProvider';

let fakeUsersRepository: FakeUsersRepository;
let ListUser: ListUserService;

describe('List Users', () => {
  beforeEach(() => {
    container.registerInstance('StorageProvider', new FakeStorageProvider());
    fakeUsersRepository = new FakeUsersRepository();
    ListUser = new ListUserService(fakeUsersRepository);
  });

  it('should be able to authenticate', async () => {
    await fakeUsersRepository.create({
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
