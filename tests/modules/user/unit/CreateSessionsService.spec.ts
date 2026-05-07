import 'reflect-metadata';
import AppError from '../../../../src/shared/errors/AppError';
import CreateSessionsService from '../../../../src/modules/users/services/CreateSessionsService';
import FakeUsersRepository from '../repositories/FakeUsersRepository';
import FakeHashProvider from '@shared/providers/cryptography/fakes/FakeHashProvider';

let fakeUsersRepository: FakeUsersRepository;
let CreateSession: CreateSessionsService;
let hashProvider: FakeHashProvider;

describe('CreateSession', () => {
  beforeEach(() => {
    hashProvider = new FakeHashProvider();
    fakeUsersRepository = new FakeUsersRepository();
    CreateSession = new CreateSessionsService(
      fakeUsersRepository,
      hashProvider
    );
  });

  it('deve ser capaz de autenticar', async () => {
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
  it('não deve ser capaz de autenticar com senha incorreta', async () => {
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
  it('não deve ser capaz de autenticar sem usuário', async () => {
    await expect(
      CreateSession.execute({
        email: 'João@gmail.com',
        password: '123456',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
  // it('não deve ser capaz de criar dois usuários com o mesmo email', async () => {
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

