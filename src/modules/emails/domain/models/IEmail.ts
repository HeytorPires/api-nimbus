import { EmailStatus } from '../enums/EmailStatus';

export interface IEmail {
  id: string;
  providerMessageId?: string | null;
  provider: string;
  to: string;
  subject: string;
  template?: string | null;
  status: EmailStatus;
  errorMessage?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
