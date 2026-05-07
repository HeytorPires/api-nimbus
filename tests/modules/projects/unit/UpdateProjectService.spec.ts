import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import UpdateProjectService from '@modules/projects/services/UpdateProjectService';
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
let updateProjectService: UpdateProjectService;

describe('Update Project', () => {
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
    updateProjectService = new UpdateProjectService(
      fakeProjectsRepository,
      fakeCryptographyProvider,
      fakeUsersRepository,
      fakeTagsRepository
    );
  });

  it('deve ser capaz de atualizar um projeto existente', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    });
    const initialTag = await fakeTagsRepository.create({
      name: 'Backend',
      userId: user.id,
    });
    const updatedTag = await fakeTagsRepository.create({
      name: 'Infra',
      userId: user.id,
    });
    const project = await createProjectService.execute({
      title: 'Nimbus API',
      description: 'Core backend service',
      variablesEnvironment: 'API_KEY=123',
      userId: user.id,
      tagId: initialTag.id,
    });

    const updatedProject = await updateProjectService.execute({
      id: project.id,
      title: 'Nimbus Web',
      description: 'Updated frontend application',
      variablesEnvironment: 'NEXT_PUBLIC_API_URL=https://example.com',
      userId: user.id,
      tagId: updatedTag.id,
    });

    expect(updatedProject).toMatchObject({
      id: project.id,
      title: 'Nimbus Web',
      description: 'Updated frontend application',
      variablesEnvironment: 'NEXT_PUBLIC_API_URL=https://example.com',
      userId: user.id,
      tagId: updatedTag.id,
    });

    const storedProject = await fakeProjectsRepository.findById(project.id);

    expect(storedProject?.variablesEnvironment).toBe(
      'encrypted:NEXT_PUBLIC_API_URL=https://example.com'
    );
    expect(storedProject?.tag?.id).toBe(updatedTag.id);
  });

  it('não deve ser capaz de atualizar um projeto que não existe', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    });

    await expect(
      updateProjectService.execute({
        id: 'invalid-project-id',
        title: 'Nimbus API',
        description: 'Core backend service',
        variablesEnvironment: 'API_KEY=123',
        userId: user.id,
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('não deve ser capaz de atualizar um projeto de outro usuário', async () => {
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
      updateProjectService.execute({
        id: project.id,
        title: 'Nimbus Web',
        description: 'Updated frontend application',
        variablesEnvironment: 'NEXT_PUBLIC_API_URL=https://example.com',
        userId: anotherUser.id,
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('não deve ser capaz de atualizar um projeto com tag inválida', async () => {
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

    await expect(
      updateProjectService.execute({
        id: project.id,
        title: 'Nimbus Web',
        description: 'Updated frontend application',
        variablesEnvironment: 'NEXT_PUBLIC_API_URL=https://example.com',
        userId: user.id,
        tagId: 'invalid-tag-id',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('não deve ser capaz de atualizar um projeto com uma tag de outro usuário', async () => {
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
    const foreignTag = await fakeTagsRepository.create({
      name: 'Private',
      userId: anotherUser.id,
    });
    const project = await createProjectService.execute({
      title: 'Nimbus API',
      description: 'Core backend service',
      variablesEnvironment: 'API_KEY=123',
      userId: user.id,
    });

    await expect(
      updateProjectService.execute({
        id: project.id,
        title: 'Nimbus Web',
        description: 'Updated frontend application',
        variablesEnvironment: 'NEXT_PUBLIC_API_URL=https://example.com',
        userId: user.id,
        tagId: foreignTag.id,
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
