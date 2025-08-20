import { inject, injectable } from 'tsyringe';
import { ITagRepository } from '../domain/repositories/ITagRepository';
import AppError from '@shared/errors/AppError';
import { TagMapper } from '../mapper/TagMapper';
import { ITagDTO } from '../dtos/ITagDTO';
import { IUpdateTag } from '../domain/models/IUpdateTag';

@injectable()
class UpdateTagService {
  private tagMapper: TagMapper;

  constructor(
    @inject('TagsRepository')
    private tagRepository: ITagRepository,
  ) {
    this.tagMapper = new TagMapper();
  }

  public async execute({ id, name, userId }: IUpdateTag): Promise<ITagDTO> {
    const tag = await this.tagRepository.findById(id);

    if (!tag) {
      throw new AppError('Tag not found.', 404);
    }

    if (tag.user.id !== userId) {
      throw new AppError('Access denied.', 403);
    }

    tag.name = name;

    await this.tagRepository.save(tag);

    return this.tagMapper.toDTO(tag);
  }
}

export default UpdateTagService;
