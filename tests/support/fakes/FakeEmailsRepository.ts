import { v4 as uuidv4 } from 'uuid';
import { IEmailsRepository } from '@modules/emails/domain/repositories/IEmailsRepository';
import { ICreateEmail } from '@modules/emails/domain/models/ICreateEmail';
import Email from '@modules/emails/infra/typeorm/entities/Email';

class FakeEmailsRepository implements IEmailsRepository {
  public emails: Email[] = [];

  public async create(data: ICreateEmail): Promise<Email> {
    const email = new Email();

    Object.assign(email, data, {
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    this.emails.push(email);

    return email;
  }

  public async findById(id: string): Promise<Email | undefined> {
    return this.emails.find((email) => email.id === id);
  }

  public async findByProviderMessageId(
    providerMessageId: string
  ): Promise<Email | undefined> {
    return this.emails.find(
      (email) => email.providerMessageId === providerMessageId
    );
  }

  public async save(email: Email): Promise<Email> {
    const index = this.emails.findIndex((found) => found.id === email.id);

    this.emails[index] = email;

    return email;
  }
}

export default FakeEmailsRepository;
