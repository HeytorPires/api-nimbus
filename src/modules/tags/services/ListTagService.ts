import { inject, injectable } from 'tsyringe';
import { ITagRepository } from '../domain/repositories/ITagRepository';
import { TagMapper } from '../mapper/TagMapper';
import { ITagDTO } from '../dtos/ITagDTO';
import { IPaginationReturn } from '@shared/interfaces/IPaginationReturn';

@injectable()
class ListTagService {
  private tagMapper: TagMapper;

  constructor(
    @inject('TagsRepository')
    private tagRepository: ITagRepository
  ) {
    this.tagMapper = new TagMapper();
  }

  public async execute(
    userId: string,
    perPage: number,
    currentPage: number
  ): Promise<IPaginationReturn<ITagDTO[]> | undefined> {
    const tags = await this.tagRepository.list(userId, perPage, currentPage);
    if (!tags) return undefined;
    return {
      ...tags,
      data: this.tagMapper.toDTOList(tags.data),
    };
  }
}

export default ListTagService;

