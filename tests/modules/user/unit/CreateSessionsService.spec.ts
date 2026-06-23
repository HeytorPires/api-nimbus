import 'reflect-metadata';
import AppError from '../../../../src/shared/errors/AppError';
import CreateSessionsService from '../../../../src/modules/users/services/CreateSessionsService';
import FakeUsersRepository from '../repositories/FakeUsersRepository';
import FakeUserTokenRepository from '../repositories/FakeUsersTokensRepository';
import FakeHashProvider from '@shared/providers/cryptography/fakes/FakeHashProvider';
import FakeLogProvider from '../../../providers/fakes/FakeLogProvider';
import FakeCacheProvider from '../../../providers/fakes/FakeCacheProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokenRepository;
let CreateSession: CreateSessionsService;
let hashProvider: FakeHashProvider;
let fakeLogProvider: FakeLogProvider;
let fakeCacheProvider: FakeCacheProvider;

describe('CreateSession', () => {
  beforeEach(() => {
    hashProvider = new FakeHashProvider();
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokenRepository();
    fakeLogProvider = new FakeLogProvider();
    fakeCacheProvider = new FakeCacheProvider();
    CreateSession = new CreateSessionsService(
      fakeUsersRepository,
      fakeUserTokensRepository,
      hashProvider,
      fakeLogProvider,
      fakeCacheProvider
    );
  });

  it('should be able to authenticate', async () => {
    const user = await fakeUsersRepository.create({
      name: 'joao',
      email: 'João@gmail.com',
      password: '123456',
    });

    const response = await CreateSession.execute({
      email: 'João@gmail.com',
      password: '123456',
    });

    expect(response).toHaveProperty('token');
    expect(response.user.email).toEqual(user.email);
    expect(response.user.name).toEqual(user.name);
    expect(response.user.id).toEqual(user.id);
  });
  it('should persist session token in database on login', async () => {
    const user = await fakeUsersRepository.create({
      name: 'joao',
      email: 'João@gmail.com',
      password: '123456',
    });

    await CreateSession.execute({
      email: 'João@gmail.com',
      password: '123456',
    });

    const storedToken = await fakeUserTokensRepository.findByUserId(user.id);
    expect(storedToken).toBeDefined();
    expect(storedToken?.user_id).toBe(user.id);
  });
  it('should be able to authenticate with wrong password', async () => {
    await fakeUsersRepository.create({
      name: 'joao',
      email: 'João@gmail.com',
      password: '123456',
    });

    await expect(
      CreateSession.execute({
        email: 'João@gmail.com',
        password: 'abcdef',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should be able to authenticate without user', async () => {
    await expect(
      CreateSession.execute({
        email: 'João@gmail.com',
        password: '123456',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
  // it('should not be able to create two users with the same email', async () => {
  //   await fakeUsersRepository.create({
  //     name: 'joao',
  //     email: 'João@gmail.com',
  //     password: '123456',
  //   });
  //   expect(
  //     CreateSession.execute({
  //       email: 'João@gmail.com',
  //       password: '123456',
  //     })
  //   ).rejects.toBeInstanceOf(AppError);
  // });
});
