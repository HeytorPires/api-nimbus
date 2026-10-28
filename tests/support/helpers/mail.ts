import { container } from 'tsyringe';

import { IEmailProvider } from '@shared/providers/email/models/IEmailProvider';
import {
  ISendMail,
  ISendMailResult,
} from '@shared/providers/email/models/ISendMail';

export class FakeEmailProvider implements IEmailProvider {
  public readonly messages: ISendMail[] = [];

  public async sendMail(message: ISendMail): Promise<ISendMailResult> {
    this.messages.push(message);

    return {
      provider: 'fake',
      messageId: `fake-message-${this.messages.length}`,
    };
  }

  public get lastMessage(): ISendMail | undefined {
    return this.messages[this.messages.length - 1];
  }

  public get lastLink(): string {
    return String(this.lastMessage?.templateData.variables.link ?? '');
  }

  public get lastToken(): string {
    return this.lastLink.split('token=')[1] ?? '';
  }
}

/**
 * Substitui o EmailProvider do container por um fake.
 *
 * Necessário porque no teste o MAIL_DRIVER é `smtp` (SmtpEmailProvider, SMTP real)
 * e o container não sabe que está sob teste. Os services são resolvidos por request,
 * então o override vale a partir da requisição seguinte.
 */
export function useFakeEmailProvider(): FakeEmailProvider {
  const fake = new FakeEmailProvider();

  container.registerInstance<IEmailProvider>('EmailProvider', fake);

  return fake;
}
