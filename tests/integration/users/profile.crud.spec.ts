import request from 'supertest';

import app from '@shared/infra/http/app';

import {
  authenticatedAgent,
  createUser,
  defaultCredentials,
  login,
} from '@tests/support/helpers/auth';
import { anonymous } from '@tests/support/helpers/http';

describe('Users e Profile CRUD (integração)', () => {
  describe('GET /users/me', () => {
    it('devolve o usuário autenticado sem a senha', async () => {
      const { agent, payload } = await authenticatedAgent(app);

      const response = await agent.get('/users/me');

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        name: payload.name,
        email: payload.email,
      });
      expect(response.body.password).toBeUndefined();
      expect(response.body.avatarUrl).toBeNull();
    });

    it('exige autenticação', async () => {
      const response = await anonymous(app).get('/users/me');

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('JWT token is missing');
    });
  });

  describe('GET /profile', () => {
    it('devolve o mesmo payload de /users/me', async () => {
      const { agent } = await authenticatedAgent(app);

      const me = await agent.get('/users/me');
      const profile = await agent.get('/profile');

      expect(profile.status).toBe(200);
      expect(profile.body).toEqual(me.body);
    });

    it('exige autenticação', async () => {
      const response = await anonymous(app).get('/profile');

      expect(response.status).toBe(401);
    });
  });

  describe('PUT /profile', () => {
    it('atualiza nome e e-mail', async () => {
      const { agent } = await authenticatedAgent(app);

      const response = await agent.put('/profile').send({
        name: 'Nome Novo',
        email: 'novo@nimbus.dev',
      });

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        name: 'Nome Novo',
        email: 'novo@nimbus.dev',
      });

      const profile = await agent.get('/profile');
      expect(profile.body.email).toBe('novo@nimbus.dev');
    });

    it('recusa e-mail já usado por outro usuário', async () => {
      await createUser(app, { email: 'ocupado@nimbus.dev' });
      const { agent, payload } = await authenticatedAgent(app, {
        email: 'dono@nimbus.dev',
      });

      const response = await agent.put('/profile').send({
        name: payload.name,
        email: 'ocupado@nimbus.dev',
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe(
        'there is already one user with this email'
      );
    });

    it('exige oldPassword para trocar a senha', async () => {
      const { agent, payload } = await authenticatedAgent(app);

      const response = await agent.put('/profile').send({
        name: payload.name,
        email: payload.email,
        password: 'nova-senha',
        passwordConfirmation: 'nova-senha',
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Old password is required');
    });

    it('recusa oldPassword incorreta', async () => {
      const { agent, payload } = await authenticatedAgent(app);

      const response = await agent.put('/profile').send({
        name: payload.name,
        email: payload.email,
        oldPassword: 'errada',
        password: 'nova-senha',
        passwordConfirmation: 'nova-senha',
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Old password does not match.');
    });

    it('troca a senha: passa a autenticar com a nova e recusa a antiga', async () => {
      const { agent, payload } = await authenticatedAgent(app);

      const response = await agent.put('/profile').send({
        name: payload.name,
        email: payload.email,
        oldPassword: payload.password,
        password: 'senha-nova-123',
        passwordConfirmation: 'senha-nova-123',
      });

      expect(response.status).toBe(200);

      const withNew = await login(request.agent(app), {
        email: payload.email,
        password: 'senha-nova-123',
      });
      expect(withNew.status).toBe(200);

      const withOld = await login(request.agent(app), {
        email: payload.email,
        password: payload.password,
      });
      expect(withOld.status).toBe(401);
      expect(withOld.body.message).toBe(
        'Incorrect email/password combination.'
      );
    });

    it('exige passwordConfirmation quando password é enviado', async () => {
      const { agent, payload } = await authenticatedAgent(app);

      const response = await agent.put('/profile').send({
        name: payload.name,
        email: payload.email,
        oldPassword: payload.password,
        password: 'senha-nova-123',
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Confirmação obrigatória');
    });

    it('recusa confirmação divergente', async () => {
      const { agent, payload } = await authenticatedAgent(app);

      const response = await agent.put('/profile').send({
        name: payload.name,
        email: payload.email,
        oldPassword: payload.password,
        password: 'senha-nova-123',
        passwordConfirmation: 'outra-coisa',
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('As senhas devem coincidir');
    });

    it('recusa e-mail malformado', async () => {
      const { agent } = await authenticatedAgent(app);

      const response = await agent.put('/profile').send({
        name: 'Nome',
        email: 'nao-e-email',
      });

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('ValidationError');
    });

    it('exige autenticação', async () => {
      const response = await anonymous(app).put('/profile').send({
        name: defaultCredentials.name,
        email: defaultCredentials.email,
      });

      expect(response.status).toBe(401);
    });
  });
});
