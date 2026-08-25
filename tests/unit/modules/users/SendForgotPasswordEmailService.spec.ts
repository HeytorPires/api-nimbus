import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import SendForgotPasswordEmailService from '@modules/users/services/SendForgotPasswordEmailService';
import FakeUsersRepository from '@tests/support/fakes/FakeUsersRepository';
import FakeUserTokenRepository from '@tests/support/fakes/FakeUsersTokensRepository';
import FakeEmailProvider from '@tests/support/fakes/FakeEmailProvider';
import FakeLogProvider from '@tests/support/fakes/FakeLogProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokenRepository;
let fakeEmailProvider: FakeEmailProvider;
let fakeLogProvider: FakeLogProvider;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmail', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokenRepository();
    fakeEmailProvider = new FakeEmailProvider();
    fakeLogProvider = new FakeLogProvider();

    sendForgotPasswordEmail = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeUserTokensRepository,
      fakeEmailProvider,
      fakeLogProvider
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
