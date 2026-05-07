import 'reflect-metadata';
import ListProjectService from '@modules/projects/services/ListProjectService';
import CreateProjectService from '@modules/projects/services/CreateProjectService';
import FakeCryptographyProvider from '@shared/providers/cryptography/fakes/FakeCryptographyProvider';
import FakeProjectsRepository from '../repositories/FakeProjectsRepository';
import FakeUsersRepository from '../../user/repositories/FakeUsersRepository';
import FakeTagsRepository from '../../tags/repositories/FakeTagsRepository';

let fakeProjectsRepository: FakeProjectsRepository;
let fakeCryptographyProvider: FakeCryptographyProvider;
let fakeUsersRepository: FakeUsersRepository;
let fakeTagsRepository: FakeTagsRepository;
let createProjectService: CreateProjectService;
let listProjectService: ListProjectService;

describe('List Projects', () => {
  beforeEach(() => {
    fakeProjectsRepository = new FakeProjectsRepository();
    fakeCryptographyProvider = new FakeCryptographyProvider();
    fakeUsersRepository = new FakeUsersRepository();
    fakeTagsRepository = new FakeTagsRepository();
    createProjectService = new CreateProjectService(
      fakeProjectsRepository,
      fakeCryptographyProvider,
      fakeUsersRepository,
      fakeTagsRepository
    );
    listProjectService = new ListProjectService(
      fakeProjectsRepository,
      fakeCryptographyProvider
    );
  });

  it('deve ser capaz de listar apenas os projetos do usuário autenticado', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    });
    const anotherUser = await fakeUsersRepository.create({
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: '123456',
    });

    await createProjectService.execute({
      title: 'Nimbus API',
      description: 'Core backend service',
      variablesEnvironment: 'API_KEY=123',
      userId: user.id,
    });
    await createProjectService.execute({
      title: 'Nimbus Web',
      description: 'Frontend application',
      variablesEnvironment: 'NEXT_PUBLIC_API_URL=https://example.com',
      userId: user.id,
    });
    await createProjectService.execute({
      title: 'Other Project',
      description: 'Private service',
      variablesEnvironment: 'SECRET=456',
      userId: anotherUser.id,
    });

    const response = await listProjectService.execute(10, 1, user.id);

    expect(response).toMatchObject({
      perPage: 10,
      currentPage: 1,
      totalRows: 2,
    });
    expect(response.data).toHaveLength(2);
    expect(response.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: 'Nimbus API',
          variablesEnvironment: 'API_KEY=123',
          userId: user.id,
        }),
        expect.objectContaining({
          title: 'Nimbus Web',
          variablesEnvironment: 'NEXT_PUBLIC_API_URL=https://example.com',
          userId: user.id,
        }),
      ])
    );
    expect(response.data.map((project) => project.title)).not.toContain(
      'Other Project'
    );
  });
});
