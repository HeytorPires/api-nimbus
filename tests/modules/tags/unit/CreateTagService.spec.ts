import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import CreateUserService from '@modules/users/services/CreateUserService';
import FakeTagsRepository from '../repositories/FakeTagsRepository';
import FakeHashProvider from '@shared/providers/cryptography/fakes/FakeHashProvider';
import CreateTagService from '@modules/tags/services/CreateTagService';
import FakeUsersRepository from '../../../modules/user/repositories/FakeUsersRepository';
import CreateSessionsService from '@modules/users/services/CreateSessionsService';
import FakeLogProvider from '../../../providers/fakes/FakeLogProvider';
import FakeCacheProvider from '../../../providers/fakes/FakeCacheProvider';
import FakeUserTokenRepository from '../../../modules/user/repositories/FakeUsersTokensRepository';

let fakeTagsRepository: FakeTagsRepository;
let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokenRepository;
let createTagService: CreateTagService;
let createUserService: CreateUserService;
let createSession: CreateSessionsService;
let hashProvider: FakeHashProvider;
let cacheProvider: FakeCacheProvider;

describe('Create Tag', () => {
  beforeEach(() => {
    hashProvider = new FakeHashProvider();
    fakeTagsRepository = new FakeTagsRepository();
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokenRepository();
    cacheProvider = new FakeCacheProvider();
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
      fakeUserTokensRepository,
      hashProvider,
      new FakeLogProvider(),
      cacheProvider
    );
  });

  it('should be able to create a new Tag', async () => {
    await createUserService.execute({
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
      user_id: session.user.id,
    });

    expect(tag).toHaveProperty('id');
  });
  it('should not be able to create two tags with the same name', async () => {
    await createUserService.execute({
      name: 'João silva',
      email: 'João@gmail.com',
      password: '123456',
    });

    const session = await createSession.execute({
      email: 'João@gmail.com',
      password: '123456',
    });

    await createTagService.execute({
      name: 'Important',
      user_id: session.user.id,
    });
    expect(
      createTagService.execute({
        name: 'Important',
        user_id: session.user.id,
      })
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to create tags with invalid user_id', async () => {
    expect(
      createTagService.execute({
        name: 'Important',
        user_id: '1234',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
