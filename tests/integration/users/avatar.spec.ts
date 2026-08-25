import app from '@shared/infra/http/app';

import { authenticatedAgent } from '@tests/support/helpers/auth';
import { anonymous } from '@tests/support/helpers/http';
import {
  fileNameFromUrl,
  pngFixture,
  removeUpload,
  uploadExists,
} from '@tests/support/helpers/files';

describe('PATCH /users/avatar (integração)', () => {
  /** Arquivos gravados em <root>/uploads durante o teste, limpos no afterEach. */
  const created: string[] = [];

  afterEach(async () => {
    await Promise.all(created.map(removeUpload));
    created.length = 0;
  });

  it('grava o arquivo e devolve a avatarUrl do StorageProvider local', async () => {
    const { agent } = await authenticatedAgent(app);

    const response = await agent
      .patch('/users/avatar')
      .attach('avatar', pngFixture(), 'avatar.png');

    expect(response.status).toBe(200);
    expect(response.body.avatarUrl).toMatch(
      new RegExp(`^${process.env.APP_API_URL}/files/[0-9a-f]{20}-avatar\\.png$`)
    );

    const fileName = fileNameFromUrl(response.body.avatarUrl);
    created.push(fileName);
    expect(uploadExists(fileName)).toBe(true);
  });

  it('serve o arquivo em GET /files/:filename', async () => {
    const { agent } = await authenticatedAgent(app);
    const upload = await agent
      .patch('/users/avatar')
      .attach('avatar', pngFixture(), 'avatar.png');

    const fileName = fileNameFromUrl(upload.body.avatarUrl);
    created.push(fileName);

    const response = await agent.get(`/files/${fileName}`);

    expect(response.status).toBe(200);
  });

  it('apaga o avatar anterior ao subir um novo', async () => {
    const { agent } = await authenticatedAgent(app);

    const first = await agent
      .patch('/users/avatar')
      .attach('avatar', pngFixture(), 'avatar.png');
    const firstFile = fileNameFromUrl(first.body.avatarUrl);

    const second = await agent
      .patch('/users/avatar')
      .attach('avatar', pngFixture(), 'novo.png');
    const secondFile = fileNameFromUrl(second.body.avatarUrl);
    created.push(firstFile, secondFile);

    expect(secondFile).not.toBe(firstFile);
    expect(uploadExists(firstFile)).toBe(false);
    expect(uploadExists(secondFile)).toBe(true);
  });

  it('reflete o avatar em GET /profile', async () => {
    const { agent } = await authenticatedAgent(app);
    const upload = await agent
      .patch('/users/avatar')
      .attach('avatar', pngFixture(), 'avatar.png');
    created.push(fileNameFromUrl(upload.body.avatarUrl));

    const profile = await agent.get('/profile');

    expect(profile.body.avatarUrl).toBe(upload.body.avatarUrl);
  });

  it('exige autenticação', async () => {
    const response = await anonymous(app)
      .patch('/users/avatar')
      .attach('avatar', pngFixture(), 'avatar.png');

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('JWT token is missing');
  });
});
