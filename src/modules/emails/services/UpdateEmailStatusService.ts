import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import { IEmailsRepository } from '../domain/repositories/IEmailsRepository';
import { IEmailEventsRepository } from '../domain/repositories/IEmailEventsRepository';
import { IEmail } from '../domain/models/IEmail';
import {
  EMAIL_STATUS_RANK,
  EmailEventSource,
  EmailStatus,
} from '../domain/enums/EmailStatus';

interface IRequest {
  // Informe um dos dois: id interno (manual) ou id do provedor (webhook)
  emailId?: string;
  providerMessageId?: string;
  status: EmailStatus;
  source: EmailEventSource;
  providerEventId?: string;
  payload?: Record<string, unknown>;
  occurredAt?: Date;
}

@injectable()
class UpdateEmailStatusService {
  constructor(
    @inject('EmailsRepository')
    private readonly emailsRepository: IEmailsRepository,
    @inject('EmailEventsRepository')
    private readonly emailEventsRepository: IEmailEventsRepository
  ) {}

  private async findEmail({
    emailId,
    providerMessageId,
  }: IRequest): Promise<IEmail> {
    let email: IEmail | undefined;

    if (emailId) {
      email = await this.emailsRepository.findById(emailId);
    } else if (providerMessageId) {
      email =
        await this.emailsRepository.findByProviderMessageId(providerMessageId);
    }

    if (!email) {
      throw new AppError('Email not found.', 'UpdateEmailStatusService', 404);
    }

    return email;
  }

  private async isDuplicatedEvent(providerEventId?: string): Promise<boolean> {
    if (!providerEventId) {
      return false;
    }

    const existing =
      await this.emailEventsRepository.findByProviderEventId(providerEventId);

    return Boolean(existing);
  }

  private shouldUpdateStatus(
    email: IEmail,
    { status, source }: IRequest
  ): boolean {
    return (
      source === EmailEventSource.MANUAL ||
      EMAIL_STATUS_RANK[status] >= EMAIL_STATUS_RANK[email.status]
    );
  }

  private async recordEvent(
    email: IEmail,
    { status, source, providerEventId, payload, occurredAt }: IRequest
  ): Promise<void> {
    await this.emailEventsRepository.create({
      emailId: email.id,
      status,
      source,
      providerEventId,
      payload,
      occurredAt: occurredAt ?? new Date(),
    });
  }

  private async updateStatus(
    email: IEmail,
    status: EmailStatus
  ): Promise<IEmail> {
    email.status = status;

    return this.emailsRepository.save(email);
  }

  public async execute(request: IRequest): Promise<IEmail> {
    const email = await this.findEmail(request);

    if (await this.isDuplicatedEvent(request.providerEventId)) {
      return email;
    }

    // O evento é gravado antes: se a atualização do status falhar, o histórico
    // não perde o que o provedor informou.
    await this.recordEvent(email, request);

    if (!this.shouldUpdateStatus(email, request)) {
      return email;
    }

    return this.updateStatus(email, request.status);
  }
}

export default UpdateEmailStatusService;
