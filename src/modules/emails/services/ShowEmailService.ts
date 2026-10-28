import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import { IEmailsRepository } from '../domain/repositories/IEmailsRepository';
import { IEmailEventsRepository } from '../domain/repositories/IEmailEventsRepository';
import { IEmailDTO } from '../domain/models/IEmailDTO';

@injectable()
class ShowEmailService {
  constructor(
    @inject('EmailsRepository')
    private readonly emailsRepository: IEmailsRepository,
    @inject('EmailEventsRepository')
    private readonly emailEventsRepository: IEmailEventsRepository
  ) {}

  public async execute(id: string): Promise<IEmailDTO> {
    const email = await this.emailsRepository.findById(id);

    if (!email) {
      throw new AppError('Email not found.', 'ShowEmailService', 404);
    }

    const events = await this.emailEventsRepository.listByEmailId(id);

    return { ...email, events } as IEmailDTO;
  }
}

export default ShowEmailService;
