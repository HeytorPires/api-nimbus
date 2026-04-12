import { IPaginationReturn } from '@shared/interfaces/IPaginationReturn';
import { ICreateTag } from '../models/ICreateTag';
import { ITag } from '../models/ITag';
import User from '@modules/users/infra/typeorm/entities/User';

export interface ITagRepository {
  findByName(name: string, user: User): Promise<ITag | undefined>;
  findById(id: string): Promise<ITag | undefined>;
  list(
    userId: string,
    perPage: number,
    currentPage: number
  ): Promise<IPaginationReturn<ITag[]>>;
  create(data: ICreateTag): Promise<ITag>;
  update(tag: ITag): Promise<ITag | undefined>;
  save(tag: ITag): Promise<ITag>;
  remove(tag: ITag): Promise<void>;
}

