import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IEmail } from '@modules/emails/domain/models/IEmail';
import { EmailStatus } from '@modules/emails/domain/enums/EmailStatus';

@Entity('emails')
class Email implements IEmail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'provider_message_id', type: 'varchar', nullable: true })
  providerMessageId?: string | null;

  @Column()
  provider: string;

  @Column({ name: 'recipient' })
  to: string;

  @Column()
  subject: string;

  @Column({ type: 'varchar', nullable: true })
  template?: string | null;

  @Column({ type: 'varchar' })
  status: EmailStatus;

  @Column({ name: 'error_message', type: 'text', nullable: true })
  errorMessage?: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

export default Email;
