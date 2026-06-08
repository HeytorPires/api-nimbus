import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import DeleteTagService from '@modules/tags/services/DeleteTagService';
import FakeTagsRepository from '../repositories/FakeTagsRepository';
import FakeUsersRepository from '../../user/repositories/FakeUsersRepository';

let fakeTagsRepository: FakeTagsRepository;
let fakeUsersRepository: FakeUsersRepository;
let deleteTag: DeleteTagService;

describe('DeleteTag', () => {
  beforeEach(() => {
    fakeTagsRepository = new FakeTagsRepository();
    fakeUsersRepository = new FakeUsersRepository();
    deleteTag = new DeleteTagService(fakeTagsRepository);
  });

  it('should be able to delete a tag', async () => {
    const user = await fakeUsersRepository.create({
      name: 'João Silva',
      email: 'joao@gmail.com',
      password: '123456',
    });

    const tag = await fakeTagsRepository.create({
      name: 'To Delete',
      user_id: user.id,
    });

    await expect(deleteTag.execute(tag.id)).resolves.not.toThrow();

    const found = await fakeTagsRepository.findById(tag.id);
    expect(found).toBeUndefined();
  });

  it('should not be able to delete a non-existing tag', async () => {
    await expect(deleteTag.execute('non-existing-id')).rejects.toBeInstanceOf(
      AppError
    );
  });
});

