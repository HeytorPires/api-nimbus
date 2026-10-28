import nodemail, { Transporter } from 'nodemailer';
import { ISendMail, ISendMailResult } from '../../models/ISendMail';
import { IEmailProvider } from '../../models/IEmailProvider';
import { HandlebarsMailTemplate } from '../HandlebarsMailTemplate';

// Remetente padrão dos e-mails enviados por este provider
const DEFAULT_FROM = 'Nimbus <no-reply@nimbus.com.br>';

export default class SmtpEmailProvider implements IEmailProvider {
  private readonly transporter: Transporter;

  constructor() {
    // SMTP configurado por MAIL_HOST/MAIL_PORT/MAIL_USER/MAIL_PASS
    this.transporter = nodemail.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      secure: true,
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
  }: ISendMail): Promise<ISendMailResult> {
    const mailTemplate = new HandlebarsMailTemplate();
    const html = await mailTemplate.parse(templateData);
    const sender = from ? `${from.name} <${from.email}>` : DEFAULT_FROM;

    const info = await this.transporter.sendMail({
      from: sender,
      to: {
        name: to.name,
        address: to.email,
      },
      subject,
      html,
    });

    return { provider: 'smtp', messageId: info.messageId };
  }
}
