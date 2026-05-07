import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import EtherealMail from '@config/mail/EtherealMail';
import SendForgotPasswordEmailService from '@modules/users/services/SendForgotPasswordEmailService';
import FakeUsersRepository from '../repositories/FakeUsersRepository';
import FakeUsersTokensRepository from '../repositories/FakeUsersTokensRepository';

let fakeUsersRepository: FakeUsersRepository;
let fakeUsersTokensRepository: FakeUsersTokensRepository;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;

const originalAppWebUrl = process.env.APP_WEB_URL;

describe('Send forgot password email', () => {
  beforeEach(() => {
    process.env.APP_WEB_URL = 'http://app.nimbus.test';

    fakeUsersRepository = new FakeUsersRepository();
    fakeUsersTokensRepository = new FakeUsersTokensRepository();
    sendForgotPasswordEmail = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeUsersTokensRepository
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  afterAll(() => {
    if (originalAppWebUrl === undefined) {
      delete process.env.APP_WEB_URL;
      return;
    }

    process.env.APP_WEB_URL = originalAppWebUrl;
  });

  it('deve ser capaz de enviar email de recuperação de senha', async () => {
    const user = await fakeUsersRepository.create({
      name: 'João Silva',
      email: 'joao@gmail.com',
      password: '123456',
    });

    const generateSpy = jest
      .spyOn(fakeUsersTokensRepository, 'generate')
      .mockResolvedValue({
        id: 'token-id',
        token: 'generated-token',
        user_id: user.id,
        created_at: new Date(),
        updated_at: new Date(),
      } as never);
    const sendMailSpy = jest
      .spyOn(EtherealMail, 'sendMail')
      .mockResolvedValue(undefined);

    await sendForgotPasswordEmail.execute({ email: user.email });

    expect(generateSpy).toHaveBeenCalledWith(user.id);
    expect(sendMailSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        to: {
          name: user.name,
          email: user.email,
        },
        subject: '[ Nimbus ] Recuperação de Senha',
        templateDate: expect.objectContaining({
          variables: expect.objectContaining({
            name: user.name,
            link: 'http://app.nimbus.test/reset_password?token=generated-token',
          }),
        }),
      })
    );
  });

  it('não deve ser capaz de enviar email para um usuário inexistente', async () => {
    const sendMailSpy = jest.spyOn(EtherealMail, 'sendMail');

    await expect(
      sendForgotPasswordEmail.execute({ email: 'inexistente@gmail.com' })
    ).rejects.toBeInstanceOf(AppError);

    expect(sendMailSpy).not.toHaveBeenCalled();
  });
});
