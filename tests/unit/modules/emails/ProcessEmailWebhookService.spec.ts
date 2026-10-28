import 'reflect-metadata';
import ProcessEmailWebhookService from '@modules/emails/services/ProcessEmailWebhookService';
import UpdateEmailStatusService from '@modules/emails/services/UpdateEmailStatusService';
import { EmailStatus } from '@modules/emails/domain/enums/EmailStatus';
import { EmailWebhookEventType } from '@shared/providers/email/models/EmailWebhookEventType';
import FakeEmailsRepository from '@tests/support/fakes/FakeEmailsRepository';
import FakeEmailEventsRepository from '@tests/support/fakes/FakeEmailEventsRepository';
import FakeEmailWebhookProvider from '@tests/support/fakes/FakeEmailWebhookProvider';

let fakeEmailsRepository: FakeEmailsRepository;
let fakeEmailEventsRepository: FakeEmailEventsRepository;
let fakeEmailWebhookProvider: FakeEmailWebhookProvider;
let processEmailWebhook: ProcessEmailWebhookService;

const request = { rawBody: Buffer.from('{}'), headers: {} };

describe('ProcessEmailWebhook', () => {
  beforeEach(async () => {
    fakeEmailsRepository = new FakeEmailsRepository();
    fakeEmailEventsRepository = new FakeEmailEventsRepository();
    fakeEmailWebhookProvider = new FakeEmailWebhookProvider();
    processEmailWebhook = new ProcessEmailWebhookService(
      fakeEmailWebhookProvider,
      new UpdateEmailStatusService(
        fakeEmailsRepository,
        fakeEmailEventsRepository
      )
    );

    await fakeEmailsRepository.create({
      provider: 'resend',
      providerMessageId: 'msg-1',
      to: 'joao@gmail.com',
      subject: 'Teste',
      status: EmailStatus.SENT,
    });
  });

  it('should update the email status from a verified event', async () => {
    fakeEmailWebhookProvider.event = {
      type: EmailWebhookEventType.DELIVERED,
      eventId: 'evt-1',
      providerMessageId: 'msg-1',
      occurredAt: new Date(),
      payload: {},
    };

    await expect(processEmailWebhook.execute(request)).resolves.toBe(true);
    expect(fakeEmailsRepository.emails[0].status).toBe(EmailStatus.DELIVERED);
    expect(fakeEmailEventsRepository.events[0].providerEventId).toBe('evt-1');
  });

  it('should ignore events that do not change status', async () => {
    fakeEmailWebhookProvider.event = {
      eventId: 'evt-2',
      providerMessageId: 'msg-1',
      occurredAt: new Date(),
      payload: {},
    };

    await expect(processEmailWebhook.execute(request)).resolves.toBe(false);
    expect(fakeEmailsRepository.emails[0].status).toBe(EmailStatus.SENT);
    expect(fakeEmailEventsRepository.events).toHaveLength(0);
  });
});
