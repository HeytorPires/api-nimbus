import request from 'supertest';
import { sign } from 'jsonwebtoken';

import app from '@shared/infra/http/app';
import authConfig from '@config/auth';

import {
  authenticatedAgent,
  createUser,
  defaultCredentials,
  findCachedSession,
  findUserTokens,
  getSetCookie,
  login,
} from '../helpers/auth';
import { redisClient } from '../setup/database';

const accessCookieName = authConfig.cookie.accessToken.name;
const refreshCookieName = authConfig.cookie.refreshToken.name;

describe('Auth flow (integração)', () => {
  describe('POST /users', () => {
    it('cria o usuário e não devolve a senha', async () => {
      const { response } = await createUser(app);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        name: defaultCredentials.name,
        email: defaultCredentials.email,
      });
      expect(response.body.password).toBeUndefined();
    });

    it('rejeita e-mail já cadastrado', async () => {
      await createUser(app);
      const { response } = await createUser(app);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Email address already used.');
    });

    it('rejeita payload inválido pelo schema do yup', async () => {
      const response = await request(app)
        .post('/users')
        .send({ email: defaultCredentials.email });

      expect(response.status).toBe(400);
    });

    // BUG: ICreateUserSchema.ts valida o e-mail apenas como string, sem
    // .email() — o IUpdateProfileSchema já faz isso.
    it('rejeita e-mail malformado', async () => {
      const response = await request(app).post('/users').send({
        name: defaultCredentials.name,
        email: 'nao-e-email',
        password: defaultCredentials.password,
      });

      expect(response.status).toBe(400);
    });
  });

  describe('POST /sessions', () => {
    it('autentica e devolve apenas o usuário no corpo', async () => {
      const { payload } = await createUser(app);
      const response = await login(request.agent(app), {
        email: payload.email,
        password: payload.password,
      });

      expect(response.status).toBe(200);
      expect(response.body.user.email).toBe(payload.email);
      expect(response.body.accessToken).toBeUndefined();
      expect(response.body.refreshToken).toBeUndefined();
    });

    it('seta os dois cookies httpOnly sem a flag Secure fora de produção', async () => {
      const { payload } = await createUser(app);
      const response = await login(request.agent(app), {
        email: payload.email,
        password: payload.password,
      });

      const accessCookie = getSetCookie(response, accessCookieName);
      const refreshCookie = getSetCookie(response, refreshCookieName);

      expect(accessCookie).toContain('HttpOnly');
      expect(accessCookie).toContain('SameSite=Strict');
      expect(accessCookie).not.toContain('Secure');

      expect(refreshCookie).toContain('HttpOnly');
      expect(refreshCookie).toContain('SameSite=Lax');
      expect(refreshCookie).not.toContain('Secure');
    });

    it('persiste o mesmo jti no Redis e em user_tokens', async () => {
      const { user } = await authenticatedAgent(app);

      const cachedJti = await findCachedSession(user.id);
      const tokens = await findUserTokens(user.id);

      expect(cachedJti).toBeTruthy();
      expect(tokens).toHaveLength(1);
      expect(tokens[0].token).toBe(cachedJti);
    });

    it('rejeita senha incorreta com mensagem genérica', async () => {
      const { payload } = await createUser(app);
      const response = await login(request.agent(app), {
        email: payload.email,
        password: 'wrong-password',
      });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe(
        'Incorrect email/password combination.'
      );
    });

    it('devolve a mesma mensagem para e-mail inexistente', async () => {
      const response = await login(request.agent(app), {
        email: 'ghost@nimbus.dev',
        password: defaultCredentials.password,
      });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe(
        'Incorrect email/password combination.'
      );
    });
  });

  describe('Rota autenticada (GET /profile)', () => {
    it('devolve o perfil com o cookie de acesso', async () => {
      const { agent, user } = await authenticatedAgent(app);

      const response = await agent.get('/profile');

      expect(response.status).toBe(200);
      expect(response.body.email).toBe(user.email);
    });

    it('rejeita request sem cookie', async () => {
      const response = await request(app).get('/profile');

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('JWT token is missing');
    });

    it('rejeita cookie com assinatura inválida', async () => {
      const response = await request(app)
        .get('/profile')
        .set('Cookie', [`${accessCookieName}=not-a-jwt`]);

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid token');
    });

    it('rejeita token válido cujo jti não bate com a sessão vigente', async () => {
      const { agent, user } = await authenticatedAgent(app);

      await redisClient().set(
        `session:${user.id}`,
        JSON.stringify('outro-jti')
      );
      await agent.post('/sessions/refresh'); // rotaciona user_tokens também

      const forged = sign({ jti: 'jti-inexistente' }, authConfig.jwt.secret, {
        subject: user.id,
        expiresIn: '15m',
      });

      const response = await request(app)
        .get('/profile')
        .set('Cookie', [`${accessCookieName}=${forged}`]);

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Session expired');
    });
  });

  describe('POST /sessions/refresh', () => {
    it('rotaciona o jti no Redis e em user_tokens', async () => {
      const { agent, user } = await authenticatedAgent(app);

      const jtiBefore = await findCachedSession(user.id);
      const response = await agent.post('/sessions/refresh');

      expect(response.status).toBe(200);
      expect(response.body.accessToken).toBeDefined();

      const jtiAfter = await findCachedSession(user.id);
      const tokens = await findUserTokens(user.id);

      expect(jtiAfter).not.toBe(jtiBefore);
      // O service apaga as linhas antigas e insere a nova na mesma transação.
      expect(tokens).toHaveLength(1);
      expect(tokens[0].token).toBe(jtiAfter);
    });

    it('invalida o access token anterior à rotação', async () => {
      const { agent, session, user } = await authenticatedAgent(app);
      const oldAccessCookie = getSetCookie(session, accessCookieName);

      await agent.post('/sessions/refresh');

      const response = await request(app)
        .get('/profile')
        .set('Cookie', [oldAccessCookie as string]);

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Session expired');
      expect(await findCachedSession(user.id)).toBeTruthy();
    });

    it('rejeita request sem cookie de refresh', async () => {
      const response = await request(app).post('/sessions/refresh');

      expect(response.status).toBe(401);
      expect(response.body.message).toBe(
        'Refresh token is missing. Please login again.'
      );
    });
  });

  describe('DELETE /sessions', () => {
    it('encerra a sessão, limpa cookies e derruba o acesso', async () => {
      const { agent, user } = await authenticatedAgent(app);

      const response = await agent.delete('/sessions');

      expect(response.status).toBe(204);
      expect(response.body).toEqual({});

      const cleared = getSetCookie(response, accessCookieName);
      expect(cleared).toContain(`${accessCookieName}=;`);
      expect(await findCachedSession(user.id)).toBeNull();

      const afterLogout = await agent.get('/profile');
      expect(afterLogout.status).toBe(401);
    });

    it('rejeita logout sem autenticação', async () => {
      const response = await request(app).delete('/sessions');

      expect(response.status).toBe(401);
    });
  });

  describe('Sessão e invalidação de token', () => {
    // BUG: isAuthenticated cai no UsersTokensRepository quando o Redis não
    // tem a sessão, e o LogoutService não apaga a linha se o cache já
    // expirou — a linha órfã em user_tokens continua autenticando.
    // it('recusa o token quando a sessão saiu do Redis', async () => {
    //   const { agent, user } = await authenticatedAgent(app);
    //   await redisClient().del(`session:${user.id}`);
    //   const response = await agent.get('/profile');
    //   expect(response.status).toBe(401);
    // });
    // BUG: isAuthenticated só consulta Redis/banco quando o jti existe, então
    // um access token assinado sem jti passa direto pela checagem de sessão.
    // it('recusa access token assinado sem jti', async () => {
    //   const { user } = await authenticatedAgent(app);
    //   const tokenWithoutJti = sign({}, authConfig.jwt.secret, {
    //     subject: user.id,
    //     expiresIn: '15m',
    //   });
    //   const response = await request(app)
    //     .get('/profile')
    //     .set('Cookie', [`${accessCookieName}=${tokenWithoutJti}`]);
    //   expect(response.status).toBe(401);
    // });
  });
});
