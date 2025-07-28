// import nodemailer from 'nodemailer';
// import EtherealMail from '../../../src/config/mail/EtherealMail';
// import path from 'path';

// jest.mock('nodemailer');

// const sendMailMock = jest.fn();

// beforeAll(() => {
//   // Mock da função createTestAccount
//   (nodemailer.createTestAccount as jest.Mock).mockResolvedValue({
//     smtp: {
//       host: 'smtp.ethereal.email',
//       port: 587,
//       secure: false,
//     },
//     user: 'usuario@ethereal.email',
//     pass: 'senhaFake',
//   });

//   // Mock da função createTransport
//   (nodemailer.createTransport as jest.Mock).mockReturnValue({
//     sendMail: sendMailMock,
//   });
// });
// const templatePath = path.resolve(
//   __dirname,
//   '../../../../src/modules/users/views/forgot_password.hbs'
// );
// describe('Send email', () => {
//   it('should be able send email', async () => {
//     await EtherealMail.sendMail({
//       to: { name: 'Pires', email: 'pires@email.com' },
//       subject: 'Teste de Email',
//       templateDate: {
//         file: templatePath,
//         variables: {
//           name: 'Pires',
//         },
//       },
//     });

//     expect(sendMailMock).toHaveBeenCalled();
//   });
// });
