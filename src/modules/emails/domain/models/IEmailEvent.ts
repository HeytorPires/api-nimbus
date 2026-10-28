import { EmailEventSource, EmailStatus } from '../enums/EmailStatus';

export interface IEmailEvent {
  id: string;
  emailId: string;
  status: EmailStatus;
  source: EmailEventSource;
  providerEventId?: string | null;
  payload?: Record<string, unknown> | null;
  occurredAt: Date;
}
