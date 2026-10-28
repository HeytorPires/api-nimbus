import { Resend } from 'resend';
import ResendWebhookProvider from '@shared/providers/email/implementations/api/ResendWebhookProvider';
import { EmailWebhookEventType } from '@shared/providers/email/models/EmailWebhookEventType';

jest.mock('resend');

const verifyMock = jest.fn();

const request = {
  rawBody: Buffer.from('{}'),
  headers: {
    'svix-id': 'evt-1',
    'svix-timestamp': '1700000000',
    'svix-signature': 'v1,sig',
  },
};

beforeEach(() => {
  verifyMock.mockReset();
  (Resend as unknown as jest.Mock).mockImplementation(() => ({
    webhooks: { verify: verifyMock },
  }));
  process.env.RESEND_WEBHOOK_SECRET = 'whsec_test';
});

describe('ResendWebhookProvider', () => {
  it('should translate a Resend event into a provider-agnostic one', () => {
    verifyMock.mockReturnValue({
      type: 'email.delivered',
      created_at: '2026-10-28T10:00:00.000Z',
      data: { email_id: 'msg-1' },
    });

    const event = new ResendWebhookProvider().verify(request);

    expect(verifyMock).toHaveBeenCalledWith({
      payload: '{}',
      headers: { id: 'evt-1', timestamp: '1700000000', signature: 'v1,sig' },
      webhookSecret: 'whsec_test',
    });
    expect(event).toMatchObject({
      type: EmailWebhookEventType.DELIVERED,
      eventId: 'evt-1',
      providerMessageId: 'msg-1',
      occurredAt: new Date('2026-10-28T10:00:00.000Z'),
    });
  });

  it('should leave type undefined for events that do not change status', () => {
    verifyMock.mockReturnValue({
      type: 'email.opened',
      created_at: '2026-10-28T10:00:00.000Z',
      data: { email_id: 'msg-1' },
    });

    expect(new ResendWebhookProvider().verify(request).type).toBeUndefined();
  });

  it('should reject an invalid signature', () => {
    verifyMock.mockImplementation(() => {
      throw new Error('invalid');
    });

    expect(() => new ResendWebhookProvider().verify(request)).toThrow(
      expect.objectContaining({ statusCode: 401 })
    );
  });

  it('should reject a request without signature headers', () => {
    expect(() =>
      new ResendWebhookProvider().verify({ ...request, headers: {} })
    ).toThrow(expect.objectContaining({ statusCode: 400 }));
  });
});
