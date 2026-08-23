import 'reflect-metadata';
import ListProjectService from '@modules/projects/services/ListProjectService';
import FakeProjectsRepository from '../repositories/FakeProjectsRepository';
import FakeCryptoProvider from '../../../providers/fakes/FakeCryptoProvider';

let fakeProjectsRepository: FakeProjectsRepository;
let fakeCryptoProvider: FakeCryptoProvider;
let listProjects: ListProjectService;

describe('ListProject', () => {
  beforeEach(() => {
    fakeProjectsRepository = new FakeProjectsRepository();
    fakeCryptoProvider = new FakeCryptoProvider();
    listProjects = new ListProjectService(
      fakeProjectsRepository,
      fakeCryptoProvider
    );
  });

  it('should be able to list projects with pagination', async () => {
    const userId = 'user-id-1';

    await fakeProjectsRepository.create({
      title: 'Project 1',
      description: 'Description 1',
      variablesEnvironment: 'encrypted-KEY=value1',
      initializationVector: 'fake-iv',
      userId,
    });

    await fakeProjectsRepository.create({
      title: 'Project 2',
      description: 'Description 2',
      variablesEnvironment: 'encrypted-KEY=value2',
      initializationVector: 'fake-iv',
      userId,
    });

    const result = await listProjects.execute(10, 1, userId);

    expect(result.data).toHaveLength(2);
    expect(result.totalRows).toBe(2);
    expect(result.currentPage).toBe(1);
  });

  it('should return empty list when user has no projects', async () => {
    const result = await listProjects.execute(10, 1, 'user-without-projects');

    expect(result.data).toHaveLength(0);
    expect(result.totalRows).toBe(0);
  });

  it('should decrypt variables environment when listing', async () => {
    const userId = 'user-id-1';

    await fakeProjectsRepository.create({
      title: 'Project 1',
      description: 'Description 1',
      variablesEnvironment: 'encrypted-KEY=value',
      initializationVector: 'fake-iv',
      userId,
    });

    const result = await listProjects.execute(10, 1, userId);

    expect(result.data[0].variablesEnvironment).toBe('KEY=value');
  });

  it('should paginate correctly', async () => {
    const userId = 'user-id-1';

    for (let i = 1; i <= 5; i++) {
      await fakeProjectsRepository.create({
        title: `Project ${i}`,
        description: `Description ${i}`,
        variablesEnvironment: `encrypted-KEY=value${i}`,
        initializationVector: 'fake-iv',
        userId,
      });
    }

    const page1 = await listProjects.execute(2, 1, userId);
    expect(page1.data).toHaveLength(2);
    expect(page1.totalRows).toBe(5);

    const page2 = await listProjects.execute(2, 2, userId);
    expect(page2.data).toHaveLength(2);

    const page3 = await listProjects.execute(2, 3, userId);
    expect(page3.data).toHaveLength(1);
  });
});
