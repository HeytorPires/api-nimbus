import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import ShowProjectService from '@modules/projects/services/ShowProjectService';
import FakeProjectsRepository from '../repositories/FakeProjectsRepository';
import FakeCryptoProvider from '../../../providers/fakes/FakeCryptoProvider';

let fakeProjectsRepository: FakeProjectsRepository;
let fakeCryptoProvider: FakeCryptoProvider;
let showProject: ShowProjectService;

describe('ShowProject', () => {
  beforeEach(() => {
    fakeProjectsRepository = new FakeProjectsRepository();
    fakeCryptoProvider = new FakeCryptoProvider();
    showProject = new ShowProjectService(
      fakeProjectsRepository,
      fakeCryptoProvider
    );
  });

  it('should be able to show a project', async () => {
    const userId = 'user-id-1';

    const created = await fakeProjectsRepository.create({
      title: 'My Project',
      description: 'A test project',
      variablesEnvironment: 'encrypted-KEY=value',
      initializationVector: 'fake-iv',
      userId,
    });

    const project = await showProject.execute(created.id, userId);

    expect(project).toHaveProperty('id');
    expect(project.title).toBe('My Project');
    expect(project.variablesEnvironment).toBe('KEY=value');
  });

  it('should not be able to show a non-existing project', async () => {
    await expect(
      showProject.execute('non-existing-id', 'user-id')
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not allow access to project from another user', async () => {
    const created = await fakeProjectsRepository.create({
      title: 'My Project',
      description: 'A test project',
      variablesEnvironment: 'encrypted-KEY=value',
      initializationVector: 'fake-iv',
      userId: 'user-id-1',
    });

    await expect(
      showProject.execute(created.id, 'another-user-id')
    ).rejects.toBeInstanceOf(AppError);
  });
});
