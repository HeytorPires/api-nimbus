import request from 'supertest';

import app from '@shared/infra/http/app';

import { authenticatedAgent, login } from '@tests/support/helpers/auth';
import { anonymous, missingUuid } from '@tests/support/helpers/http';
import { useFakeEmailProvider } from '@tests/support/helpers/mail';
import { connection } from '@tests/support/setup/database';

describe('Password forgot/reset (integração)', () => {
  beforeEach(() => {
    useFakeEmailProvider();
  });

  describe('POST /password/forgot', () => {
    it('gera um user_token e envia o link de reset por e-mail', async () => {
      const fake = useFakeEmailProvider();
      const { payload } = await authenticatedAgent(app);

      const response = await anonymous(app)
        .post('/password/forgot')
        .send({ email: payload.email });

      expect(response.status).toBe(204);
      expect(fake.messages).toHaveLength(1);
      expect(fake.lastMessage?.to.email).toBe(payload.email);
      expect(fake.lastLink).toContain(process.env.APP_WEB_URL);
      expect(fake.lastToken).toBeTruthy();
    });

    it('rejeita e-mail malformado', async () => {
      const response = await anonymous(app)
        .post('/password/forgot')
        .send({ email: 'nao-e-email' });

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('ValidationError');
    });
  });

  describe('PUT /password/reset', () => {
    it('redefine a senha e passa a autenticar com a nova', async () => {
      const fake = useFakeEmailProvider();
      const { payload } = await authenticatedAgent(app);

      await anonymous(app)
        .post('/password/forgot')
        .send({ email: payload.email });
      const token = fake.lastToken;

      const response = await anonymous(app).put('/password/reset').send({
        token,
        password: 'senha-recuperada',
        passwordConfirmation: 'senha-recuperada',
      });

      expect(response.status).toBe(204);

      const withNew = await login(request.agent(app), {
        email: payload.email,
        password: 'senha-recuperada',
      });
      expect(withNew.status).toBe(200);

      const withOld = await login(request.agent(app), {
        email: payload.email,
        password: payload.password,
      });
      expect(withOld.status).toBe(401);
    });

    it('rejeita token inexistente', async () => {
      const response = await anonymous(app).put('/password/reset').send({
        token: missingUuid,
        password: 'senha-recuperada',
        passwordConfirmation: 'senha-recuperada',
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('User Token does not exists.');
    });

    it('rejeita token expirado (mais de 2h)', async () => {
      const fake = useFakeEmailProvider();
      const { payload } = await authenticatedAgent(app);

      await anonymous(app)
        .post('/password/forgot')
        .send({ email: payload.email });
      const token = fake.lastToken;

      await connection().query(
        `UPDATE user_tokens SET created_at = now() - interval '3 hours' WHERE token = $1`,
        [token]
      );

      const response = await anonymous(app).put('/password/reset').send({
        token,
        password: 'senha-recuperada',
        passwordConfirmation: 'senha-recuperada',
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Token Expired.');
    });

    it('recusa confirmação divergente', async () => {
      const fake = useFakeEmailProvider();
      const { payload } = await authenticatedAgent(app);

      await anonymous(app)
        .post('/password/forgot')
        .send({ email: payload.email });
      const token = fake.lastToken;

      const response = await anonymous(app).put('/password/reset').send({
        token,
        password: 'senha-recuperada',
        passwordConfirmation: 'outra-coisa',
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('As senhas devem coincidir');
    });

    it('rejeita body sem token', async () => {
      const response = await anonymous(app).put('/password/reset').send({
        password: 'senha-recuperada',
        passwordConfirmation: 'senha-recuperada',
      });

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('ValidationError');
    });

    // BUG: ResetPasswordservice.ts não remove nem marca o user_token depois
    // de usado — o mesmo link de reset segue válido até expirar por tempo.
    it('invalida o token depois do primeiro uso', async () => {
      const fake = useFakeEmailProvider();
      const { payload } = await authenticatedAgent(app);

      await anonymous(app)
        .post('/password/forgot')
        .send({ email: payload.email });
      const token = fake.lastToken;

      await anonymous(app).put('/password/reset').send({
        token,
        password: 'primeira-troca',
        passwordConfirmation: 'primeira-troca',
      });

      const secondUse = await anonymous(app).put('/password/reset').send({
        token,
        password: 'segunda-troca',
        passwordConfirmation: 'segunda-troca',
      });

      expect(secondUse.status).toBe(400);
    });
  });
});
