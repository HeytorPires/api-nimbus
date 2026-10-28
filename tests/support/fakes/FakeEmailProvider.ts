import { IEmailProvider } from '@shared/providers/email/models/IEmailProvider';

export default class FakeEmailProvider implements IEmailProvider {
  public async sendMail(): Promise<void> {
    // Simulate sending email
  }
}
