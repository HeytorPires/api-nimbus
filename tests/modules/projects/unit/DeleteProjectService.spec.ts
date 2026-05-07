import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import DeleteProjectService from '@modules/projects/services/DeleteProjectService';
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
let deleteProjectService: DeleteProjectService;

describe('Delete Project', () => {
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
    deleteProjectService = new DeleteProjectService(fakeProjectsRepository);
  });

  it('deve ser capaz de excluir um projeto existente', async () => {
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

    await deleteProjectService.execute(project.id);

    const deletedProject = await fakeProjectsRepository.findById(project.id);

    expect(deletedProject).toBeUndefined();
  });

  it('não deve ser capaz de excluir um projeto que não existe', async () => {
    await expect(
      deleteProjectService.execute('invalid-project-id')
    ).rejects.toBeInstanceOf(AppError);
  });
});
