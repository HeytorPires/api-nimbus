import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IEmailEvent } from '@modules/emails/domain/models/IEmailEvent';
import {
  EmailEventSource,
  EmailStatus,
} from '@modules/emails/domain/enums/EmailStatus';
import Email from './Email';

@Entity('email_events')
class EmailEvent implements IEmailEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'email_id' })
  emailId: string;

  @ManyToOne(() => Email, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'email_id' })
  email: Email;

  @Column({ type: 'varchar' })
  status: EmailStatus;

  @Column({ type: 'varchar' })
  source: EmailEventSource;

  @Column({ name: 'provider_event_id', type: 'varchar', nullable: true })
  providerEventId?: string | null;

  @Column({ type: 'jsonb', nullable: true })
  payload?: Record<string, unknown> | null;

  @Column({ name: 'occurred_at', type: 'timestamp' })
  occurredAt: Date;
}

export default EmailEvent;
