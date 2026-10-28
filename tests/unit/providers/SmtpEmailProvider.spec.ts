import nodemailer from 'nodemailer';
import SmtpEmailProvider from '@shared/providers/email/implementations/smtp/SmtpEmailProvider';
import path from 'node:path';

jest.mock('nodemailer');

const sendMailMock = jest.fn();

beforeAll(() => {
  (nodemailer.createTransport as jest.Mock).mockReturnValue({
    sendMail: sendMailMock,
  });
});

beforeEach(() => {
  sendMailMock.mockReset();
  sendMailMock.mockResolvedValue({ messageId: 'smtp-message-id' });
});

const templatePath = path.resolve(
  __dirname,
  '../../../src/modules/users/views/forgot_password.hbs'
);

describe('Send email', () => {
  it('should be able to send email', async () => {
    const provider = new SmtpEmailProvider();

    await provider.sendMail({
      to: { name: 'Pires', email: 'pires@email.com' },
      subject: 'Teste de Email',
      templateData: {
        file: templatePath,
        variables: {
          name: 'Pires',
          link: 'http://localhost:3000/reset',
        },
      },
    });

    expect(sendMailMock).toHaveBeenCalledTimes(1);
    expect(sendMailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        to: { name: 'Pires', address: 'pires@email.com' },
        subject: 'Teste de Email',
      })
    );
  });

  it('should use the default sender when from is not provided', async () => {
    const provider = new SmtpEmailProvider();

    await provider.sendMail({
      to: { name: 'Pires', email: 'pires@email.com' },
      subject: 'Sem remetente',
      templateData: {
        file: templatePath,
        variables: {
          name: 'Pires',
          link: 'http://localhost:3000/reset',
        },
      },
    });

    expect(sendMailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        from: 'Nimbus <no-reply@nimbus.com.br>',
      })
    );
  });

  it('should use custom from when provided', async () => {
    const provider = new SmtpEmailProvider();

    await provider.sendMail({
      to: { name: 'Pires', email: 'pires@email.com' },
      from: { name: 'Nimbus', email: 'nimbus@email.com' },
      subject: 'Com remetente',
      templateData: {
        file: templatePath,
        variables: {
          name: 'Pires',
          link: 'http://localhost:3000/reset',
        },
      },
    });

    expect(sendMailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        from: 'Nimbus <nimbus@email.com>',
      })
    );
  });
});
