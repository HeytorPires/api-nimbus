import 'reflect-metadata';
import ListTagService from '@modules/tags/services/ListTagService';
import FakeTagsRepository from '../repositories/FakeTagsRepository';
import FakeUsersRepository from '../../user/repositories/FakeUsersRepository';

let fakeTagsRepository: FakeTagsRepository;
let fakeUsersRepository: FakeUsersRepository;
let listTags: ListTagService;

describe('ListTag', () => {
  beforeEach(() => {
    fakeTagsRepository = new FakeTagsRepository();
    fakeUsersRepository = new FakeUsersRepository();
    listTags = new ListTagService(fakeTagsRepository);
  });

  it('should be able to list tags with pagination', async () => {
    const user = await fakeUsersRepository.create({
      name: 'João Silva',
      email: 'joao@gmail.com',
      password: '123456',
    });

    await fakeTagsRepository.create({ name: 'Tag 1', user_id: user.id });
    await fakeTagsRepository.create({ name: 'Tag 2', user_id: user.id });

    const result = await listTags.execute(user.id, 10, 1);

    expect(result).toBeDefined();
    expect(result!.data).toHaveLength(2);
    expect(result!.totalRows).toBe(2);
  });

  it('should return empty list when user has no tags', async () => {
    const result = await listTags.execute('user-without-tags', 10, 1);

    expect(result).toBeDefined();
    expect(result!.data).toHaveLength(0);
  });

  it('should paginate tags correctly', async () => {
    const user = await fakeUsersRepository.create({
      name: 'João Silva',
      email: 'joao@gmail.com',
      password: '123456',
    });

    for (let i = 1; i <= 5; i++) {
      await fakeTagsRepository.create({ name: `Tag ${i}`, user_id: user.id });
    }

    const page1 = await listTags.execute(user.id, 2, 1);
    expect(page1!.data).toHaveLength(2);
    expect(page1!.totalRows).toBe(5);

    const page2 = await listTags.execute(user.id, 2, 2);
    expect(page2!.data).toHaveLength(2);

    const page3 = await listTags.execute(user.id, 2, 3);
    expect(page3!.data).toHaveLength(1);
  });

  it('should only list tags belonging to the specified user', async () => {
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

    await fakeTagsRepository.create({
      name: 'Tag from User 1',
      user_id: user1.id,
    });
    await fakeTagsRepository.create({
      name: 'Tag from User 2',
      user_id: user2.id,
    });

    const result = await listTags.execute(user1.id, 10, 1);

    expect(result!.data).toHaveLength(1);
    expect(result!.data[0].name).toBe('Tag from User 1');
  });
});

