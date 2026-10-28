import AppError from '@shared/errors/AppError';
import path from 'node:path';
import { ISendForgotPasswordEmailUser } from '../domain/models/ISendForgotPasswordEmailUser';
import { inject, injectable } from 'tsyringe';
import { IUserRepository } from '../domain/repositories/IUserRepository';
import { IUserTokensRepository } from '../domain/repositories/IUserTokensRepository';
import { IEmailProvider } from '@shared/providers/email/models/IEmailProvider';
import { ILogProvider } from '@shared/providers/logs/models/ILogProvider';
import { requestContext } from '@config/context';
import CreateEmailService from '@modules/emails/services/CreateEmailService';
import { EmailStatus } from '@modules/emails/domain/enums/EmailStatus';

@injectable()
class SendForgotPasswordEmailService {
  private readonly appWebUrl: string;
  constructor(
    @inject('UsersRepository')
    private readonly usersRepository: IUserRepository,
    @inject('UsersTokensRepository')
    private readonly userTokensRepository: IUserTokensRepository,
    @inject('EmailProvider')
    private readonly emailProvider: IEmailProvider,
    @inject('LogProvider')
    private readonly logger: ILogProvider,
    private readonly createEmail: CreateEmailService
  ) {
    this.appWebUrl =
      process.env.APP_WEB_URL ||
      `http://localhost:${process.env.API_PORT || process.env.PORT || 3000}`;
  }

  public async execute({ email }: ISendForgotPasswordEmailUser) {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError(
        'User does not exists.',
        'SendForgotPasswordEmailService',
        404
      );
    }

    const { token } = await this.userTokensRepository.generate(user.id);

    const resetLink = `${this.appWebUrl}/#/reset-password?token=${token}`;

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
        'views',
        'forgot_password.hbs'
      );

      const subject = '[Nimbus] Resetar Senha';
      const template = 'forgot_password';

      const message = {
        to: {
          name: user.name,
          email: user.email,
        },
        subject,
        templateData: {
          file: templatePath,
          variables: {
            name: user.name,
            link: resetLink,
          },
        },
      };

      let result;

      try {
        result = await this.emailProvider.sendMail(message);
      } catch (error) {
        // AppError não herda de Error, mas ambos têm `message`
        const { message: errorMessage } = error as { message?: string };

        await this.createEmail.execute({
          provider: process.env.MAIL_DRIVER ?? 'ethereal',
          to: user.email,
          subject,
          template,
          status: EmailStatus.FAILED,
          errorMessage,
        });

        throw error;
      }

      await this.createEmail.execute({
        provider: result.provider,
        providerMessageId: result.messageId,
        to: user.email,
        subject,
        template,
        status: EmailStatus.SENT,
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
