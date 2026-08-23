import app from '@shared/infra/http/app';

import { authenticatedAgent, otherUserAgent } from '../helpers/auth';
import { anonymous, missingUuid } from '../helpers/http';
import { createProject, defaultProject, rawProject } from '../helpers/projects';
import { createTag } from '../helpers/tags';

describe('Projects CRUD (integração)', () => {
  describe('POST /projects', () => {
    it('cria o projeto e devolve variablesEnvironment em claro', async () => {
      const { agent, user } = await authenticatedAgent(app);
      const { response, payload } = await createProject(agent);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        title: payload.title,
        description: payload.description,
        variablesEnvironment: payload.variablesEnvironment,
        userId: user.id,
      });
      expect(response.body.id).toBeDefined();
      expect(response.body.createdAt).toBeDefined();
    });

    it('não expõe initializationVector nem repository no corpo', async () => {
      const { agent } = await authenticatedAgent(app);
      const { response } = await createProject(agent);

      expect(response.body.initializationVector).toBeUndefined();
      expect(response.body.repository).toBeUndefined();
    });

    it('persiste variablesEnvironment cifrado, com IV de 16 bytes', async () => {
      const { agent } = await authenticatedAgent(app);
      const { response, payload } = await createProject(agent);

      const row = await rawProject(response.body.id);

      expect(row.variablesEnvironment).not.toBe(payload.variablesEnvironment);
      expect(row.variablesEnvironment).toMatch(/^[0-9a-f]+$/);
      expect(row.initializationVector).toMatch(/^[0-9a-f]{32}$/);
    });

    it('vincula a tag informada em tagId', async () => {
      const { agent } = await authenticatedAgent(app);
      const { response: tag } = await createTag(agent);

      const { response } = await createProject(agent, { tagId: tag.body.id });

      expect(response.status).toBe(200);
      expect(response.body.tagId).toBe(tag.body.id);
    });

    it('recusa tag de outro usuário', async () => {
      const { agent } = await authenticatedAgent(app);
      const { response: tag } = await createTag(agent);

      const { agent: other } = await otherUserAgent(app);
      const { response } = await createProject(other, {
        tagId: tag.body.id,
      });

      expect(response.status).toBe(403);
      expect(response.body.message).toBe('Tag belongs to another user');
    });

    it('recusa tagId inexistente', async () => {
      const { agent } = await authenticatedAgent(app);

      const { response } = await createProject(agent, { tagId: missingUuid });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe(`Tag not found: ${missingUuid}`);
    });

    it('recusa tagId que não é uuid', async () => {
      const { agent } = await authenticatedAgent(app);

      const { response } = await createProject(agent, {
        tagId: 'nao-e-uuid',
      });

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('ValidationError');
    });

    it('recusa título repetido do mesmo usuário', async () => {
      const { agent } = await authenticatedAgent(app);
      await createProject(agent, { title: 'Nimbus' });

      const { response } = await createProject(agent, { title: 'Nimbus' });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Project title already in use');
    });

    it('aceita o mesmo título em usuários diferentes', async () => {
      const { agent } = await authenticatedAgent(app);
      await createProject(agent, { title: 'Nimbus' });

      const { agent: other } = await otherUserAgent(app);
      const { response } = await createProject(other, { title: 'Nimbus' });

      expect(response.status).toBe(200);
      expect(response.body.title).toBe('Nimbus');
    });

    it('rejeita body incompleto (schema do yup)', async () => {
      const { agent } = await authenticatedAgent(app);

      const response = await agent
        .post('/projects')
        .send({ title: 'Sem env', description: 'faltou variablesEnvironment' });

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('ValidationError');
    });

    it('exige autenticação', async () => {
      const response = await anonymous(app)
        .post('/projects')
        .send(defaultProject);

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('JWT token is missing');
    });
  });

  describe('GET /projects/:id', () => {
    it('decifra variablesEnvironment no retorno (round-trip)', async () => {
      const { agent } = await authenticatedAgent(app);
      const { response: created, payload } = await createProject(agent);

      const response = await agent.get(`/projects/${created.body.id}`);

      expect(response.status).toBe(200);
      expect(response.body.variablesEnvironment).toBe(
        payload.variablesEnvironment
      );
    });

    it('nega acesso ao projeto de outro usuário', async () => {
      const { agent } = await authenticatedAgent(app);
      const { response: created } = await createProject(agent);

      const { agent: other } = await otherUserAgent(app);
      const response = await other.get(`/projects/${created.body.id}`);

      expect(response.status).toBe(403);
      expect(response.body.message).toBe('Access denied.');
    });

    it('devolve 404 para uuid inexistente', async () => {
      const { agent } = await authenticatedAgent(app);

      const response = await agent.get(`/projects/${missingUuid}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Project not found.');
    });

    it('rejeita id que não é uuid', async () => {
      const { agent } = await authenticatedAgent(app);

      const response = await agent.get('/projects/nao-e-uuid');

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('ValidationError');
    });
  });

  describe('GET /projects', () => {
    it('pagina e decifra cada item da página', async () => {
      const { agent } = await authenticatedAgent(app);
      const { payload: first } = await createProject(agent);
      await createProject(agent);
      await createProject(agent);

      const response = await agent.get('/projects').query({
        perPage: 2,
        currentPage: 1,
      });

      expect(response.status).toBe(200);
      expect(response.body.perPage).toBe(2);
      expect(response.body.currentPage).toBe(1);
      expect(response.body.data).toHaveLength(2);
      response.body.data.forEach(
        (project: { variablesEnvironment: string }) => {
          expect(project.variablesEnvironment).toBe(first.variablesEnvironment);
        }
      );
    });

    it('traz o restante na segunda página', async () => {
      const { agent } = await authenticatedAgent(app);
      await createProject(agent);
      await createProject(agent);
      await createProject(agent);

      const response = await agent.get('/projects').query({
        perPage: 2,
        currentPage: 2,
      });

      expect(response.body.currentPage).toBe(2);
      expect(response.body.data).toHaveLength(1);
    });

    it('ordena por createdAt desc', async () => {
      const { agent } = await authenticatedAgent(app);
      await createProject(agent, { title: 'Primeiro' });
      await createProject(agent, { title: 'Segundo' });

      const response = await agent.get('/projects').query({
        perPage: 10,
        currentPage: 1,
      });

      const titles = response.body.data.map(
        (project: { title: string }) => project.title
      );
      expect(titles[0]).toBe('Segundo');
      expect(titles[1]).toBe('Primeiro');
    });

    it('isola a listagem por usuário', async () => {
      const { agent } = await authenticatedAgent(app);
      await createProject(agent);

      const { agent: other } = await otherUserAgent(app);
      const response = await other.get('/projects').query({
        perPage: 10,
        currentPage: 1,
      });

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(0);
    });

    it('exige autenticação', async () => {
      const response = await anonymous(app).get('/projects');

      expect(response.status).toBe(401);
    });

    // BUG: ProjectsController.ts:33-35 faz Number(request.query.perPage) sem
    // default, então a listagem sem query params vira NaN em take/skip.
    // O controller de tags já usa `|| 10` / `|| 1`.
    it('usa perPage=10 / currentPage=1 como padrão', async () => {
      const { agent } = await authenticatedAgent(app);
      await createProject(agent);

      const response = await agent.get('/projects');

      expect(response.status).toBe(200);
      expect(response.body.perPage).toBe(10);
      expect(response.body.currentPage).toBe(1);
      expect(response.body.data).toHaveLength(1);
    });

    // BUG: ProjectsRepository.list usa find() e devolve
    // totalRows = data.length (o tamanho da PÁGINA). Deveria usar
    // findAndCount() e informar o total de linhas do usuário.
    it('devolve em totalRows o total do usuário, não o tamanho da página', async () => {
      const { agent } = await authenticatedAgent(app);
      await createProject(agent);
      await createProject(agent);
      await createProject(agent);

      const response = await agent.get('/projects').query({
        perPage: 2,
        currentPage: 1,
      });

      expect(response.body.data).toHaveLength(2);
      expect(response.body.totalRows).toBe(3);
    });
  });

  describe('PUT /projects/:id', () => {
    it('atualiza os campos e re-cifra com um IV novo', async () => {
      const { agent } = await authenticatedAgent(app);
      const { response: created } = await createProject(agent);
      const before = await rawProject(created.body.id);

      const response = await agent.put(`/projects/${created.body.id}`).send({
        title: 'Nimbus atualizado',
        description: 'nova descrição',
        variablesEnvironment: 'DB_HOST=127.0.0.1',
      });

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        title: 'Nimbus atualizado',
        description: 'nova descrição',
        variablesEnvironment: 'DB_HOST=127.0.0.1',
      });

      const after = await rawProject(created.body.id);
      expect(after.initializationVector).not.toBe(before.initializationVector);
      expect(after.variablesEnvironment).not.toBe('DB_HOST=127.0.0.1');

      const show = await agent.get(`/projects/${created.body.id}`);
      expect(show.body.variablesEnvironment).toBe('DB_HOST=127.0.0.1');
    });

    it('vincula uma tag no update', async () => {
      const { agent } = await authenticatedAgent(app);
      const { response: created, payload } = await createProject(agent);
      const { response: tag } = await createTag(agent);

      const response = await agent
        .put(`/projects/${created.body.id}`)
        .send({ ...payload, tagId: tag.body.id });

      expect(response.status).toBe(200);
      expect(response.body.tagId).toBe(tag.body.id);
    });

    it('recusa tag de outro usuário', async () => {
      const { agent } = await authenticatedAgent(app);
      const { response: created, payload } = await createProject(agent);

      const { agent: other } = await otherUserAgent(app);
      const { response: otherTag } = await createTag(other);

      const response = await agent
        .put(`/projects/${created.body.id}`)
        .send({ ...payload, tagId: otherTag.body.id });

      expect(response.status).toBe(403);
      expect(response.body.message).toBe('Tag belongs to another user');
    });

    // BUG: UpdateProjectService.ts:45-48 lança 'Access denied.' sem
    // statusCode, caindo no default 400 do AppError — o ShowProjectService
    // equivalente devolve 403.
    it('nega atualização do projeto de outro usuário com 403', async () => {
      const { agent } = await authenticatedAgent(app);
      const { response: created, payload } = await createProject(agent);

      const { agent: other } = await otherUserAgent(app);
      const response = await other
        .put(`/projects/${created.body.id}`)
        .send(payload);

      expect(response.status).toBe(403);
      expect(response.body.message).toBe('Access denied.');
    });

    // BUG: UpdateProjectService.ts:40-43 lança 'Project not found.' sem
    // statusCode, caindo no default 400 do AppError — deveria ser 404, como
    // no ShowProjectService.
    it('devolve 404 para uuid inexistente', async () => {
      const { agent } = await authenticatedAgent(app);

      const response = await agent
        .put(`/projects/${missingUuid}`)
        .send(defaultProject);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Project not found.');
    });

    // BUG (decisão de produto): UpdateProjectService.ts:50-67 mantém a tag
    // atual quando tagId não vem no body — não existe forma de desvincular.
    // it('desvincula a tag quando tagId não é enviado', async () => {
    //   const { agent } = await authenticatedAgent(app);
    //   const { response: tag } = await createTag(agent);
    //   const { response: created, payload } = await createProject(agent, {
    //     tagId: tag.body.id,
    //   });

    //   const response = await agent.put(`/projects/${created.body.id}`).send({
    //     title: payload.title,
    //     description: payload.description,
    //     variablesEnvironment: payload.variablesEnvironment,
    //   });

    //   expect(response.body.tagId).toBeNull();
    // });
  });

  describe('DELETE /projects/:id', () => {
    it('remove o projeto e responde 204', async () => {
      const { agent } = await authenticatedAgent(app);
      const { response: created } = await createProject(agent);

      const response = await agent.delete(`/projects/${created.body.id}`);

      expect(response.status).toBe(204);
      expect(response.body).toEqual({});

      const show = await agent.get(`/projects/${created.body.id}`);
      expect(show.status).toBe(404);
    });

    it('devolve 404 para uuid inexistente', async () => {
      const { agent } = await authenticatedAgent(app);

      const response = await agent.delete(`/projects/${missingUuid}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Project not found.');
    });

    // BUG: DeleteProjectService.ts:12-20 só valida existência e
    // ProjectsController.ts:55-57 nem passa o userId — qualquer usuário
    // autenticado apaga projeto alheio. Deveria responder 403.
    it('não deixa um usuário apagar projeto de outro', async () => {
      const { agent } = await authenticatedAgent(app);
      const { response: created } = await createProject(agent);

      const { agent: other } = await otherUserAgent(app);
      const response = await other.delete(`/projects/${created.body.id}`);

      expect(response.status).toBe(403);
      expect(response.body.message).toBe('Access denied.');
    });
  });

  describe('Relação project x tag', () => {
    it('apaga em cascata os projetos da tag removida (FK tagsToTasks)', async () => {
      const { agent } = await authenticatedAgent(app);
      const { response: tag } = await createTag(agent);
      const { response: created } = await createProject(agent, {
        tagId: tag.body.id,
      });

      await agent.delete(`/tags/${tag.body.id}`);

      const show = await agent.get(`/projects/${created.body.id}`);
      expect(show.status).toBe(404);
    });
  });
});
