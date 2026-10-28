import { Resend } from 'resend';
import AppError from '@shared/errors/AppError';
import { ISendMail, ISendMailResult } from '../../models/ISendMail';
import { IEmailProvider } from '../../models/IEmailProvider';
import { HandlebarsMailTemplate } from '../HandlebarsMailTemplate';

// Remetente padrão; o domínio precisa estar verificado no Resend
const DEFAULT_FROM = 'Nimbus <no-reply@heytor.com.br>';

export default class ResendEmailProvider implements IEmailProvider {
  private readonly client: Resend;

  constructor() {
    const apiKey = process.env.RESEND_API_KEY;

    this.client = new Resend(apiKey);
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

    // O SDK não lança em falha da API: devolve { data, error }.
    const { data, error } = await this.client.emails.send({
      from: sender,
      to: `${to.name} <${to.email}>`,
      subject,
      html,
    });

    if (error) {
      throw new AppError(
        `Failed to send email: ${error.message}`,
        'ResendEmailProvider',
        502
      );
    }

    return { provider: 'resend', messageId: data?.id };
  }
}
