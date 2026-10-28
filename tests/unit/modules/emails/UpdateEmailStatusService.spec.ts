import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import UpdateEmailStatusService from '@modules/emails/services/UpdateEmailStatusService';
import {
  EmailEventSource,
  EmailStatus,
} from '@modules/emails/domain/enums/EmailStatus';
import FakeEmailsRepository from '@tests/support/fakes/FakeEmailsRepository';
import FakeEmailEventsRepository from '@tests/support/fakes/FakeEmailEventsRepository';

let fakeEmailsRepository: FakeEmailsRepository;
let fakeEmailEventsRepository: FakeEmailEventsRepository;
let updateEmailStatus: UpdateEmailStatusService;

const createEmail = () =>
  fakeEmailsRepository.create({
    provider: 'resend',
    providerMessageId: 'msg-1',
    to: 'joao@gmail.com',
    subject: 'Teste',
    status: EmailStatus.SENT,
  });

describe('UpdateEmailStatus', () => {
  beforeEach(() => {
    fakeEmailsRepository = new FakeEmailsRepository();
    fakeEmailEventsRepository = new FakeEmailEventsRepository();
    updateEmailStatus = new UpdateEmailStatusService(
      fakeEmailsRepository,
      fakeEmailEventsRepository
    );
  });

  it('should update status from a webhook event', async () => {
    await createEmail();

    const email = await updateEmailStatus.execute({
      providerMessageId: 'msg-1',
      status: EmailStatus.DELIVERED,
      source: EmailEventSource.WEBHOOK,
      providerEventId: 'evt-1',
    });

    expect(email.status).toBe(EmailStatus.DELIVERED);
    expect(fakeEmailEventsRepository.events).toHaveLength(1);
  });

  it('should not regress status when an older event arrives late', async () => {
    await createEmail();

    await updateEmailStatus.execute({
      providerMessageId: 'msg-1',
      status: EmailStatus.DELIVERED,
      source: EmailEventSource.WEBHOOK,
      providerEventId: 'evt-1',
    });
    const email = await updateEmailStatus.execute({
      providerMessageId: 'msg-1',
      status: EmailStatus.SENT,
      source: EmailEventSource.WEBHOOK,
      providerEventId: 'evt-2',
    });

    expect(email.status).toBe(EmailStatus.DELIVERED);
    // o evento atrasado continua no histórico
    expect(fakeEmailEventsRepository.events).toHaveLength(2);
  });

  it('should ignore a duplicated provider event', async () => {
    await createEmail();
    const request = {
      providerMessageId: 'msg-1',
      status: EmailStatus.DELIVERED,
      source: EmailEventSource.WEBHOOK,
      providerEventId: 'evt-1',
    };

    await updateEmailStatus.execute(request);
    await updateEmailStatus.execute(request);

    expect(fakeEmailEventsRepository.events).toHaveLength(1);
  });

  it('should apply manual changes even when they lower the status', async () => {
    const created = await createEmail();

    await updateEmailStatus.execute({
      emailId: created.id,
      status: EmailStatus.DELIVERED,
      source: EmailEventSource.MANUAL,
    });
    const email = await updateEmailStatus.execute({
      emailId: created.id,
      status: EmailStatus.QUEUED,
      source: EmailEventSource.MANUAL,
    });

    expect(email.status).toBe(EmailStatus.QUEUED);
  });

  it('should throw when the email does not exist', async () => {
    await expect(
      updateEmailStatus.execute({
        providerMessageId: 'unknown',
        status: EmailStatus.DELIVERED,
        source: EmailEventSource.WEBHOOK,
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
