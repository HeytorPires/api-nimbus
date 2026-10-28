import { getRepository, Repository } from 'typeorm';
import { IEmailEventsRepository } from '@modules/emails/domain/repositories/IEmailEventsRepository';
import { ICreateEmailEvent } from '@modules/emails/domain/models/ICreateEmailEvent';
import EmailEvent from '../entities/EmailEvent';

export default class EmailEventsRepository implements IEmailEventsRepository {
  private ormRepository: Repository<EmailEvent>;

  constructor() {
    this.ormRepository = getRepository(EmailEvent);
  }

  public async create(data: ICreateEmailEvent): Promise<EmailEvent> {
    const event = this.ormRepository.create(data);
    await this.ormRepository.save(event);
    return event;
  }

  public async findByProviderEventId(
    providerEventId: string
  ): Promise<EmailEvent | undefined> {
    return this.ormRepository.findOne({ where: { providerEventId } });
  }

  public async listByEmailId(emailId: string): Promise<EmailEvent[]> {
    return this.ormRepository.find({
      where: { emailId },
      order: { occurredAt: 'ASC' },
    });
  }
}
