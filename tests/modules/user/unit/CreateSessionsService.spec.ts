import 'reflect-metadata';
import AppError from '../../../../src/shared/errors/AppError';
import CreateSessionsService from '../../../../src/modules/users/services/CreateSessionsService';
import FakeUsersRepository from '../repositories/FakeUsersRepository';
import FakeHashProvider from '@shared/providers/cryptography/fakes/FakeHashProvider';
import FakeLogProvider from '../../../providers/fakes/FakeLogProvider';

let fakeUsersRepository: FakeUsersRepository;
let CreateSession: CreateSessionsService;
let hashProvider: FakeHashProvider;
let fakeLogProvider: FakeLogProvider;

describe('CreateSession', () => {
  beforeEach(() => {
    hashProvider = new FakeHashProvider();
    fakeUsersRepository = new FakeUsersRepository();
    fakeLogProvider = new FakeLogProvider();
    CreateSession = new CreateSessionsService(
      fakeUsersRepository,
      hashProvider,
      fakeLogProvider
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
    expect(response.user).toEqual(user);
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
