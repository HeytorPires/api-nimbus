import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import CreateUserService from '@modules/users/services/CreateUserService';
import FakeTagsRepository from '../repositories/FakeTagsRepository';
import FakeHashProvider from '@shared/providers/cryptography/fakes/FakeHashProvider';
import CreateTagService from '@modules/tags/services/CreateTagService';
import FakeUsersRepository from '../../../modules/user/repositories/FakeUsersRepository';
import CreateSessionsService from '@modules/users/services/CreateSessionsService';

let fakeTagsRepository: FakeTagsRepository;
let fakeUsersRepository: FakeUsersRepository;
let createTagService: CreateTagService;
let createUserService: CreateUserService;
let createSession: CreateSessionsService;
let hashProvider: FakeHashProvider;

describe('Create Tag', () => {
  beforeEach(() => {
    hashProvider = new FakeHashProvider();
    fakeTagsRepository = new FakeTagsRepository();
    fakeUsersRepository = new FakeUsersRepository();
    createTagService = new CreateTagService(
      fakeTagsRepository,
      fakeUsersRepository
    );
    createUserService = new CreateUserService(
      fakeUsersRepository,
      hashProvider
    );
    createSession = new CreateSessionsService(
      fakeUsersRepository,
      hashProvider
    );
  });

  it('deve ser capaz de criar uma nova tag', async () => {
    await createUserService.execute({
      name: 'João silva',
      email: 'João@gmail.com',
      password: '123456',
    });

    const session = await createSession.execute({
      email: 'João@gmail.com',
      password: '123456',
    });
    console.log();

    const tag = await createTagService.execute({
      name: 'Important',
      userId: session.user.id,
    });

    expect(tag).toHaveProperty('id');
  });
  it('não deve ser capaz de criar duas tags com o mesmo nome', async () => {
    const User = await createUserService.execute({
      name: 'João silva',
      email: 'João@gmail.com',
      password: '123456',
    });

    const session = await createSession.execute({
      email: 'João@gmail.com',
      password: '123456',
    });

    const tag = await createTagService.execute({
      name: 'Important',
      userId: session.user.id,
    });
    expect(
      createTagService.execute({
        name: 'Important',
        userId: session.user.id,
      })
    ).rejects.toBeInstanceOf(AppError);
  });
  it('não deve ser capaz de criar tags com um userId inválido', async () => {
    expect(
      createTagService.execute({
        name: 'Important',
        userId: '1234',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});

