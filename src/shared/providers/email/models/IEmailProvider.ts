import { ISendMail, ISendMailResult } from './ISendMail';

export interface IEmailProvider {
  sendMail({
    from,
    to,
    subject,
    templateData,
  }: ISendMail): Promise<ISendMailResult>;
}
