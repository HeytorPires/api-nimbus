import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import CreateProjectService from '@modules/projects/services/CreateProjectService';
import FakeProjectsRepository from '../repositories/FakeProjectsRepository';
import FakeUsersRepository from '../../user/repositories/FakeUsersRepository';
import FakeTagsRepository from '../../tags/repositories/FakeTagsRepository';
import FakeCryptoProvider from '../../../providers/fakes/FakeCryptoProvider';
// import FakeHashProvider from '@shared/providers/cryptography/fakes/FakeHashProvider';
// import CreateUserService from '@modules/users/services/CreateUserService';
// import CreateTagService from '@modules/tags/services/CreateTagService';

let fakeProjectsRepository: FakeProjectsRepository;
let fakeUsersRepository: FakeUsersRepository;
let fakeTagsRepository: FakeTagsRepository;
let fakeCryptoProvider: FakeCryptoProvider;
// let hashProvider: FakeHashProvider;
let createProject: CreateProjectService;
// let createUser: CreateUserService;
// let createTag: CreateTagService;

describe('CreateProject', () => {
  beforeEach(() => {
    fakeProjectsRepository = new FakeProjectsRepository();
    fakeUsersRepository = new FakeUsersRepository();
    fakeTagsRepository = new FakeTagsRepository();
    fakeCryptoProvider = new FakeCryptoProvider();
    // hashProvider = new FakeHashProvider();
    createProject = new CreateProjectService(
      fakeProjectsRepository,
      fakeCryptoProvider,
      fakeUsersRepository,
      fakeTagsRepository
    );
    // createUser = new CreateUserService(fakeUsersRepository, hashProvider);
    // createTag = new CreateTagService(fakeTagsRepository, fakeUsersRepository);
  });

  it('should be able to create a new project', async () => {
    const user = await fakeUsersRepository.create({
      name: 'João Silva',
      email: 'joao@gmail.com',
      password: '123456',
    });

    const project = await createProject.execute({
      title: 'My Project',
      description: 'A test project',
      variablesEnvironment: 'KEY=value',
      userId: user.id,
    });

    expect(project).toHaveProperty('id');
    expect(project.title).toBe('My Project');
    expect(project.variablesEnvironment).toBe('KEY=value');
  });

  it('should be able to create a project with a tag', async () => {
    const user = await fakeUsersRepository.create({
      name: 'João Silva',
      email: 'joao@gmail.com',
      password: '123456',
    });

    const tag = await fakeTagsRepository.create({
      name: 'Important',
      userId: user.id,
    });

    const project = await createProject.execute({
      title: 'My Project',
      description: 'A test project',
      variablesEnvironment: 'KEY=value',
      userId: user.id,
      tagId: tag.id,
    });

    expect(project).toHaveProperty('id');
    expect(project.tagId).toBe(tag.id);
  });

  it('should not be able to create a project with non-existing user', async () => {
    await expect(
      createProject.execute({
        title: 'My Project',
        description: 'A test project',
        variablesEnvironment: 'KEY=value',
        userId: 'non-existing-id',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a project with duplicate title for same user', async () => {
    const user = await fakeUsersRepository.create({
      name: 'João Silva',
      email: 'joao@gmail.com',
      password: '123456',
    });

    await createProject.execute({
      title: 'My Project',
      description: 'First project',
      variablesEnvironment: 'KEY=value1',
      userId: user.id,
    });

    await expect(
      createProject.execute({
        title: 'My Project',
        description: 'Second project',
        variablesEnvironment: 'KEY=value2',
        userId: user.id,
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a project with non-existing tag', async () => {
    const user = await fakeUsersRepository.create({
      name: 'João Silva',
      email: 'joao@gmail.com',
      password: '123456',
    });

    await expect(
      createProject.execute({
        title: 'My Project',
        description: 'A test project',
        variablesEnvironment: 'KEY=value',
        userId: user.id,
        tagId: 'non-existing-tag-id',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a project with tag from another user', async () => {
    const user1 = await fakeUsersRepository.create({
      name: 'User 1',
      email: 'user1@gmail.com',
      password: '123456',
    });

    const user2 = await fakeUsersRepository.create({
      name: 'User 2',
      email: 'user2@gmail.com',
      password: '123456',
    });

    const tag = await fakeTagsRepository.create({
      name: 'Tag from User 2',
      userId: user2.id,
    });

    await expect(
      createProject.execute({
        title: 'My Project',
        description: 'A test project',
        variablesEnvironment: 'KEY=value',
        userId: user1.id,
        tagId: tag.id,
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
