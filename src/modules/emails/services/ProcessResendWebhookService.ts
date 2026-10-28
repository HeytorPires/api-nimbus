import { inject, injectable } from 'tsyringe';
import { Resend } from 'resend';
import AppError from '@shared/errors/AppError';
import UpdateEmailStatusService from './UpdateEmailStatusService';
import { EmailEventSource, EmailStatus } from '../domain/enums/EmailStatus';

// Eventos do Resend que alteram o status; os demais (opened, clicked...) são
// ignorados para o provedor não reenviar.
const EVENT_STATUS: Record<string, EmailStatus> = {
  'email.sent': EmailStatus.SENT,
  'email.delivered': EmailStatus.DELIVERED,
  'email.delivery_delayed': EmailStatus.DELIVERY_DELAYED,
  'email.bounced': EmailStatus.BOUNCED,
  'email.complained': EmailStatus.COMPLAINED,
  'email.failed': EmailStatus.FAILED,
};

interface IRequest {
  rawBody?: Buffer;
  svixId?: string;
  svixTimestamp?: string;
  svixSignature?: string;
}

@injectable()
class ProcessResendWebhookService {
  constructor(
    @inject(UpdateEmailStatusService)
    private readonly updateEmailStatus: UpdateEmailStatusService
  ) {}

  // Retorna false quando o evento é válido mas não altera status
  public async execute({
    rawBody,
    svixId,
    svixTimestamp,
    svixSignature,
  }: IRequest): Promise<boolean> {
    const secret = process.env.RESEND_WEBHOOK_SECRET;

    if (!secret || !rawBody || !svixId || !svixTimestamp || !svixSignature) {
      throw new AppError(
        'Invalid webhook request.',
        'ProcessResendWebhookService',
        400
      );
    }

    let event;

    try {
      event = new Resend(process.env.RESEND_API_KEY).webhooks.verify({
        payload: rawBody.toString('utf8'),
        headers: {
          id: svixId,
          timestamp: svixTimestamp,
          signature: svixSignature,
        },
        webhookSecret: secret,
      });
    } catch {
      throw new AppError(
        'Invalid webhook signature.',
        'ProcessResendWebhookService',
        401
      );
    }

    const status = EVENT_STATUS[event.type];

    if (!status) {
      return false;
    }

    const { email_id: providerMessageId } = event.data as { email_id: string };

    // Email desconhecido gera 404 de propósito: o Resend reenvia, cobrindo o
    // caso do evento chegar antes de a auditoria ser gravada.
    await this.updateEmailStatus.execute({
      providerMessageId,
      status,
      source: EmailEventSource.WEBHOOK,
      providerEventId: svixId,
      payload: event as unknown as Record<string, unknown>,
      occurredAt: new Date(event.created_at),
    });

    return true;
  }
}

export default ProcessResendWebhookService;
