import { inject, injectable } from 'tsyringe';
import { IEmailsRepository } from '../domain/repositories/IEmailsRepository';
import { IEmailEventsRepository } from '../domain/repositories/IEmailEventsRepository';
import { ICreateEmail } from '../domain/models/ICreateEmail';
import { IEmail } from '../domain/models/IEmail';
import { EmailEventSource } from '../domain/enums/EmailStatus';

@injectable()
class CreateEmailService {
  constructor(
    @inject('EmailsRepository')
    private readonly emailsRepository: IEmailsRepository,
    @inject('EmailEventsRepository')
    private readonly emailEventsRepository: IEmailEventsRepository
  ) {}

  public async execute(data: ICreateEmail): Promise<IEmail> {
    const email = await this.emailsRepository.create(data);

    await this.recordInitialEvent(email);

    return email;
  }

  // Primeiro evento do histórico: o estado com que o email nasceu
  private async recordInitialEvent(email: IEmail): Promise<void> {
    await this.emailEventsRepository.create({
      emailId: email.id,
      status: email.status,
      source: EmailEventSource.SYSTEM,
      occurredAt: new Date(),
    });
  }
}

export default CreateEmailService;
