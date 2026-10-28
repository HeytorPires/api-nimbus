import { EmailStatus } from '../domain/enums/EmailStatus';
import { IEmailEventDTO } from './IEmailEventDTO';

export interface IEmailDTO {
  id: string;
  provider: string;
  providerMessageId?: string | null;
  to: string;
  subject: string;
  template?: string | null;
  status: EmailStatus;
  errorMessage?: string | null;
  createdAt: Date;
  updatedAt: Date;
  events: IEmailEventDTO[];
}
