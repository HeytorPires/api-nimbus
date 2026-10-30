import 'reflect-metadata';
import { container } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import CreateUserService from '@modules/users/services/CreateUserService';
import FakeUsersRepository from '@tests/support/fakes/FakeUsersRepository';
import FakeStorageProvider from '@tests/support/fakes/FakeStorageProvider';
import FakeHashProvider from '@tests/support/fakes/FakeHashProvider';
import FakeLogProvider from '@tests/support/fakes/FakeLogProvider';
import FakeEmailProvider from '@tests/support/fakes/FakeEmailProvider';
import FakeEmailsRepository from '@tests/support/fakes/FakeEmailsRepository';
import FakeEmailEventsRepository from '@tests/support/fakes/FakeEmailEventsRepository';
import CreateEmailService from '@modules/emails/services/CreateEmailService';
import SendWelcomeEmailService from '@modules/users/services/SendWelcomeEmailService';

let fakeUsersRepository: FakeUsersRepository;
let CreateUser: CreateUserService;
let hashProvider: FakeHashProvider;
let fakeEmailProvider: FakeEmailProvider;

describe('Create User', () => {
  beforeEach(() => {
    container.registerInstance('StorageProvider', new FakeStorageProvider());
    hashProvider = new FakeHashProvider();
    fakeUsersRepository = new FakeUsersRepository();
    fakeEmailProvider = new FakeEmailProvider();
    CreateUser = new CreateUserService(
      fakeUsersRepository,
      hashProvider,
      new FakeLogProvider(),
      new SendWelcomeEmailService(
        fakeEmailProvider,
        new CreateEmailService(
          new FakeEmailsRepository(),
          new FakeEmailEventsRepository()
        )
      )
    );
  });

  it('should be able to create a new User', async () => {
    const User = await CreateUser.execute({
      name: 'João silva',
      email: 'João@gmail.com',
      password: '123456',
    });

    expect(User).toHaveProperty('email');
  });
  it('should not be able to create two users with the same email', async () => {
    await CreateUser.execute({
      name: 'João silva',
      email: 'João@gmail.com',
      password: '123456',
    });
    expect(
      CreateUser.execute({
        name: 'João silva',
        email: 'João@gmail.com',
        password: '123456',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should send a welcome email when a user is created', async () => {
    const sendMailSpy = jest.spyOn(fakeEmailProvider, 'sendMail');

    await CreateUser.execute({
      name: 'João silva',
      email: 'joao@gmail.com',
      password: '123456',
    });

    expect(sendMailSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        to: { name: 'João silva', email: 'joao@gmail.com' },
      })
    );
  });

  it('should create the user even if the welcome email fails', async () => {
    jest
      .spyOn(fakeEmailProvider, 'sendMail')
      .mockRejectedValueOnce(new Error('smtp down'));

    const user = await CreateUser.execute({
      name: 'João silva',
      email: 'joao@gmail.com',
      password: '123456',
    });

    expect(user).toHaveProperty('email');
  });
});
