import { ISendMail } from './ISendMail';

export interface IEmailProvider {
  sendMail({ from, to, subject, templateData }: ISendMail): Promise<void>;
}
