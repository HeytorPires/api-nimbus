import nodemail, { Transporter } from 'nodemailer';
import { ISendMail } from '../models/ISendMail';
import { ISmtpProvider } from '../models/ISmtpProvider';
import { HandlebarsMailTemplate } from './HandlebarsMailTemplate';

export default class NodeMailerProvider implements ISmtpProvider {
  private readonly transporter: Transporter;

  constructor() {
    this.transporter = nodemail.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  async sendMail({
    from,
    to,
    subject,
    templateData,
  }: ISendMail): Promise<void> {
    const mailTemplate = new HandlebarsMailTemplate();
    const html = await mailTemplate.parse(templateData);

    await this.transporter.sendMail({
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
  }
}
