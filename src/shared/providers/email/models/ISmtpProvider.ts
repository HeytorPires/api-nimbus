import { ISendMail } from './ISendMail';

export interface ISmtpProvider {
  sendMail({ from, to, subject, templateData }: ISendMail): Promise<void>;
}
