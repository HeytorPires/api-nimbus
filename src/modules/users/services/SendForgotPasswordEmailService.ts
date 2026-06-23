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
      process.env.APP_WEB_URL || `http://localhost:${process.env.PORT}`;
  }
  public async execute({ email }: ISendForgotPasswordEmailUser) {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      throw new AppError(
        'User does not exists.',
        'SendForgotPasswordEmailService'
      );
    }
    const { token } = await this.userTokensRepository.generate(user.id);

    const forgotPasswordTemplate = path.resolve(
      __dirname,
      '..',
      'views',
      'forgot_password.hbs'
    );

    if (process.env.NODE_ENV === 'development') {
      console.log(`\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n`);
      console.log(`\n[ Nimbus ] Recuperação de Senha`);
      console.log(`\nLink: ${this.appWebUrl}/reset-password?token=${token}`);
      console.log(`\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n`);
    }

    if (process.env.NODE_ENV === 'production') {
      await this.emailProvider.sendMail({
        to: {
          name: user.name,
          email: user.email,
        },
        from: {
          name: 'Nimbus',
          email: 'no-reply@heytor.com.br',
        },
        subject: '[ Nimbus ] Recuperação de Senha',
        templateData: {
          file: forgotPasswordTemplate,
          variables: {
            name: user.name,
            link: `${this.appWebUrl}/reset-password?token=${token}`,
          },
        },
      });
    }
  }
}

export default SendForgotPasswordEmailService;
