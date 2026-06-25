import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import UpdateProjectService from '@modules/projects/services/UpdateProjectService';
import FakeProjectsRepository from '../repositories/FakeProjectsRepository';
import FakeUsersRepository from '../../user/repositories/FakeUsersRepository';
import FakeTagsRepository from '../../tags/repositories/FakeTagsRepository';
import FakeCryptoProvider from '../../../providers/fakes/FakeCryptoProvider';
import FakeLogProvider from '../../../providers/fakes/FakeLogProvider';

let fakeProjectsRepository: FakeProjectsRepository;
let fakeUsersRepository: FakeUsersRepository;
let fakeTagsRepository: FakeTagsRepository;
let fakeCryptoProvider: FakeCryptoProvider;
let fakeLogProvider: FakeLogProvider;
let updateProject: UpdateProjectService;

describe('UpdateProject', () => {
  beforeEach(() => {
    fakeProjectsRepository = new FakeProjectsRepository();
    fakeUsersRepository = new FakeUsersRepository();
    fakeTagsRepository = new FakeTagsRepository();
    fakeCryptoProvider = new FakeCryptoProvider();
    fakeLogProvider = new FakeLogProvider();
    updateProject = new UpdateProjectService(
      fakeProjectsRepository,
      fakeCryptoProvider,
      fakeUsersRepository,
      fakeTagsRepository,
      fakeLogProvider
    );
  });

  it('should be able to update a project', async () => {
    const user = await fakeUsersRepository.create({
      name: 'João Silva',
      email: 'joao@gmail.com',
      password: '123456',
    });

    const project = await fakeProjectsRepository.create({
      title: 'Old Title',
      description: 'Old Description',
      variablesEnvironment: 'encrypted-OLD=value',
      InitializationVector: 'fake-iv',
      user_id: user.id,
    });

    const updatedProject = await updateProject.execute({
      id: project.id,
      title: 'New Title',
      description: 'New Description',
      variablesEnvironment: 'NEW=value',
      user_id: user.id,
    });

    expect(updatedProject.title).toBe('New Title');
    expect(updatedProject.description).toBe('New Description');
    expect(updatedProject.variablesEnvironment).toBe('NEW=value');
  });

  it('should not be able to update a non-existing project', async () => {
    const user = await fakeUsersRepository.create({
      name: 'João Silva',
      email: 'joao@gmail.com',
      password: '123456',
    });

    await expect(
      updateProject.execute({
        id: 'non-existing-id',
        title: 'Title',
        description: 'Desc',
        variablesEnvironment: 'KEY=value',
        user_id: user.id,
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not allow updating project from another user', async () => {
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

    const project = await fakeProjectsRepository.create({
      title: 'Project',
      description: 'Description',
      variablesEnvironment: 'encrypted-KEY=value',
      InitializationVector: 'fake-iv',
      user_id: user1.id,
    });

    await expect(
      updateProject.execute({
        id: project.id,
        title: 'Updated Title',
        description: 'Updated Desc',
        variablesEnvironment: 'KEY=newvalue',
        user_id: user2.id,
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update a project with a tag', async () => {
    const user = await fakeUsersRepository.create({
      name: 'João Silva',
      email: 'joao@gmail.com',
      password: '123456',
    });

    const tag = await fakeTagsRepository.create({
      name: 'Important',
      user_id: user.id,
    });

    const project = await fakeProjectsRepository.create({
      title: 'Project',
      description: 'Description',
      variablesEnvironment: 'encrypted-KEY=value',
      InitializationVector: 'fake-iv',
      user_id: user.id,
    });

    const updatedProject = await updateProject.execute({
      id: project.id,
      title: 'Updated Title',
      description: 'Updated Desc',
      variablesEnvironment: 'KEY=newvalue',
      user_id: user.id,
      tag_id: tag.id,
    });

    expect(updatedProject.tag_id).toBe(tag.id);
  });

  it('should not be able to update with non-existing tag', async () => {
    const user = await fakeUsersRepository.create({
      name: 'João Silva',
      email: 'joao@gmail.com',
      password: '123456',
    });

    const project = await fakeProjectsRepository.create({
      title: 'Project',
      description: 'Description',
      variablesEnvironment: 'encrypted-KEY=value',
      InitializationVector: 'fake-iv',
      user_id: user.id,
    });

    await expect(
      updateProject.execute({
        id: project.id,
        title: 'Updated',
        description: 'Updated',
        variablesEnvironment: 'KEY=value',
        user_id: user.id,
        tag_id: 'non-existing-tag',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update with tag from another user', async () => {
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
      user_id: user2.id,
    });

    const project = await fakeProjectsRepository.create({
      title: 'Project',
      description: 'Description',
      variablesEnvironment: 'encrypted-KEY=value',
      InitializationVector: 'fake-iv',
      user_id: user1.id,
    });

    await expect(
      updateProject.execute({
        id: project.id,
        title: 'Updated',
        description: 'Updated',
        variablesEnvironment: 'KEY=value',
        user_id: user1.id,
        tag_id: tag.id,
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
