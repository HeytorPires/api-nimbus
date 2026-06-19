import { ISmtpProvider } from '@shared/providers/email/models/ISmtpProvider';

export default class FakeEmailProvider implements ISmtpProvider {
  public async sendMail(): Promise<void> {
    // Simulate sending email
  }
}
