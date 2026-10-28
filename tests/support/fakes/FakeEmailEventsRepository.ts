import { v4 as uuidv4 } from 'uuid';
import { IEmailEventsRepository } from '@modules/emails/domain/repositories/IEmailEventsRepository';
import { ICreateEmailEvent } from '@modules/emails/domain/models/ICreateEmailEvent';
import EmailEvent from '@modules/emails/infra/typeorm/entities/EmailEvent';

class FakeEmailEventsRepository implements IEmailEventsRepository {
  public events: EmailEvent[] = [];

  public async create(data: ICreateEmailEvent): Promise<EmailEvent> {
    const event = new EmailEvent();

    Object.assign(event, data, { id: uuidv4() });

    this.events.push(event);

    return event;
  }

  public async findByProviderEventId(
    providerEventId: string
  ): Promise<EmailEvent | undefined> {
    return this.events.find(
      (event) => event.providerEventId === providerEventId
    );
  }

  public async listByEmailId(emailId: string): Promise<EmailEvent[]> {
    return this.events.filter((event) => event.emailId === emailId);
  }
}

export default FakeEmailEventsRepository;
