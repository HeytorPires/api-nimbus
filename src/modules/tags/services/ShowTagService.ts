import { inject, injectable } from 'tsyringe';
import { ITagRepository } from '../domain/repositories/ITagRepository';
import AppError from '@shared/errors/AppError';
import { TagMapper } from '../mapper/TagMapper';
import { ITagDTO } from '../dtos/ITagDTO';

@injectable()
class ShowTagService {
  private tagMapper: TagMapper;

  constructor(
    @inject('TagsRepository')
    private tagRepository: ITagRepository,
  ) {
    this.tagMapper = new TagMapper();
  }

  public async execute(id: string, userId: string): Promise<ITagDTO> {
    const tag = await this.tagRepository.findById(id);

    if (!tag) {
      throw new AppError('Tag not found.', 404);
    }

    if (tag.user.id !== userId) {
      throw new AppError('Access denied.', 403);
    }

    return this.tagMapper.toDTO(tag);
  }
}

export default ShowTagService;
