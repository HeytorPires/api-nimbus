import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import { ITagRepository } from '../domain/repositories/ITagRepository';
import { ICreateTag } from '../domain/models/ICreateTag';
import { IUserRepository } from '@modules/users/domain/repositories/IUserRepository';
import { TagMapper } from '../mapper/TagMapper';
import { ITagDTO } from '../dtos/ITagDTO';

@injectable()
class CreateTagService {
  private readonly tagMapper: TagMapper;

  constructor(
    @inject('TagsRepository')
    private readonly tagsRepository: ITagRepository,
    @inject('UsersRepository')
    private readonly usersRepository: IUserRepository
  ) {
    this.tagMapper = new TagMapper();
  }

  public async execute({ name, userId }: ICreateTag): Promise<ITagDTO> {
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new AppError(`User not exist: ${userId}`, 'CreateTagService', 400);
    }

    const tagExistent = await this.tagsRepository.findByName(name, userId);

    if (tagExistent) {
      throw new AppError('Tag name already in use', 'CreateTagService', 400);
    }
    const tagCreated = await this.tagsRepository.create({
      name,
      userId,
    });

    return this.tagMapper.toDTO(tagCreated);
  }
}

export default CreateTagService;
