import AppError from '@shared/errors/AppError';
import path from 'node:path';
import { ISendForgotPasswordEmailUser } from '../domain/models/ISendForgotPasswordEmailUser';
import { inject, injectable } from 'tsyringe';
import { IUserRepository } from '../domain/repositories/IUserRepository';
import { IUserTokensRepository } from '../domain/repositories/IUserTokensRepository';
import { ISmtpProvider } from '@shared/providers/email/models/ISmtpProvider';
import { ILogProvider } from '@shared/providers/logs/models/ILogProvider';
import { requestContext } from '@config/context';

@injectable()
class SendForgotPasswordEmailService {
  private readonly appWebUrl: string;
  constructor(
    @inject('UsersRepository')
    private readonly usersRepository: IUserRepository,
    @inject('UsersTokensRepository')
    private readonly userTokensRepository: IUserTokensRepository,
    @inject('EmailProvider')
    private readonly emailProvider: ISmtpProvider,
    @inject('LogProvider')
    private readonly logger: ILogProvider
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

    const resetLink = `${this.appWebUrl}/reset-password?token=${token}`;

    const context = requestContext.getStore();

    this.logger.info({
      message: 'Forgot password email requested',
      context: 'SendForgotPasswordEmailService',
      metadata: { email: user.email, userId: user.id },
      requestId: context?.requestId,
      requestIp: context?.requestIp,
    });

    if (process.env.NODE_ENV === 'development') {
      this.logger.info({
        message: `[DEV] Reset password link for ${user.email}`,
        context: 'SendForgotPasswordEmailService',
        metadata: { resetLink },
        requestId: context?.requestId,
        requestIp: context?.requestIp,
      });
    } else {
      const templatePath = path.resolve(
        __dirname,
        '..',
        '..',
        '..',
        'views',
        'emails',
        'forgot_password.hbs'
      );

      await this.emailProvider.sendMail({
        to: {
          name: user.name,
          email: user.email,
        },
        subject: '[Nimbus] Resetar Senha',
        templateData: {
          file: templatePath,
          variables: {
            name: user.name,
            link: resetLink,
          },
        },
      });
    }

    this.logger.info({
      message: 'Forgot password email sent',
      context: 'SendForgotPasswordEmailService',
      metadata: { email: user.email, userId: user.id },
      requestId: context?.requestId,
      requestIp: context?.requestIp,
    });
  }
}

export default SendForgotPasswordEmailService;
