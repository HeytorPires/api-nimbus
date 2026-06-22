import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import SendForgotPasswordEmailService from '@modules/users/services/SendForgotPasswordEmailService';
import FakeUsersRepository from '../repositories/FakeUsersRepository';
import FakeUserTokenRepository from '../repositories/FakeUsersTokensRepository';
import FakeEmailProvider from '../../../providers/fakes/FakeEmailProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokenRepository;
let fakeEmailProvider: FakeEmailProvider;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmail', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokenRepository();
    fakeEmailProvider = new FakeEmailProvider();

    sendForgotPasswordEmail = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeUserTokensRepository,
      fakeEmailProvider
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
