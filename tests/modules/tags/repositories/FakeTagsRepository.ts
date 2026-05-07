import { v4 as uuidv4 } from 'uuid';
import { ITagRepository } from '@modules/tags/domain/repositories/ITagRepository';
import Tag from '@modules/tags/infra/typeorm/entities/Tag';
import { ICreateTag } from '@modules/tags/domain/models/ICreateTag';
import User from '@modules/users/infra/typeorm/entities/User';
import { IPaginationReturn } from '@shared/interfaces/IPaginationReturn';

class FakeTagsRepository implements ITagRepository {
  private tags: Tag[] = [];

  private buildUser(userId: string): User {
    const user = new User();
    user.id = userId;

    return user;
  }

  public async create({ name, userId }: ICreateTag): Promise<Tag> {
    const tag = new Tag();

    tag.id = uuidv4();
    tag.name = name;
    tag.userId = userId;
    tag.user = this.buildUser(userId);
    tag.created_at = new Date();

    this.tags.push(tag);

    return tag;
  }

  public async save(tag: Tag): Promise<Tag> {
    const findIndex = this.tags.findIndex((findUser) => findUser.id === tag.id);

    this.tags[findIndex] = tag;

    return tag;
  }

  public async remove(tag: Tag): Promise<void> {
    this.tags = this.tags.filter((storedTag) => storedTag.id !== tag.id);
  }

  public async findAll(): Promise<Tag[]> {
    return this.tags;
  }

  public async update(tag: Tag): Promise<Tag | undefined> {
    const findIndex = this.tags.findIndex((findTag) => findTag.id === tag.id);

    if (findIndex === -1) {
      return undefined;
    }

    this.tags[findIndex] = tag;

    return tag;
  }

  public async list(
    userId: string,
    perPage: number,
    currentPage: number
  ): Promise<IPaginationReturn<Tag[]>> {
    const userTags = this.tags.filter((tag) => tag.user.id === userId);
    const pageSize = perPage > 0 ? perPage : userTags.length || 1;
    const page = currentPage > 0 ? currentPage : 1;
    const startIndex = (page - 1) * pageSize;

    return {
      perPage: pageSize,
      currentPage: page,
      totalRows: userTags.length,
      data: userTags.slice(startIndex, startIndex + pageSize),
    };
  }

  public async findByName(name: string, user: User): Promise<Tag | undefined> {
    const tag = this.tags.find(
      (storedTag) => storedTag.name === name && storedTag.user.id === user.id
    );

    return tag;
  }

  public async findById(id: string): Promise<Tag | undefined> {
    const tag = this.tags.find((tag) => tag.id === id);
    return tag;
  }
}

export default FakeTagsRepository;

