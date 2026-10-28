import { getRepository, Repository } from 'typeorm';
import { IEmailsRepository } from '@modules/emails/domain/repositories/IEmailsRepository';
import { ICreateEmail } from '@modules/emails/domain/models/ICreateEmail';
import Email from '../entities/Email';

export default class EmailsRepository implements IEmailsRepository {
  private ormRepository: Repository<Email>;

  constructor() {
    this.ormRepository = getRepository(Email);
  }

  public async create(data: ICreateEmail): Promise<Email> {
    const email = this.ormRepository.create(data);
    await this.ormRepository.save(email);
    return email;
  }

  public async findById(id: string): Promise<Email | undefined> {
    return this.ormRepository.findOne({ where: { id } });
  }

  public async findByProviderMessageId(
    providerMessageId: string
  ): Promise<Email | undefined> {
    return this.ormRepository.findOne({ where: { providerMessageId } });
  }

  public async save(email: Email): Promise<Email> {
    await this.ormRepository.save(email);
    return email;
  }
}
