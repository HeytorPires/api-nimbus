import nodemailer from 'nodemailer';
import NodeMailerProvider from '../../../src/shared/providers/email/implementations/NodeMailerProvider';
import path from 'path';

jest.mock('nodemailer');

const sendMailMock = jest.fn();

beforeAll(() => {
  (nodemailer.createTransport as jest.Mock).mockReturnValue({
    sendMail: sendMailMock,
  });
});

beforeEach(() => {
  sendMailMock.mockClear();
});

const templatePath = path.resolve(
  __dirname,
  '../../../src/modules/users/views/forgot_password.hbs'
);

describe('Send email', () => {
  it('should be able to send email', async () => {
    const provider = new NodeMailerProvider();

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

  it('should use default from when not provided', async () => {
    const provider = new NodeMailerProvider();

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
        from: { name: 'Default Name', address: 'default@example.com' },
      })
    );
  });

  it('should use custom from when provided', async () => {
    const provider = new NodeMailerProvider();

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
        from: { name: 'Nimbus', address: 'nimbus@email.com' },
      })
    );
  });
});
