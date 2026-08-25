import { container } from 'tsyringe';

import { ISmtpProvider } from '@shared/providers/email/models/ISmtpProvider';
import { ISendMail } from '@shared/providers/email/models/ISendMail';

export class FakeEmailProvider implements ISmtpProvider {
  public readonly messages: ISendMail[] = [];

  public async sendMail(message: ISendMail): Promise<void> {
    this.messages.push(message);
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
 * Necessário porque NODE_ENV=test cai no NodeMailerProvider (SMTP real) —
 * apenas `development` usa o Ethereal. Os services são resolvidos por request,
 * então o override vale a partir da requisição seguinte.
 */
export function useFakeEmailProvider(): FakeEmailProvider {
  const fake = new FakeEmailProvider();

  container.registerInstance<ISmtpProvider>('EmailProvider', fake);

  return fake;
}
