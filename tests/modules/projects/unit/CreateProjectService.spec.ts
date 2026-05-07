import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
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

describe('Create Project', () => {
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
  });

  it('deve ser capaz de criar um novo projeto', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    });
    const tag = await fakeTagsRepository.create({
      name: 'Backend',
      userId: user.id,
    });

    const project = await createProjectService.execute({
      title: 'Nimbus API',
      description: 'Core backend service',
      variablesEnvironment: 'API_KEY=123',
      userId: user.id,
      tagId: tag.id,
    });

    expect(project).toMatchObject({
      title: 'Nimbus API',
      description: 'Core backend service',
      variablesEnvironment: 'API_KEY=123',
      userId: user.id,
      tagId: tag.id,
    });

    const storedProject = await fakeProjectsRepository.findById(project.id);

    expect(storedProject?.variablesEnvironment).toBe('encrypted:API_KEY=123');
    expect(storedProject?.InitializationVector).toBe('fake-iv');
  });

  it('não deve ser capaz de criar um projeto com usuário inválido', async () => {
    await expect(
      createProjectService.execute({
        title: 'Nimbus API',
        description: 'Core backend service',
        variablesEnvironment: 'API_KEY=123',
        userId: 'invalid-user-id',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('não deve ser capaz de criar dois projetos com o mesmo título para o mesmo usuário', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    });

    await createProjectService.execute({
      title: 'Nimbus API',
      description: 'Core backend service',
      variablesEnvironment: 'API_KEY=123',
      userId: user.id,
    });

    await expect(
      createProjectService.execute({
        title: 'Nimbus API',
        description: 'Another description',
        variablesEnvironment: 'API_KEY=456',
        userId: user.id,
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('não deve ser capaz de criar um projeto com tag inválida', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    });

    await expect(
      createProjectService.execute({
        title: 'Nimbus API',
        description: 'Core backend service',
        variablesEnvironment: 'API_KEY=123',
        userId: user.id,
        tagId: 'invalid-tag-id',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('não deve ser capaz de criar um projeto com uma tag de outro usuário', async () => {
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
    const tag = await fakeTagsRepository.create({
      name: 'Private',
      userId: anotherUser.id,
    });

    await expect(
      createProjectService.execute({
        title: 'Nimbus API',
        description: 'Core backend service',
        variablesEnvironment: 'API_KEY=123',
        userId: user.id,
        tagId: tag.id,
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
