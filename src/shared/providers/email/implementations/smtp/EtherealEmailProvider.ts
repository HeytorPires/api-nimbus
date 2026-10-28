import nodemail, { Transporter } from 'nodemailer';
import { ISendMail, ISendMailResult } from '../../models/ISendMail';
import { IEmailProvider } from '../../models/IEmailProvider';
import { HandlebarsMailTemplate } from '../HandlebarsMailTemplate';

export default class EtherealEmailProvider implements IEmailProvider {
  private transporter?: Transporter;

  /**
   * Cria o transporter sob demanda com uma conta de teste do Ethereal
   * (createTestAccount gera credenciais temporárias).
   */
  private async getTransporter(): Promise<Transporter> {
    if (this.transporter) {
      return this.transporter;
    }

    const testAccount = await nodemail.createTestAccount();

    this.transporter = nodemail.createTransport({
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

    return this.transporter;
  }

  async sendMail({
    from,
    to,
    subject,
    templateData,
  }: ISendMail): Promise<ISendMailResult> {
    const mailTemplate = new HandlebarsMailTemplate();
    const html = await mailTemplate.parse(templateData);

    const transporter = await this.getTransporter();
    const response = await transporter.sendMail({
      from: from
        ? `${from.name} <${from.email}>`
        : 'Nimbus <no-reply@ethereal.email>',
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

    return { provider: 'ethereal', messageId: response.messageId };
  }
}
