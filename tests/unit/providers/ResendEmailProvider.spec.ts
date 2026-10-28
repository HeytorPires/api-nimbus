import { Resend } from 'resend';
import ResendEmailProvider from '@shared/providers/email/implementations/api/ResendEmailProvider';
import path from 'node:path';

jest.mock('resend');

const sendMock = jest.fn();

const templatePath = path.resolve(
  __dirname,
  '../../../src/modules/users/views/forgot_password.hbs'
);

const message = {
  to: { name: 'Pires', email: 'pires@email.com' },
  subject: 'Teste de Email',
  templateData: {
    file: templatePath,
    variables: { name: 'Pires', link: 'http://localhost:3000/reset' },
  },
};

beforeEach(() => {
  sendMock.mockReset();
  (Resend as unknown as jest.Mock).mockImplementation(() => ({
    emails: { send: sendMock },
  }));
  process.env.RESEND_API_KEY = 're_test_key';
});

describe('ResendEmailProvider', () => {
  it('should send the rendered template through the Resend API', async () => {
    sendMock.mockResolvedValue({ data: { id: 'email-id' }, error: null });
    const provider = new ResendEmailProvider();

    const result = await provider.sendMail(message);

    expect(result).toEqual({ provider: 'resend', messageId: 'email-id' });
    expect(Resend).toHaveBeenCalledWith('re_test_key');
    expect(sendMock).toHaveBeenCalledTimes(1);
    expect(sendMock).toHaveBeenCalledWith(
      expect.objectContaining({
        from: 'Nimbus <no-reply@nimbus.com.br>',
        to: 'Pires <pires@email.com>',
        subject: 'Teste de Email',
        html: expect.stringContaining('http://localhost:3000/reset'),
      })
    );
  });

  it('should use the custom from when provided', async () => {
    sendMock.mockResolvedValue({ data: { id: 'email-id' }, error: null });
    const provider = new ResendEmailProvider();

    await provider.sendMail({
      ...message,
      from: { name: 'Equipe', email: 'equipe@nimbus.test' },
    });

    expect(sendMock).toHaveBeenCalledWith(
      expect.objectContaining({ from: 'Equipe <equipe@nimbus.test>' })
    );
  });

  it('should throw when the Resend API returns an error', async () => {
    sendMock.mockResolvedValue({
      data: null,
      error: { name: 'validation_error', message: 'Invalid from address' },
    });
    const provider = new ResendEmailProvider();

    await expect(provider.sendMail(message)).rejects.toMatchObject({
      context: 'ResendEmailProvider',
      statusCode: 502,
    });
  });
});
