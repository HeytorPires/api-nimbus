import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import SendForgotPasswordEmailService from '@modules/users/services/SendForgotPasswordEmailService';
import FakeUsersRepository from '../repositories/FakeUsersRepository';
import FakeUserTokenRepository from '../repositories/FakeUsersTokensRepository';
// import CreateUserService from '@modules/users/services/CreateUserService';
// import FakeHashProvider from '@shared/providers/cryptography/fakes/FakeHashProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokenRepository;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;
// let createUser: CreateUserService;
// let hashProvider: FakeHashProvider;

// Mock EtherealMail
jest.mock('@config/mail/EtherealMail', () => ({
  __esModule: true,
  default: {
    sendMail: jest.fn().mockResolvedValue(undefined),
  },
}));

describe('SendForgotPasswordEmail', () => {
  beforeEach(() => {
    // hashProvider = new FakeHashProvider();
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokenRepository();
    // createUser = new CreateUserService(fakeUsersRepository, hashProvider);
    sendForgotPasswordEmail = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeUserTokensRepository
    );
  });

  it('should be able to send forgot password email', async () => {
    await fakeUsersRepository.create({
      name: 'João Silva',
      email: 'joao@gmail.com',
      password: '123456',
    });

    await expect(
      sendForgotPasswordEmail.execute({ email: 'joao@gmail.com' })
    ).resolves.not.toThrow();
  });

  it('should not be able to send email to non-existing user', async () => {
    await expect(
      sendForgotPasswordEmail.execute({ email: 'nonexistent@gmail.com' })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should generate a token when sending forgot password email', async () => {
    const generateSpy = jest.spyOn(fakeUserTokensRepository, 'generate');

    const user = await fakeUsersRepository.create({
      name: 'João Silva',
      email: 'joao@gmail.com',
      password: '123456',
    });

    await sendForgotPasswordEmail.execute({ email: 'joao@gmail.com' });

    expect(generateSpy).toHaveBeenCalledWith(user.id);
  });
});
