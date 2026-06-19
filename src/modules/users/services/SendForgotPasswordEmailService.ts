import AppError from '@shared/errors/AppError';
import path from 'node:path';
import { ISendForgotPasswordEmailUser } from '../domain/models/ISendForgotPasswordEmailUser';
import { inject, injectable } from 'tsyringe';
import { IUserRepository } from '../domain/repositories/IUserRepository';
import { IUserTokensRepository } from '../domain/repositories/IUserTokensRepository';
import { ISmtpProvider } from '@shared/providers/email/models/ISmtpProvider';

@injectable()
class SendForgotPasswordEmailService {
  private readonly appWebUrl: string;
  constructor(
    @inject('UsersRepository')
    private readonly usersRepository: IUserRepository,
    @inject('UsersTokensRepository')
    private readonly userTokensRepository: IUserTokensRepository,
    @inject('EmailProvider') private readonly emailProvider: ISmtpProvider
  ) {
    this.appWebUrl =
      process.env.APP_WEB_URL || `http://localhost:${process.env.PORT || 3333}`;
  }
  public async execute({ email }: ISendForgotPasswordEmailUser) {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      throw new AppError('User does not exists.');
    }
    const { token } = await this.userTokensRepository.generate(user.id);

    const forgotPasswordTemplate = path.resolve(
      __dirname,
      '..',
      'views',
      'forgot_password.hbs'
    );

    await this.emailProvider.sendMail({
      to: {
        name: user.name,
        email: user.email,
      },
      subject: '[ Nimbus ] Recuperação de Senha',
      templateData: {
        file: forgotPasswordTemplate,
        variables: {
          name: user.name,
          link: `${this.appWebUrl}/reset_password?token=${token}`,
        },
      },
    });
  }
}

export default SendForgotPasswordEmailService;
