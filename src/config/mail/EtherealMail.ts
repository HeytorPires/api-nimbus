import nodemail from 'nodemailer';
import handlebarsMailTemplate from './HandlebarsMailTemplate';

interface ITemplateVariable {
  [key: string]: string | number;
}

interface IParseMailTemplate {
  file: string;
  variables: ITemplateVariable;
}

interface IMailContact {
  name: string;
  email: string;
}
interface ISendMail {
  to: IMailContact;
  from?: IMailContact;
  subject: string;
  templateDate: IParseMailTemplate;
}

export default class EtherealMail {
  static async sendMail({
    to,
    from,
    subject,
    templateDate,
  }: ISendMail): Promise<void> {
    const account = await nodemail.createTestAccount();
    const mailTemplate = new handlebarsMailTemplate();

    const transporter = nodemail.createTransport({
      host: account.smtp.host,
      port: account.smtp.port,
      secure: account.smtp.secure,
      auth: {
        user: account.user,
        pass: account.pass,
      },
    });
    const message = await transporter.sendMail({
      from: {
        name: to.name,
        address: from?.email || 'equipe@apivendas.com.br',
      },
      to: {
        name: to.name,
        address: to.email,
      },
      subject,
      html: await mailTemplate.parse(templateDate),
    });

    console.log('Message sent: %s', message.messageId);
    console.log('Preview URL: %s', nodemail.getTestMessageUrl(message));
  }
}
