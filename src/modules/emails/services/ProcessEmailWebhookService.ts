import { inject, injectable } from 'tsyringe';
import {
  IEmailWebhookEvent,
  IEmailWebhookProvider,
} from '@shared/providers/email/models/IEmailWebhookProvider';
import { EmailWebhookEventType } from '@shared/providers/email/models/EmailWebhookEventType';
import UpdateEmailStatusService from './UpdateEmailStatusService';
import { EmailEventSource, EmailStatus } from '../domain/enums/EmailStatus';

const EVENT_STATUS: Record<EmailWebhookEventType, EmailStatus> = {
  [EmailWebhookEventType.SENT]: EmailStatus.SENT,
  [EmailWebhookEventType.DELIVERED]: EmailStatus.DELIVERED,
  [EmailWebhookEventType.DELIVERY_DELAYED]: EmailStatus.DELIVERY_DELAYED,
  [EmailWebhookEventType.BOUNCED]: EmailStatus.BOUNCED,
  [EmailWebhookEventType.COMPLAINED]: EmailStatus.COMPLAINED,
  [EmailWebhookEventType.FAILED]: EmailStatus.FAILED,
};

interface IRequest {
  rawBody?: Buffer;
  headers: Record<string, string | string[] | undefined>;
}

@injectable()
class ProcessEmailWebhookService {
  constructor(
    @inject('EmailWebhookProvider')
    private readonly emailWebhookProvider: IEmailWebhookProvider,
    @inject(UpdateEmailStatusService)
    private readonly updateEmailStatus: UpdateEmailStatusService
  ) {}

  // Email desconhecido gera 404 de propósito: o provedor reenvia, cobrindo o
  // caso do evento chegar antes de a auditoria ser gravada.
  private async updateStatusFromEvent(
    event: IEmailWebhookEvent,
    type: EmailWebhookEventType
  ): Promise<void> {
    await this.updateEmailStatus.execute({
      providerMessageId: event.providerMessageId,
      status: EVENT_STATUS[type],
      source: EmailEventSource.WEBHOOK,
      providerEventId: event.eventId,
      payload: event.payload,
      occurredAt: event.occurredAt,
    });
  }

  public async execute({ rawBody, headers }: IRequest): Promise<boolean> {
    const event = this.emailWebhookProvider.verify({ rawBody, headers });

    if (!event.type) {
      return false;
    }

    await this.updateStatusFromEvent(event, event.type);

    return true;
  }
}

export default ProcessEmailWebhookService;
