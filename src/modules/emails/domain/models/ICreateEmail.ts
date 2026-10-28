import { EmailStatus } from '../enums/EmailStatus';

export interface ICreateEmail {
  providerMessageId?: string;
  provider: string;
  to: string;
  subject: string;
  template?: string;
  status: EmailStatus;
  errorMessage?: string;
}
