import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/FakeUsersRepository';
import ShowProfileService from '@modules/users/services/ShowProfileService';
import CreateUserService from '@modules/users/services/CreateUserService';
import FakeHashProvider from '@shared/providers/cryptography/fakes/FakeHashProvider';
import CreateSessionsService from '@modules/users/services/CreateSessionsService';

let fakeUsersRepository: FakeUsersRepository;
let showProfile: ShowProfileService;
let createSession: CreateSessionsService;
let createUser: CreateUserService;
let hashProvider: FakeHashProvider;

describe('Show Customer', () => {
  beforeEach(() => {
    hashProvider = new FakeHashProvider();
    fakeUsersRepository = new FakeUsersRepository();
    showProfile = new ShowProfileService(fakeUsersRepository);
    createUser = new CreateUserService(fakeUsersRepository, hashProvider);
    createSession = new CreateSessionsService(
      fakeUsersRepository,
      hashProvider
    );
  });
  it('não deve exibir o usuário quando ele não existir', async () => {
    const id = '123456789abcd';

    await expect(showProfile.execute(id)).rejects.toBeInstanceOf(AppError);
  });
  it('deve ser capaz de exibir um usuário existente', async () => {
    const user = await createUser.execute({
      name: 'João silva',
      email: 'João@gmail.com',
      password: '123456',
    });

    const session = await createSession.execute({
      email: 'João@gmail.com',
      password: '123456',
    });

    const customerShow = await showProfile.execute(session.user.id);
    expect(customerShow).toHaveProperty('id');
  });
});

