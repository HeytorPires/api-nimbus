import app from '@shared/infra/http/app';

import { authenticatedAgent } from '@tests/support/helpers/auth';
import { anonymous, missingUuid } from '@tests/support/helpers/http';
import { createTag, defaultTag } from '@tests/support/helpers/tags';
import { otherUserAgent } from '@tests/support/helpers/auth';

describe('Tags CRUD (integração)', () => {
  describe('POST /tags', () => {
    it('cria a tag do usuário autenticado', async () => {
      const { agent } = await authenticatedAgent(app);
      const { response } = await createTag(agent);

      expect(response.status).toBe(200);
      expect(response.body.id).toBeDefined();
      expect(response.body.name).toBe(defaultTag.name);
      expect(response.body.createdAt).toBeDefined();
    });

    it('rejeita body sem name (schema do yup)', async () => {
      const { agent } = await authenticatedAgent(app);

      const response = await agent.post('/tags').send({});

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('ValidationError');
    });

    it('rejeita nome repetido do mesmo usuário', async () => {
      const { agent } = await authenticatedAgent(app);
      await createTag(agent);

      const { response } = await createTag(agent);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Tag name already in use');
    });

    it('aceita o mesmo nome em usuários diferentes (unicidade por usuário)', async () => {
      const { agent } = await authenticatedAgent(app);
      await createTag(agent);

      const { agent: other } = await otherUserAgent(app);
      const { response } = await createTag(other);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(defaultTag.name);
    });

    it('exige autenticação', async () => {
      const response = await anonymous(app).post('/tags').send(defaultTag);

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('JWT token is missing');
    });

    it('devolve o userId do dono no retorno', async () => {
      const { agent, user } = await authenticatedAgent(app);

      const { response } = await createTag(agent);

      expect(response.body.userId).toBe(user.id);
    });
  });

  describe('GET /tags/:id', () => {
    it('devolve a tag do próprio usuário', async () => {
      const { agent } = await authenticatedAgent(app);
      const { response: created } = await createTag(agent);

      const response = await agent.get(`/tags/${created.body.id}`);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        id: created.body.id,
        name: defaultTag.name,
      });
    });

    it('nega acesso à tag de outro usuário', async () => {
      const { agent } = await authenticatedAgent(app);
      const { response: created } = await createTag(agent);

      const { agent: other } = await otherUserAgent(app);
      const response = await other.get(`/tags/${created.body.id}`);

      expect(response.status).toBe(403);
      expect(response.body.message).toBe('Access denied.');
    });

    it('devolve 404 para uuid inexistente', async () => {
      const { agent } = await authenticatedAgent(app);

      const response = await agent.get(`/tags/${missingUuid}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Tag not found.');
    });

    it('rejeita id que não é uuid', async () => {
      const { agent } = await authenticatedAgent(app);

      const response = await agent.get('/tags/nao-e-uuid');

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('ValidationError');
    });
  });

  describe('GET /tags', () => {
    it('usa perPage=10 / currentPage=1 como padrão', async () => {
      const { agent } = await authenticatedAgent(app);
      await createTag(agent, { name: 'infra' });
      await createTag(agent, { name: 'backend' });

      const response = await agent.get('/tags');

      expect(response.status).toBe(200);
      expect(response.body.perPage).toBe(10);
      expect(response.body.currentPage).toBe(1);
      expect(response.body.data).toHaveLength(2);
    });

    it('pagina pelos query params', async () => {
      const { agent } = await authenticatedAgent(app);
      await createTag(agent, { name: 'infra' });
      await createTag(agent, { name: 'backend' });

      const first = await agent.get('/tags').query({
        perPage: 1,
        currentPage: 1,
      });
      const second = await agent.get('/tags').query({
        perPage: 1,
        currentPage: 2,
      });

      expect(first.body.data).toHaveLength(1);
      expect(second.body.data).toHaveLength(1);
      expect(second.body.currentPage).toBe(2);
      expect(second.body.data[0].id).not.toBe(first.body.data[0].id);
    });

    it('lista somente as tags do usuário autenticado', async () => {
      const { agent } = await authenticatedAgent(app);
      await createTag(agent, { name: 'infra' });

      const { agent: other } = await otherUserAgent(app);
      const response = await other.get('/tags');

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(0);
    });
  });

  describe('PUT /tags/:id', () => {
    it('renomeia a tag do próprio usuário', async () => {
      const { agent } = await authenticatedAgent(app);
      const { response: created } = await createTag(agent);

      const response = await agent
        .put(`/tags/${created.body.id}`)
        .send({ name: 'observabilidade' });

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('observabilidade');

      const show = await agent.get(`/tags/${created.body.id}`);
      expect(show.body.name).toBe('observabilidade');
    });

    it('nega atualização de tag de outro usuário', async () => {
      const { agent } = await authenticatedAgent(app);
      const { response: created } = await createTag(agent);

      const { agent: other } = await otherUserAgent(app);
      const response = await other
        .put(`/tags/${created.body.id}`)
        .send({ name: 'roubada' });

      expect(response.status).toBe(403);
      expect(response.body.message).toBe('Access denied.');
    });

    it('devolve 404 para uuid inexistente', async () => {
      const { agent } = await authenticatedAgent(app);

      const response = await agent
        .put(`/tags/${missingUuid}`)
        .send({ name: 'fantasma' });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Tag not found.');
    });

    // BUG: UpdateTagService.ts:23-48 não revalida duplicidade de nome — dá
    // para renomear uma tag para o nome de outra tag do mesmo usuário, o que
    // o CreateTagService bloqueia.
    it('recusa renomear para um nome já usado pelo mesmo usuário', async () => {
      const { agent } = await authenticatedAgent(app);
      await createTag(agent, { name: 'infra' });
      const { response: other } = await createTag(agent, { name: 'backend' });

      const response = await agent
        .put(`/tags/${other.body.id}`)
        .send({ name: 'infra' });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Tag name already in use.');
    });
  });

  describe('DELETE /tags/:id', () => {
    it('remove a tag e responde 204 sem corpo', async () => {
      const { agent } = await authenticatedAgent(app);
      const { response: created } = await createTag(agent);

      const response = await agent.delete(`/tags/${created.body.id}`);

      expect(response.status).toBe(204);
      expect(response.body).toEqual({});

      const show = await agent.get(`/tags/${created.body.id}`);
      expect(show.status).toBe(404);
    });

    it('devolve 404 para uuid inexistente', async () => {
      const { agent } = await authenticatedAgent(app);

      const response = await agent.delete(`/tags/${missingUuid}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Tag not found.');
    });

    // BUG: DeleteTagService.ts:12-20 só valida existência e
    // TagsController.ts:46-48 nem passa o userId — qualquer usuário
    // autenticado apaga tag alheia. Deveria responder 403.
    it('não deixa um usuário apagar tag de outro', async () => {
      const { agent } = await authenticatedAgent(app);
      const { response: created } = await createTag(agent);

      const { agent: other } = await otherUserAgent(app);
      const response = await other.delete(`/tags/${created.body.id}`);

      expect(response.status).toBe(403);
      expect(response.body.message).toBe('Access denied.');
    });
  });
});
