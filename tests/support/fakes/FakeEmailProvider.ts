import { IEmailProvider } from '@shared/providers/email/models/IEmailProvider';
import { ISendMailResult } from '@shared/providers/email/models/ISendMail';

export default class FakeEmailProvider implements IEmailProvider {
  public async sendMail(): Promise<ISendMailResult> {
    // Simulate sending email
    return { provider: 'fake', messageId: 'fake-message-id' };
  }
}
