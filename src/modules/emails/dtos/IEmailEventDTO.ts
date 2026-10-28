import { EmailEventSource, EmailStatus } from '../domain/enums/EmailStatus';

export interface IEmailEventDTO {
  id: string;
  status: EmailStatus;
  source: EmailEventSource;
  occurredAt: Date;
}
