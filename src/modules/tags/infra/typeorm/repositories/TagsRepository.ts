import { getRepository, Repository } from 'typeorm';
import { ITagRepository } from '../../../domain/repositories/ITagRepository';
import { ICreateTag } from '../../../domain/models/ICreateTag';
import { IUser } from '@modules/users/domain/models/IUser';
import Tag from '../entities/Tag';

export default class TagsRepository implements ITagRepository {
  private ormRepository: Repository<Tag>;

  constructor() {
    this.ormRepository = getRepository(Tag);
  }

  public async create({ name, userId }: ICreateTag): Promise<Tag> {
    const entity = this.ormRepository.create({
      name,
      user: { id: userId },
    });
    await this.ormRepository.save(entity);
    return entity;
  }

  public async save(tag: Tag): Promise<Tag> {
    await this.ormRepository.save(tag);
    return tag;
  }

  public async remove(tag: Tag): Promise<void> {
    await this.ormRepository.remove(tag);
  }

  public async list(userId: string): Promise<Tag[] | undefined> {
    const tags = await this.ormRepository.find({
      where: { user: { id: userId } },
      // relations: ['user'],
    });
    return tags;
  }

  public async findByName(name: string, user: IUser): Promise<Tag | undefined> {
    const entity = await this.ormRepository.findOne({
      where: { name, user: { id: user.id } },
    });
    return entity;
  }

  public async findById(id: string): Promise<Tag | undefined> {
    const tag = await this.ormRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    return tag;
  }

  public async update(tag: Tag): Promise<Tag | undefined> {
    await this.ormRepository
      .createQueryBuilder()
      .update(Tag)
      .set(tag)
      .where('id = :id', { id: tag.id })
      .execute();

    return await this.ormRepository.findOne({ where: { id: tag.id } });
  }
}

