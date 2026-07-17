import nodemail, { Transporter } from 'nodemailer';
import { ISendMail } from '../models/ISendMail';
import { ISmtpProvider } from '../models/ISmtpProvider';
import { HandlebarsMailTemplate } from './HandlebarsMailTemplate';

export default class EtherealEmailProvider implements ISmtpProvider {
  private readonly transporter: Transporter;

  constructor(transporter: Transporter) {
    this.transporter = transporter;
  }

  /**
   * Factory method to create EtherealEmailProvider with dynamic test account credentials.
   * Uses Nodemailer's createTestAccount() to generate temporary Ethereal credentials.
   */
  static async create(): Promise<EtherealEmailProvider> {
    try {
      // Generate test account credentials dynamically
      const testAccount = await nodemail.createTestAccount();

      // Create transporter with generated credentials
      const transporter = nodemail.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });

      console.log(`✅ Ethereal Email Provider initialized`);
      console.log(`📧 Test account: ${testAccount.user}`);

      return new EtherealEmailProvider(transporter);
    } catch (error) {
      console.error('❌ Failed to create Ethereal test account:', error);
      throw error;
    }
  }

  async sendMail({
    from,
    to,
    subject,
    templateData,
  }: ISendMail): Promise<void> {
    const mailTemplate = new HandlebarsMailTemplate();
    const html = await mailTemplate.parse(templateData);

    const response = await this.transporter.sendMail({
      from: {
        name: from?.name || 'Default Name',
        address: from?.email || 'default@example.com',
      },
      to: {
        name: to.name,
        address: to.email,
      },
      subject,
      html,
    });

    // Log preview URL for development
    const previewUrl = nodemail.getTestMessageUrl(response);
    if (previewUrl) {
      console.log(`📧 Email Preview: ${previewUrl}`);
    }
  }
}
