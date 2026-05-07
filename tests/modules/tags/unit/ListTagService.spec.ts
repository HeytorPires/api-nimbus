import 'reflect-metadata';
import ListTagService from '@modules/tags/services/ListTagService';
import FakeTagsRepository from '../repositories/FakeTagsRepository';
import FakeUsersRepository from '../../user/repositories/FakeUsersRepository';

let fakeTagsRepository: FakeTagsRepository;
let fakeUsersRepository: FakeUsersRepository;
let listTagService: ListTagService;

describe('List Tags', () => {
  beforeEach(() => {
    fakeTagsRepository = new FakeTagsRepository();
    fakeUsersRepository = new FakeUsersRepository();
    listTagService = new ListTagService(fakeTagsRepository);
  });

  it('deve ser capaz de listar apenas as tags do usuário autenticado', async () => {
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

    await fakeTagsRepository.create({
      name: 'Infra',
      userId: user.id,
    });
    await fakeTagsRepository.create({
      name: 'Backend',
      userId: user.id,
    });
    await fakeTagsRepository.create({
      name: 'Frontend',
      userId: anotherUser.id,
    });

    const response = await listTagService.execute(user.id, 10, 1);

    expect(response).toMatchObject({
      perPage: 10,
      currentPage: 1,
      totalRows: 2,
    });
    expect(response?.data).toHaveLength(2);
    expect(response?.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'Infra',
          userId: user.id,
        }),
        expect.objectContaining({
          name: 'Backend',
          userId: user.id,
        }),
      ])
    );
  });
});
