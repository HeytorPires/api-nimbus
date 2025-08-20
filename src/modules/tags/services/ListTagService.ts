import { inject, injectable } from 'tsyringe';
import { ITagRepository } from '../domain/repositories/ITagRepository';
import { TagMapper } from '../mapper/TagMapper';
import { ITagDTO } from '../dtos/ITagDTO';

@injectable()
class ListTagService {
  private tagMapper: TagMapper;

  constructor(
    @inject('TagsRepository')
    private tagRepository: ITagRepository,
  ) {
    this.tagMapper = new TagMapper();
  }

  public async execute(userId: string): Promise<ITagDTO[] | undefined> {
    const tags = await this.tagRepository.list(userId);
    if (!tags) return undefined;
    return this.tagMapper.toDTOList(tags);
  }
}

export default ListTagService;
