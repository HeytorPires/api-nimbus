import path from 'node:path';
import { inject, injectable } from 'tsyringe';
import { IEmailProvider } from '@shared/providers/email/models/IEmailProvider';
import CreateEmailService from '@modules/emails/services/CreateEmailService';
import { EmailStatus } from '@modules/emails/domain/enums/EmailStatus';

interface ISendWelcomeEmail {
  name: string;
  email: string;
}

@injectable()
class SendWelcomeEmailService {
  private readonly appWebUrl: string;
  constructor(
    @inject('EmailProvider')
    private readonly emailProvider: IEmailProvider,
    private readonly createEmail: CreateEmailService
  ) {
    this.appWebUrl =
      process.env.APP_WEB_URL ||
      `http://localhost:${process.env.API_PORT || process.env.PORT || 3000}`;
  }

  public async execute({ name, email }: ISendWelcomeEmail) {
    const templatePath = path.resolve(__dirname, '..', 'views', 'welcome.hbs');

    const subject = '[Nimbus] Bem-vindo(a)!';
    const template = 'welcome';

    const message = {
      to: { name, email },
      subject,
      templateData: {
        file: templatePath,
        variables: {
          name,
          link: `${this.appWebUrl}/#/login`,
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
        to: email,
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
      to: email,
      subject,
      template,
      status: EmailStatus.SENT,
    });
  }
}

export default SendWelcomeEmailService;
