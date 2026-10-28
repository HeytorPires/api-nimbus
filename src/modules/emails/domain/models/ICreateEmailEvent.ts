import { EmailEventSource, EmailStatus } from '../enums/EmailStatus';

export interface ICreateEmailEvent {
  emailId: string;
  status: EmailStatus;
  source: EmailEventSource;
  providerEventId?: string;
  payload?: Record<string, unknown>;
  occurredAt: Date;
}
