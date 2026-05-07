import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import ShowProjectService from '@modules/projects/services/ShowProjectService';
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
let showProjectService: ShowProjectService;

describe('Show Project', () => {
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
    showProjectService = new ShowProjectService(
      fakeProjectsRepository,
      fakeCryptographyProvider
    );
  });

  it('deve ser capaz de exibir um projeto existente', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    });
    const project = await createProjectService.execute({
      title: 'Nimbus API',
      description: 'Core backend service',
      variablesEnvironment: 'API_KEY=123',
      userId: user.id,
    });

    const response = await showProjectService.execute(project.id, user.id);

    expect(response).toMatchObject({
      id: project.id,
      title: 'Nimbus API',
      description: 'Core backend service',
      variablesEnvironment: 'API_KEY=123',
      userId: user.id,
    });
  });

  it('não deve ser capaz de exibir um projeto que não existe', async () => {
    await expect(
      showProjectService.execute('invalid-project-id', 'user-id')
    ).rejects.toBeInstanceOf(AppError);
  });

  it('não deve ser capaz de exibir um projeto de outro usuário', async () => {
    const owner = await fakeUsersRepository.create({
      name: 'Owner',
      email: 'owner@example.com',
      password: '123456',
    });
    const anotherUser = await fakeUsersRepository.create({
      name: 'Another',
      email: 'another@example.com',
      password: '123456',
    });
    const project = await createProjectService.execute({
      title: 'Private Project',
      description: 'Owner only',
      variablesEnvironment: 'SECRET=123',
      userId: owner.id,
    });

    await expect(
      showProjectService.execute(project.id, anotherUser.id)
    ).rejects.toBeInstanceOf(AppError);
  });
});
