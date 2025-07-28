import AppError from '@shared/errors/AppError';
import path from 'path';
import EtherealMail from '@config/mail/EtherealMail';
import { ISendForgotPasswordEmailUser } from '../domain/models/ISendForgotPasswordEmailUser';
import { inject, injectable } from 'tsyringe';
import { IUserRepository } from '../domain/repositories/IUserRepository';
import { IUserTokensRepository } from '../domain/repositories/IUserTokensRepository';

@injectable()
class SendForgotPasswordEmailService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUserRepository,
    @inject('UsersTokensRepository')
    private userTokensRepository: IUserTokensRepository
  ) {}
  public async execute({ email }: ISendForgotPasswordEmailUser) {
    const appWebUrl = process.env.APP_WEB_URL;
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

    await EtherealMail.sendMail({
      to: {
        name: user.name,
        email: user.email,
      },
      subject: '[API Vendas] Recuperação de Senha',
      templateDate: {
        file: forgotPasswordTemplate,
        variables: {
          name: user.name,
          link: `${appWebUrl}/reset_password?token=${token}`,
        },
      },
    });
  }
}

export default SendForgotPasswordEmailService;
