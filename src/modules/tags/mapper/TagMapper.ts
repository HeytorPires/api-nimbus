import { ITagDTO } from '../dtos/ITagDTO';
import { ITag } from '../domain/models/ITag';

export class TagMapper {
  toDTO(tag: ITag): ITagDTO {
    return {
      id: tag.id,
      name: tag.name,
      created_at: tag.created_at,
      userId: tag.user.id,
    };
  }

  toDTOList(tags: ITag[]): ITagDTO[] {
    return tags.map(tag => this.toDTO(tag));
  }
}
