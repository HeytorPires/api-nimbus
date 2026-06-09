import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import DeleteProjectService from '@modules/projects/services/DeleteProjectService';
import FakeProjectsRepository from '../repositories/FakeProjectsRepository';

let fakeProjectsRepository: FakeProjectsRepository;
let deleteProject: DeleteProjectService;

describe('DeleteProject', () => {
  beforeEach(() => {
    fakeProjectsRepository = new FakeProjectsRepository();
    deleteProject = new DeleteProjectService(fakeProjectsRepository);
  });

  it('should be able to delete a project', async () => {
    const project = await fakeProjectsRepository.create({
      title: 'My Project',
      description: 'A test project',
      variablesEnvironment: 'encrypted-KEY=value',
      InitializationVector: 'fake-iv',
      user_id: 'user-id-1',
    });

    await expect(deleteProject.execute(project.id)).resolves.not.toThrow();

    const found = await fakeProjectsRepository.findById(project.id);
    expect(found).toBeUndefined();
  });

  it('should not be able to delete a non-existing project', async () => {
    await expect(
      deleteProject.execute('non-existing-id')
    ).rejects.toBeInstanceOf(AppError);
  });
});
